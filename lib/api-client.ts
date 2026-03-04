import { BASE_URL } from "./api-constants";

import { getSession } from "./session";
import { cookies } from "next/headers";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export const apiCall = async <T = unknown>(
  endpoint: string,
  {
    method = "GET",
    body,
    headers = {},
    params,
  }: { method?: string; body?: unknown; headers?: Record<string, string>; params?: Record<string, unknown> } = {},
) => {
  let url = `${BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (Array.isArray(value)) {
        value.forEach((val) => searchParams.append(key, val));
      } else if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const config: RequestInit = {
    method,
    cache: "no-store",
    headers: {
      ...headers,
    },
  };
  try {
    const session = await getSession();
    if (session?.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${session.token}`,
      };
    }
  } catch (error) {}

  if (body instanceof FormData) {
    config.body = body;
  } else {
    config.headers = {
      ...config.headers,
      "Content-Type": "application/json",
    };

    if (body) {
      config.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(url, config);
    console.log("🔵 API Call:", method, endpoint);
    console.log("🔵 Response Status:", response.status, response.statusText);
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage = "Unable to fetch data";

      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage =
          errorData.message ||
          errorData.error ||
          errorData.detail ||
          errorData.title ||
          JSON.stringify(errorData);
      } else {
        const text = await response.text();
        if (text) {
          if (text.trim().startsWith("<") || text.includes("<!DOCTYPE html>")) {
            console.log(text);
            errorMessage = "A server error occurred.";
          } else {
            errorMessage = text;
          }
        }
      }

      if (response.status === 401 && errorMessage === "Unable to fetch data") {
        errorMessage = "Unauthorized: Please login again.";
      }
      if (response.status === 403) {
        if (
          errorMessage === "Unable to fetch data" ||
          errorMessage.toLowerCase().includes("forbidden")
        ) {
          errorMessage = "You do not have permission to perform this action.";
        }
      }

      return { error: errorMessage, success: false };
    }

    const data = await response.json();
    console.log("🟢 Response Data:", data);
    return { success: true, data: data as T };
  } catch (error: unknown) {
    console.error("API Call Failed:", (error as Error).message);
    return { success: false, error: (error as Error).message };
  }
};

export const api = {
  get: <T = unknown>(endpoint: string, options = {}) =>
    apiCall<T>(endpoint, { method: "GET", ...options }),

  post: <T = unknown>(endpoint: string, body: unknown, options = {}) =>
    apiCall<T>(endpoint, { method: "POST", body, ...options }),

  put: <T = unknown>(endpoint: string, body: unknown, options = {}) =>
    apiCall<T>(endpoint, { method: "PUT", body, ...options }),

  del: <T = unknown>(endpoint: string, options = {}) =>
    apiCall<T>(endpoint, { method: "DELETE", ...options }),

  patch: <T = unknown>(endpoint: string, body: unknown, options = {}) =>
    apiCall<T>(endpoint, { method: "PATCH", body, ...options }),
};
