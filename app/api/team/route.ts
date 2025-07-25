import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";

export const dynamic = 'force-dynamic'; // Force dynamic rendering

// GET /api/team
export async function GET() {
  // RBAC: All roles can read
  const rbac = await requireRole(["Admin", "Editor", "Viewer"], { method: "GET" });
  if (rbac instanceof Response) return rbac;

  try {
    const auth = await verifyAuth();
    console.log("Auth object:", auth);

    if (!auth || !auth.email) {
      console.log("Team API: Unauthorized - No auth or email.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: auth.email },
      select: {
        teamId: true,
      },
    });
    console.log("Team API: User lookup result:", user);

    if (!user) {
      console.log("Team API: User not found.");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.teamId) {
      console.log("Team API: User is not part of a team.");
      return NextResponse.json({ team: null });
    }

    const team = await prisma.team.findUnique({
      where: { id: user.teamId },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            plan: true,
            role: true,
          },
        },
        usage: true,
        brandKit: true,
        projects: true,
        videos: true,
        templates: true,
        invoices: true,
        permissions: true,
      },
    });
    console.log("Team API: Fetched team data:", team);

    if (!team) {
      console.log("Team API: Team not found for user.");
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json({ team });
  } catch (error) {
    console.error("Team API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 