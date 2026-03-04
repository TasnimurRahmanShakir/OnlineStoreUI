"use server";

import { api } from "@/lib/api-client";
import { createSession, deleteSession } from "@/lib/session";
import { AuthResponse } from "@/lib/types";
import { redirect } from "next/navigation";

export async function registerAction(data: unknown) {
  const result = await api.post<AuthResponse>("/Auth/register", data);

  return result;
}

export async function loginAction(data: unknown) {
  const result = await api.post<AuthResponse>("/Auth/login", data);

  if (result.success && result.data) {
    try {
      console.log(result.data);
      await createSession(result.data);
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        error: "Connection to server failed. Please try again.",
      };
    }
  }

  return result;
}

export async function logoutAction() {
  await deleteSession();
  redirect("/");
}

export async function refreshToken(token: string, refreshToken: string) {
  const result = await api.post<AuthResponse>("/Auth/refresh-token", {
    token,
    refreshToken,
  });

  if (result.success && result.data) {
    return result.data;
  }

  return null;
}
