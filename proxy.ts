import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse, type NextFetchEvent } from "next/server";

const HOME_SEEN_COOKIE = "scentora_home_seen";

const clerk = clerkMiddleware();

export function proxy(request: NextRequest, event: NextFetchEvent) {
  // Let Clerk handle auth/proxy endpoints first.
  const clerkResponse = clerk(request, event);
  if (clerkResponse) {
    return clerkResponse;
  }

  const { pathname } = request.nextUrl;
  const hasSeenHome = request.cookies.has(HOME_SEEN_COOKIE);

  if (pathname.startsWith("/products")) {
    return NextResponse.next();
  }

  if (pathname !== "/" && !hasSeenHome) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.search = "";

    const response = NextResponse.redirect(homeUrl);
    response.cookies.set(HOME_SEEN_COOKIE, "1", {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      path: "/",
    });

    return response;
  }

  const response = NextResponse.next();

  if (pathname === "/" && !hasSeenHome) {
    response.cookies.set(HOME_SEEN_COOKIE, "1", {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: [
    // Clerk proxy endpoints (must be reachable).
    "/__clerk/(.*)",
    // API / RPC routes.
    "/(api|trpc)(.*)",
    // Everything else except static files and Next internals.
    "/((?!admin|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
