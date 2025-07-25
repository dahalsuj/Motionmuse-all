import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.set({
      name: "token",
      value: "",
      path: "/",
      expires: new Date(0),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Failed to logout" },
      { status: 500 }
    );
  }
} 