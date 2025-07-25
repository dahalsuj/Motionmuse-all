import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { requireRole } from "@/lib/rbac";

function generateTeamCode(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}

export async function POST(req: Request) {
  console.log("TEAM CREATE ENDPOINT CALLED");
    const auth = await verifyAuth();
  console.log("Auth object in team create:", auth);
  // RBAC: All roles can create if not in a team
  const rbac = await requireRole(["Admin", "Editor", "Viewer"], { method: "POST", req });
  if (rbac instanceof Response) return rbac;

  try {
    const body = await req.json();
    console.log("Request body:", body);
    const { teamName } = body;
    if (!auth || !auth.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Check if user is already in a team
    const user = await prisma.user.findUnique({ where: { email: auth.email } });
    if (user?.teamId) {
      const existingTeam = await prisma.team.findUnique({ where: { id: user.teamId } });
      console.log("User already has a team, returning existing team:", existingTeam);
      return NextResponse.json({ team: existingTeam });
    }

    // Validate team name
    if (!teamName || typeof teamName !== 'string' || teamName.length < 2 || teamName.length > 50) {
      return NextResponse.json({ error: 'Invalid team name.' }, { status: 400 });
    }

    // Generate a unique team code
    let code: string | undefined;
    let exists = true;
    while (exists) {
      code = generateTeamCode();
      exists = !!(await prisma.team.findUnique({ where: { code } }));
    }

    console.log("Creating team for user:", auth.email);
    // Create the team with all necessary related records
    const team = await prisma.team.create({
      data: {
        name: teamName,
        code: code!, // assert code is always set
        // Create team usage
        usage: {
          create: {
            videosThisMonth: 0,
            quota: 300, // Enterprise tier quota
            activeUsers: 1,
          }
        },
        // Create brand kit
        brandKit: {
          create: {
            fonts: [],
            colors: [],
          }
        },
        // Create permissions for the team creator (Admin)
        permissions: {
          create: {
            role: "Admin",
            view: true,
            edit: true,
            delete: true,
            billing: true,
          }
        }
      },
    });

    console.log("Updating user with teamId:", team.id);
    // Update the user to set their teamId and assign Admin role
    await prisma.user.update({
      where: { email: auth.email },
      data: { 
        teamId: team.id,
        role: "Admin" // Assign Admin role to team creator
      },
    });
    console.log("User updated with new teamId.");

    return NextResponse.json({ team });
  } catch (error) {
    console.error("Error in /api/team/create:", error);
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : error }, { status: 500 });
  }
} 