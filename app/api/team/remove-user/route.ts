import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function POST(req: Request) {
  // Only Admins can remove users
  const rbac = await requireRole(["Admin"], { method: "POST", req });
  if (rbac instanceof Response) return rbac;

  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Remove user from team (set teamId to null)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { teamId: null },
      select: { id: true, email: true, name: true }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Remove user error:", error);
    return NextResponse.json({ error: "Failed to remove user" }, { status: 500 });
  }
} 