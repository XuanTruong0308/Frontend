import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only apply middleware to admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Check if user has auth data in cookies or headers
    const authCookie = request.cookies.get("auth-token");
    const userCookie = request.cookies.get("user-data");

    // If no auth data, redirect to login
    if (!authCookie && !userCookie) {
      return NextResponse.redirect(
        new URL("/dang-nhap?redirect=/admin", request.url),
      );
    }

    // Additional role checking will be handled in the layout component
    // since we need to parse localStorage data there
  }

  // Handle partner routes
  if (request.nextUrl.pathname.startsWith("/partner")) {
    const authCookie = request.cookies.get("auth-token");
    const userCookie = request.cookies.get("user-data");

    if (!authCookie && !userCookie) {
      return NextResponse.redirect(
        new URL("/dang-nhap?redirect=/partner/dashboard", request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/partner/:path*"],
};
