import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession, updateSession } from "@/lib/session";
import { refreshToken } from "@/app/actions/auth";
import { decodeJwt } from "jose";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isProtected = isAdminRoute;

  if (!session) {
    if (isProtected) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (session.role === "Admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAdminRoute && session.role !== "Admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
      const { exp } = decodeJwt(session.token);
      console.log(exp); 
    const now = Math.floor(Date.now() / 1000);
    if (exp && exp - now <= 60 * 30) {
      const newTokens = await refreshToken(session.token, session.refreshToken);

      if (newTokens && newTokens.token) {
        session.token = newTokens.token;
        session.refreshToken = newTokens.refreshToken;

        await updateSession(session);
      } else {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("session_token");
        response.cookies.delete("refresh_token");
        response.cookies.delete("user_info");
        return response;
      }
    }
  } catch (e) {
    console.error("Middleware refresh token error", e);
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("user_info");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
