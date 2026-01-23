import "server-only";
import { cookies } from "next/headers";
import { AuthResponse } from "./types";
import { decodeJwt } from "jose";

export type UserSession = {
  id: string;
  token: string;
  refreshToken: string;
  fullName: string;
  email: string;
  role: string;
};

export async function createSession(authResponse: AuthResponse) {
  const claims = decodeJwt(authResponse.token);

  const userData = {
    id: authResponse.id,
    fullName: authResponse.fullName,
    email: authResponse.email,
    role: authResponse.role,
  };

  const cookieStore = await cookies();

  cookieStore.set("session_token", authResponse.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 30, // 30 minutes
    path: "/",
    sameSite: "lax",
  });

  cookieStore.set("refresh_token", authResponse.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
  });

  cookieStore.set("user_info", JSON.stringify(userData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  const userInfoStr = cookieStore.get("user_info")?.value;

  if (!userInfoStr || !refreshToken) return null;

  try {
    const user = JSON.parse(userInfoStr);
    return {
      token: token || "",
      refreshToken,
      ...user,
    };
  } catch {
    return null;
  }
}

export async function updateSession(session: UserSession) {
  const cookieStore = await cookies();

  cookieStore.set("session_token", session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 30,
    path: "/",
    sameSite: "lax",
  });

  cookieStore.set("refresh_token", session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
  });

  const { token, refreshToken, ...userData } = session;
  cookieStore.set("user_info", JSON.stringify(userData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
  cookieStore.delete("refresh_token");
  cookieStore.delete("user_info");
}
