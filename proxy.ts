import { NextRequest, NextResponse } from "next/server";

const HOME_SEEN_COOKIE = "scentora_home_seen";

export function proxy(request: NextRequest) {
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
    "/((?!api|admin|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
