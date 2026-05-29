import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { proxy } from "./proxy";

export default clerkMiddleware((_, request: NextRequest) => {
  // Preserve existing site "home seen" redirect behavior.
  return proxy(request);
});

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

