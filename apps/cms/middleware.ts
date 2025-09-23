import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { validateDevAutoLogin } from "@/lib/dev-utils";

const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/_next/(.*)",
  "/favicon.ico",
  "/(.*\\.png|.*\\.svg|.*\\.jpg|.*\\.webp)",
  "/robots.txt",
  "/sitemap.xml",
  "/api/webhooks/clerk",
  "/api/webhooks/stripe",
  "/dev/ensure", // Allow dev bootstrap route
  "/dev/logout", // Allow dev logout route
  "/dev/ticket", // Allow dev ticket handler route
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // If user is signed in and trying to access auth pages, redirect to dashboard
  if (userId && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Dev auto-login logic
  if (!userId && !isPublicRoute(req)) {
    // Check if dev auto-login should be triggered
    if (validateDevAutoLogin(req)) {
      return NextResponse.redirect(new URL("/dev/ensure", req.url));
    }
  }

  // Protect all non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
