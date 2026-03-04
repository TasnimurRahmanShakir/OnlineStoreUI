"use server";

import { revalidatePath } from "next/cache";

import { api } from "@/lib/api-client";

import { PaginatedResult, OrderSummary, OrderDetails } from "@/lib/types";

export async function createOrderAction(data: unknown) {
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

export async function getMyOrdersAction() {
  const result = await api.get<OrderSummary[]>("/Order/my-orders");
  return result;
}

export async function updateOrderStatusAction(id: string, status: string) {
  console.log("updateOrderStatusAction called", { id, status });
  const result = await api.patch(`/Order/${id}/status`, { Status: status });
  console.log("updateOrderStatusAction result", result);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return result;
}

export async function deleteOrderAction(id: string) {
  const result = await api.del(`/Order/delete/${id}`);
  revalidatePath("/admin/orders");
  return result;
}
