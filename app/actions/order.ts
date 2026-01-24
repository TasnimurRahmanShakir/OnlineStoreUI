"use server";

import { api } from "@/lib/api-client";

export async function createOrderAction(data: any) {
  
  const result = await api.post("/Order/checkout", data);
  return result;
}
