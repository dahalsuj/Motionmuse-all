import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export const dynamic = 'force-dynamic'; // Force dynamic rendering

// GET /api/brand-kit - Get user's brand kit
export async function GET() {
  try {
    const auth = await verifyAuth();
    console.log('API Brand Kit GET - Auth:', auth);
    if (!auth || !auth.email) {
      console.log('API Brand Kit GET - Unauthorized: No auth or email.');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: auth.email },
      include: {
        brandKit: true,
        team: {
          include: {
            brandKit: true,
          },
        },
      },
    });
    console.log('API Brand Kit GET - User:', user);

    if (!user) {
      console.log('API Brand Kit GET - User not found.');
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return team brand kit if user is part of a team, otherwise return user's brand kit
    const brandKit = user.team?.brandKit || user.brandKit;
    console.log('API Brand Kit GET - Brand Kit Data:', brandKit);
    return NextResponse.json({ brandKit });
  } catch (error) {
    console.error("Error fetching brand kit:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/brand-kit - Create or update brand kit
export async function POST(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth || !auth.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { colors, fonts, images, audio } = data;

    const user = await prisma.user.findUnique({
      where: { email: auth.email },
      include: {
        team: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If user is part of a team, update team's brand kit
    if (user.team) {
      const brandKit = await prisma.brandKit.upsert({
        where: {
          teamId: user.team.id,
        },
        update: {
          colors: colors || [],
          fonts: fonts || [],
          images: images || [],
          audio: audio || [],
        },
        create: {
          teamId: user.team.id,
          colors: colors || [],
          fonts: fonts || [],
          images: images || [],
          audio: audio || [],
        },
      });
      return NextResponse.json({ brandKit });
    }

    // Otherwise, update user's personal brand kit
    const brandKit = await prisma.brandKit.upsert({
      where: {
        userId: user.id,
      },
      update: {
        colors: colors || [],
        fonts: fonts || [],
        images: images || [],
        audio: audio || [],
      },
      create: {
        userId: user.id,
        colors: colors || [],
        fonts: fonts || [],
        images: images || [],
        audio: audio || [],
      },
    });

    return NextResponse.json({ brandKit });
  } catch (error) {
    console.error("Error updating brand kit:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/brand-kit - Delete brand kit
export async function DELETE() {
  try {
    const auth = await verifyAuth();
    if (!auth || !auth.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: auth.email },
      include: {
        team: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If user is part of a team, delete team's brand kit
    if (user.team) {
      await prisma.brandKit.delete({
        where: {
          teamId: user.team.id,
        },
      });
    } else {
      // Otherwise, delete user's personal brand kit
      await prisma.brandKit.delete({
        where: {
          userId: user.id,
        },
      });
    }

    return NextResponse.json({ message: "Brand kit deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand kit:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 