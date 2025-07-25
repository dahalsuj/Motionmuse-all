import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { sendTeamInvite } from "@/lib/email";
import { randomBytes } from "crypto";
import { requireRole } from "@/lib/rbac";

const VALID_ROLES = ["Admin", "Editor", "Viewer"];

export async function POST(req: Request) {
  // RBAC: Only Admins can invite
  const rbac = await requireRole(["Admin"], { method: "POST", req });
  if (rbac instanceof Response) return rbac;

  try {
    const { email, role, message } = await req.json();
    console.log('[INVITE] Received:', { email, role, message });
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (!role || !VALID_ROLES.includes(role)) {
      return NextResponse.json({ error: "Invalid role. Must be Admin, Editor, or Viewer." }, { status: 400 });
    }
    if (message && typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message." }, { status: 400 });
    }

    const auth = await verifyAuth();
    if (!auth || !auth.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get the requesting user and their team
    const user = await prisma.user.findUnique({ where: { email: auth.email } });
    if (!user?.teamId) return NextResponse.json({ error: "No team found" }, { status: 404 });

    // Only admin can invite (for now, assume the team creator is admin)
    const team = await prisma.team.findUnique({
      where: { id: user.teamId },
      include: { members: true, invitations: true }
    });
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    // Check if user is already in the team
    const existingMember = team.members.find(member => member.email === email);
    if (existingMember) {
      return NextResponse.json({ error: "User is already a member of this team" }, { status: 400 });
    }

    // Check if there's already a pending invitation for this email
    const existingInvitation = team.invitations.find(inv => inv.email === email && !inv.accepted);
    if (existingInvitation) {
      return NextResponse.json({ error: "An invitation has already been sent to this email" }, { status: 400 });
    }

    // Check if the invited user exists and is already in another team
    const invitedUser = await prisma.user.findUnique({ where: { email } });
    if (invitedUser?.teamId) {
      return NextResponse.json({ error: "User is already part of another team" }, { status: 400 });
    }

    // Create invitation
    const inviteToken = randomBytes(32).toString('hex');
    const invitation = await prisma.invitation.create({
      data: {
        email,
        teamId: team.id,
        token: inviteToken,
        role,
        message: message || null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    // Send invitation email
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/join-team?token=${inviteToken}&team=${team.id}`;
    
    console.log('[INVITE] Sending invite email to:', email, 'with inviteUrl:', inviteUrl, 'inviter:', user.name || user.email, 'team:', team.name);
    await sendTeamInvite({
      inviteeEmail: email,
      inviterName: user.name || user.email,
      teamName: team.name,
      inviteUrl
    });

    // Refresh team data
    const updatedTeam = await prisma.team.findUnique({
      where: { id: team.id },
      include: { members: true }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Invitation sent successfully",
      team: updatedTeam 
    });

  } catch (error) {
    console.error('Team invite error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to send invitation" 
    }, { status: 500 });
  }
} 