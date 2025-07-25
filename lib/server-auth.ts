import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, JWTPayload } from "./auth";

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function verifyAuth() {
  console.log("Auth - Starting token verification");
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    console.log("Auth - No token found");
    throw new AuthError("Authentication required. Please log in to continue.", 401);
  }

  try {
    console.log("Auth - Verifying token");
    const payload = await verifyToken(token);
    
    if (!payload) {
      throw new AuthError("Invalid token payload", 401);
    }

    return payload;
  } catch (error) {
    console.error("Auth - Token verification failed:", error);
    if (error instanceof Error && error.name === 'JWTExpired') {
      throw new AuthError("Your session has expired. Please log in again.", 401);
    }
    throw new AuthError("Invalid authentication token. Please log in again.", 401);
  }
}

export function getErrorResponse(error: Error) {
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

  return NextResponse.json(
    { 
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      error: "InternalServerError"
    },
    { status: 500 }
  );
} 