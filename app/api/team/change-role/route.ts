import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, ROLES } from "@/lib/rbac";

export async function POST(req: Request) {
  // Only Admins can change roles
  const rbac = await requireRole(["Admin"], { method: "POST", req });
  if (rbac instanceof Response) return rbac;

  try {
    const { userId, newRole } = await req.json();
    if (!userId || !newRole) {
      return NextResponse.json({ error: "Missing userId or newRole" }, { status: 400 });
    }
    if (!ROLES.includes(newRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Update user's role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: { id: true, email: true, name: true, role: true }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Change role error:", error);
    return NextResponse.json({ error: "Failed to change role" }, { status: 500 });
  }
} 