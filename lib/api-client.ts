import { BASE_URL } from "./api-constants";

import { getSession } from "./session";
import { cookies } from "next/headers";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export const apiCall = async <T = any>(
  endpoint: string,
  {
    method = "GET",
    body,
    headers = {},
    params,
  }: { method?: string; body?: any; headers?: any; params?: any } = {},
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
  } catch (error) {
  }

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
    console.log("url: " + url);
    console.log("config: " + JSON.stringify(config));
    console.log("body: " + JSON.stringify(body));
    const response = await fetch(url, config);

    console.log("response: " + url + JSON.stringify(response));
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage = "Unable to fetch data";

      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        errorMessage = await response.text();
      }
      return { error: errorMessage, success: false };
    }

    const data = await response.json();
    return { success: true, data: data as T };
  } catch (error: any) {
    console.error("API Call Failed:", error.message);
    return { success: false, error: error.message };
  }
};

export const api = {
  get: <T = any>(endpoint: string, options = {}) =>
    apiCall<T>(endpoint, { method: "GET", ...options }),

  post: <T = any>(endpoint: string, body: any, options = {}) =>
    apiCall<T>(endpoint, { method: "POST", body, ...options }),

  put: <T = any>(endpoint: string, body: any, options = {}) =>
    apiCall<T>(endpoint, { method: "PUT", body, ...options }),

  del: <T = any>(endpoint: string, options = {}) =>
    apiCall<T>(endpoint, { method: "DELETE", ...options }),
};
