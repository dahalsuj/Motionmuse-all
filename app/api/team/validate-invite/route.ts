import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token, teamId } = await req.json();
    
    if (!token || !teamId) {
      return NextResponse.json({ error: "Missing token or team ID" }, { status: 400 });
    }

    // Find invitation by token
    const invitation = await prisma.invitation.findFirst({
      where: {
        token: token,
        teamId: teamId,
        expiresAt: {
          gt: new Date()
        },
        accepted: false
      },
      include: {
        team: {
          include: {
            members: true
          }
        }
      }
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invalid or expired invitation token" }, { status: 400 });
    }

    // Find inviter (first admin in team)
    const inviter = invitation.team.members.find(m => m.role === "Admin") || invitation.team.members[0];

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: invitation.email }
    });

    return NextResponse.json({ 
      invitation: {
        id: invitation.id,
        email: invitation.email,
        expiresAt: invitation.expiresAt,
        role: invitation.role,
        message: invitation.message,
        inviterName: inviter?.name || "Team Admin",
        org: invitation.team.name
      },
      team: {
        id: invitation.team.id,
        name: invitation.team.name
      },
      existingUser: existingUser ? {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name
      } : null
    });

  } catch (error) {
    console.error('Validate invite error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to validate invitation" 
    }, { status: 500 });
  }
} 