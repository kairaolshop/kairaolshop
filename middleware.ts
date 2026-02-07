import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // Public routes — bebas diakses
  if (
    pathname === "/" ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/category") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // ADMIN dashboard protection
  if (pathname.startsWith("/dashboard")) {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Favorites protection (hanya login user yang boleh)
  if (pathname.startsWith("/favorites")) {
    if (!token || !token.id) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/favorites/:path*"],
};
