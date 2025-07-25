export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await verifyAuth();
    if (!auth || !auth.email) {
      return NextResponse.json({ 
        authenticated: false 
      }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: auth.email },
      select: {
        id: true,
        email: true,
        plan: true,
        onboardingCompleted: true,
      },
    });

    if (!user) {
      return NextResponse.json({ 
        authenticated: false 
      }, { status: 404 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ 
      authenticated: false,
      error: "Failed to verify authentication" 
    }, { status: 500 });
  }
} 