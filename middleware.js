import { clerkMiddleware, createRouteMatcher, redirectToSignIn } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/organisation(.*)",
  "/project(.*)",
  "/issue(.*)",
  "/sprint(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const { userId, orgId } = auth(); // call once

  if (!userId && isProtectedRoute(req)) {
    // Use the helper function instead of auth().redirectToSignIn()
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  if (userId && !orgId && req.nextUrl.pathname !== "/onboarding" && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
