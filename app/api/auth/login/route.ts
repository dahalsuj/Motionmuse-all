import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// Define schema for validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Custom error class for authentication errors
class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    const validation = loginSchema.safeParse({ email, password });
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

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        plan: true,
        workspaceName: true,
        onboardingCompleted: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: "No account found with this email address",
          error: "UserNotFound",
          errors: [{ field: "email", message: "No account found with this email address" }]
        },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Incorrect password",
          error: "InvalidPassword",
          errors: [{ field: "password", message: "Incorrect password" }]
        },
        { status: 401 }
      );
    }

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

    // Determine the redirect route based on onboarding status and plan
    let redirectTo = "/onboarding";
    if (user.onboardingCompleted) {
      switch (user.plan) {
        case "pro":
          redirectTo = "/dashboard/pro";
          break;
        case "enterprise":
          redirectTo = "/dashboard/enterprise";
          break;
        default:
          redirectTo = "/dashboard";
      }
    }

    // Create the response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        workspaceName: user.workspaceName,
        onboardingCompleted: user.onboardingCompleted,
      },
      redirectTo,
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
    console.error("Login error:", error);
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.message,
          error: error.name
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid input data",
          errors: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: "An unexpected error occurred. Please try again later.",
        error: "InternalServerError"
      },
      { status: 500 }
    );
  }
} 