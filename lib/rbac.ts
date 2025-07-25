import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export const ROLES = ["Admin", "Editor", "Viewer"] as const;

export async function requireRole(
  allowedRoles: string[],
  opts?: { teamIdRequired?: boolean; method?: string; teamIdFromUser?: boolean; req?: Request }
) {
  // 1. Auth check
  const auth = await verifyAuth();
  if (!auth || !auth.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Fetch user (and optionally team)
  const user = await prisma.user.findUnique({
    where: { email: auth.email },
    select: { id: true, email: true, role: true, teamId: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 3. Optionally require teamId
  if (opts?.teamIdRequired && !user.teamId) {
    return NextResponse.json({ error: "No team found" }, { status: 403 });
  }

  // 4. Role check
  const userRole = user.role || "Viewer";
  if (!allowedRoles.includes(userRole)) {
    return NextResponse.json({ error: "Forbidden: insufficient role" }, { status: 403 });
  }

  // 5. Optionally check HTTP method for Viewer
  if (userRole === "Viewer" && opts?.method && opts.method !== "GET") {
    return NextResponse.json({ error: "Forbidden: read-only access" }, { status: 403 });
  }

  // 6. Return user (for convenience)
  return { user };
} 