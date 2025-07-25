import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'; // Force dynamic rendering

export async function GET() {
  try {
    const auth = await verifyAuth();
    if (!auth || !auth.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: auth.email },
      include: {
        team: {
          include: {
            usage: true,
          },
        },
      },
    });

    if (!user || !user.team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json({ usage: user.team.usage });
  } catch (error) {
    console.error("Error fetching team usage:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 