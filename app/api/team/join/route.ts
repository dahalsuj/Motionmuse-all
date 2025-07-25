import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { token, teamId, name, password } = await req.json();
    
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
        team: true
      }
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invalid or expired invitation token" }, { status: 400 });
  }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: invitation.email }
    });

    let userId: string;

    if (existingUser) {
      // User exists - update their team and name if provided
      const updateData: any = {
        teamId: teamId
      };

      if (name && name.trim()) {
        updateData.name = name.trim();
      }

  await prisma.user.update({
        where: { id: existingUser.id },
        data: updateData
      });

      userId = existingUser.id;
    } else {
      // Create new user
      if (!password || !name) {
        return NextResponse.json({ error: "Name and password are required for new users" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = await prisma.user.create({
        data: {
          email: invitation.email,
          name: name.trim(),
          password: hashedPassword,
          plan: 'free',
          teamId: teamId
        }
      });

      userId = newUser.id;
    }

    // Mark invitation as accepted
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { accepted: true }
  });

    return NextResponse.json({ 
      success: true, 
      message: "Successfully joined team",
      team: invitation.team,
      user: {
        id: userId,
        email: invitation.email,
        name: name || existingUser?.name
      }
    });

  } catch (error) {
    console.error('Team join error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to join team" 
    }, { status: 500 });
  }
} 