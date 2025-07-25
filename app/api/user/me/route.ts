import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export const dynamic = 'force-dynamic'; // Force dynamic rendering

export async function GET() {
  try {
    const auth = await verifyAuth();
    if (!auth || !auth.email) {
      console.error("Error fetching user: Unauthorized - No auth or email");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: auth.email },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        teamId: true,
      },
    });

    if (!user) {
      console.error("Error fetching user: User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 