import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAuth } from "@/lib/auth"

export async function PATCH(request: Request) {
  try {
    const auth = await verifyAuth()
    const data = await request.json()

    // Validate the request data
    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      )
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: auth.email },
      data: {
        name: data.name,
        workspaceName: data.workspaceName,
        onboardingCompleted: data.onboardingCompleted,
      },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        workspaceName: true,
        onboardingCompleted: true,
      },
    })

    return NextResponse.json({
      user: {
        ...updatedUser,
        onboardingCompleted: updatedUser.onboardingCompleted,
      },
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    )
  }
} 