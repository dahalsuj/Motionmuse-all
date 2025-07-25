import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Verify authentication
    const auth = await verifyAuth();
    if (!auth || !auth.email) {
      console.error("Auth verification failed:", auth);
      return NextResponse.json(
        { message: "Authentication failed" },
        { status: 401 }
      );
    }

    // Parse request data
    const data = await request.json();
    console.log("Received subscription data:", data);

    if (!data.plan || typeof data.plan !== "string") {
      console.error("Invalid plan data:", data);
      return NextResponse.json(
        { message: "Invalid subscription plan" },
        { status: 400 }
      );
    }

    // Validate plan type
    const validPlans = ["free", "pro", "enterprise"];
    if (!validPlans.includes(data.plan)) {
      console.error("Invalid plan type:", data.plan);
      return NextResponse.json(
        { message: "Invalid subscription plan type" },
        { status: 400 }
      );
    }

    console.log("Updating subscription for user:", auth.email);

    // Update user's subscription and mark onboarding as completed
    const updatedUser = await prisma.user.update({
      where: { 
        email: auth.email 
      },
      data: {
        plan: data.plan,
        onboardingCompleted: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        workspaceName: true,
        onboardingCompleted: true
      }
    });

    console.log("Successfully updated user:", updatedUser);

    // Determine the dashboard route based on the plan
    let dashboardRoute = "/dashboard";
    if (data.plan === "pro") {
      dashboardRoute = "/dashboard/pro";
    } else if (data.plan === "enterprise") {
      dashboardRoute = "/dashboard/enterprise";
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      dashboardRoute
    });
  } catch (error) {
    console.error("Subscription update error:", error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("Record to update not found")) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { message: `Subscription update failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Failed to update subscription" },
      { status: 500 }
    );
  }
} 