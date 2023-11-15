// pages/_middleware.ts or pages/_middleware.js
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const path = req.nextUrl.pathname;

  const adminOnlyPaths = ["/admin", "/question"]; // paths that only admin can access
  const userOnlyPaths = ["/matching", "/onboarding", "/collab", "/home"];

  if (token && token.role && path.includes("/onboarding")) {
    const unauthorizedUrl = new URL("/unauthorized", req.url);
    unauthorizedUrl.searchParams.set(
      "message",
      "Unable to access this page anymore",
    );
    return NextResponse.redirect(unauthorizedUrl);
  }

  if (token && token.role === "ADMIN") {
    // If the user has a valid token and is an admin, allow all routes
    return NextResponse.next();
  }

  if (token && userOnlyPaths.includes(path)) {
    return NextResponse.next();
  }

  if (adminOnlyPaths.includes(path)) {
    const unauthorizedUrl = new URL("/unauthorized", req.url);
    unauthorizedUrl.searchParams.set("message", "Admin access only");
    return NextResponse.redirect(unauthorizedUrl);
  }

  // If the user doesn't have a valid token and is trying to access protected routes, redirect to login
  const unauthorizedUrl = new URL("/unauthorized", req.url);
  unauthorizedUrl.searchParams.set(
    "message",
    "This is a protected page! Please login ",
  );
  return NextResponse.redirect(unauthorizedUrl);
}

export const config = {
  matcher: [
    "/admin",
    "/collab",
    "/home",
    "/matching",
    "/onboarding",
    "/questions",
  ],
};
