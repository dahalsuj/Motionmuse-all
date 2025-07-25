import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { cookies } from "next/headers";
import { z } from "zod";

// Define schema for validation
const signupSchema = z.object({
  name: z.string()
    .min(1, "Please enter your name")
    .max(50, "Name must be less than 50 characters"),
  email: z.string()
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
    .max(100, "Password must be less than 100 characters"),
  plan: z.string()
    .refine(value => ["free", "enterprise"].includes(value), "Please select either the free or enterprise plan")
    .default("free"),
});

// Custom error class for authentication errors
class AuthError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'AuthError';
  }
}

function generateTeamCode(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate input using zod
    const validation = signupSchema.safeParse(data);
    if (!validation.success) {
      const errors = validation.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return NextResponse.json(
        { 
          success: false, 
          message: "Please fix the following errors:",
          errors,
          error: "ValidationError"
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: "An account with this email already exists",
          error: "EmailExists",
          errors: [{ field: "email", message: "An account with this email already exists" }]
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Generate a unique team code
    let code;
    let exists = true;
    while (exists) {
      code = generateTeamCode();
      exists = await prisma.team.findUnique({ where: { code } });
    }

    // Create user with team and related records
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        plan: data.plan, // Set to selected plan
        onboardingCompleted: false,
        role: data.plan === "enterprise" ? "Admin" : "Admin", // All users get Admin role for their own team
        // Create team for all users
        team: {
          create: {
            name: `${data.name}'s Team`, // Use user's name for team name
            code: code,
            usage: {
              create: {
                videosThisMonth: 0,
                quota: data.plan === "enterprise" ? 300 : 10, // Different quota based on plan
                activeUsers: 1,
              }
            },
            brandKit: {
              create: {
                fonts: [],
                colors: [],
              }
            },
            permissions: {
              create: {
                role: "Admin", // Uppercase for consistency
                view: true,
                edit: true,
                delete: true,
                billing: true,
              }
            }
          }
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        workspaceName: true,
        onboardingCompleted: true,
        teamId: true,
      },
    });

    // Generate JWT token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    
    const token = await new jose.SignJWT({ 
      userId: user.id, 
      email: user.email 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    // Create the response
    const response = NextResponse.json({
      success: true,
      message: "Account created successfully",
      user,
      redirectTo: "/onboarding"
    });

    // Set the authentication cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.message,
          error: error.name,
          errors: [{ field: "general", message: error.message }]
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return NextResponse.json(
        { 
          success: false, 
          message: "Please fix the following errors:",
          errors,
          error: "ValidationError"
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: "An unexpected error occurred. Please try again later.",
        error: "InternalServerError",
        errors: [{ field: "general", message: "An unexpected error occurred. Please try again later." }]
      },
      { status: 500 }
    );
  }
} 