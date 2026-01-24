import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, isTokenExpiring } from "@/lib/auth-edge";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const protectedRoutes = ["/profile", "/cart", "/admin"];
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("session_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  let user = token ? await verifyToken(token) : null;

  if (user && authRoutes.includes(pathname)) {
    if ((user as any).role === "Admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (refreshToken && (!user || (token && isTokenExpiring(token)))) {
    try {
      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Auth/refresh-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: token || "", refreshToken }),
        },
      );

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const newAccessToken = data.token || data.accessToken;
        const newRefreshToken = data.refreshToken;

        if (newAccessToken) {
          const requestHeaders = new Headers(request.headers);
          requestHeaders.set(
            "cookie",
            `session_token=${newAccessToken}; refresh_token=${newRefreshToken || refreshToken}`,
          );

          const response = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });

          response.cookies.set("session_token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 30,
          });

          if (newRefreshToken) {
            response.cookies.set("refresh_token", newRefreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              maxAge: 60 * 60 * 24 * 7, // 7 days
            });
          }

          return response;
        }
      }
    } catch (error) {
      // console.error("Middleware refresh failed:", error);
    }
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAdminRoute = pathname.startsWith("/admin");

  if (isProtectedRoute) {
    if (!user) {
      // Redirect to login, preserving the return URL
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute && (user as any).role !== "Admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
