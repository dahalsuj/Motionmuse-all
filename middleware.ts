import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup", "/about", "/contact", "/services", "/pricing", "/terms", "/privacy"];

// Add routes that require authentication but don't require onboarding
const authRoutes = ["/onboarding"];

// Add API routes that should bypass the middleware
const bypassRoutes = ["/api/auth/check", "/api/auth/login", "/api/auth/signup", "/api/auth/logout"];

// Add static asset paths that should bypass the middleware
const staticPaths = [
  "/_next",
  "/images",
  "/fonts",
  "/favicon.ico",
  "/sitemap.xml",
  "/robots.txt",
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Bypass middleware for static assets
  if (staticPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
  
  // Check if it's a bypass route
  const isBypassRoute = bypassRoutes.some(route => pathname.startsWith(route));

  // If it's a public or bypass route, allow access without any checks
  if (isPublicRoute || isBypassRoute) {
    return NextResponse.next();
  }

  // For all other routes, check authentication
  try {
    // Verify authentication
    const token = request.cookies.get("token");
    
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check authentication status using the API route
    const authCheckResponse = await fetch(new URL("/api/auth/check", request.url), {
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (!authCheckResponse.ok) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }

    const authData = await authCheckResponse.json();

    if (!authData.authenticated || !authData.user) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }

    // Handle routing based on onboarding status
    if (!pathname.startsWith("/onboarding")) {
      if (!authData.user.onboardingCompleted && !authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }

      // If onboarding is completed, ensure user is on the correct dashboard
      if (authData.user.onboardingCompleted && pathname === "/onboarding") {
        const dashboardPath = authData.user.plan === "pro" 
          ? "/dashboard/pro" 
          : authData.user.plan === "enterprise" 
            ? "/dashboard/enterprise" 
            : "/dashboard";
        return NextResponse.redirect(new URL(dashboardPath, request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // On error, redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ (API routes)
     * 2. /_next/ (Next.js internals)
     * 3. /fonts/ (inside public directory)
     * 4. /favicon.ico, /sitemap.xml (public files)
     */
    "/((?!api|_next|fonts|favicon.ico|sitemap.xml|images).*)",
  ],
}; 