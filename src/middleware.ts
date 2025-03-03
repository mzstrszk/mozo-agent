import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session");

  // Check if the user is authenticated
  if (!session && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

// Define which routes require authentication
function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    "/chat",
    "/settings",
    "/settings/account",
  ];

  return protectedRoutes.some(route => pathname.startsWith(route));
}

export const config = {
  matcher: [
    "/chat/:path*",
    "/settings/:path*",
  ],
};