"use server";

import { api } from "@/lib/api-client";

import { PaginatedResult, OrderSummary, OrderDetails } from "@/lib/types";

export async function createOrderAction(data: any) {
  const result = await api.post("/Order/checkout", data);
  return result;
}

export async function getAllOrdersAction(page: number = 1, limit: number = 10) {
  const result = await api.get<PaginatedResult<OrderSummary>>(
    `/Order/all?page=${page}&limit=${limit}`,
  );
  return result;
}

export async function getOrderByIdAction(id: string) {
  const result = await api.get<OrderDetails>(`/Order/details/${id}`);
  return result;
}
