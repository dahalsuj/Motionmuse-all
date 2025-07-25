import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateTeamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
});

export async function PATCH(request: Request) {
  try {
    const auth = await verifyAuth();
    
    // Get the user and their plan
    const user = await prisma.user.findUnique({
      where: { email: auth.email },
      select: { teamId: true, plan: true },
    });

    // Check if user is on enterprise plan
    if (user?.plan !== "enterprise") {
      return NextResponse.json(
        { error: "Team features are only available for enterprise plan users" },
        { status: 403 }
      );
    }

    if (!user?.teamId) {
      return NextResponse.json({ error: "No team found" }, { status: 404 });
    }

    const data = await request.json();
    const validation = updateTeamSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    // Update team name
    const team = await prisma.team.update({
      where: { id: user.teamId },
      data: { name: data.name },
    });

    return NextResponse.json({ success: true, team });
  } catch (error) {
    console.error("Team update error:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
} 