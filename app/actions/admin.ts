"use server";

import { api } from "@/lib/api-client";
import { revalidatePath } from "next/cache";

export async function getAllAdmins() {
  return await api.get("/Admin");
}

export async function createAdmin(data: unknown) {
  const result = await api.post("/Admin", data);
  if (result.success) {
    revalidatePath("/admin/admins");
  }
  return result;
}

export async function updateAdmin(id: string, data: unknown) {
  const result = await api.put(`/Admin/${id}`, data);
  if (result.success) {
    revalidatePath("/admin/admins");
  }
  return result;
}

export async function deleteAdmin(id: string) {
  const result = await api.del(`/Admin/${id}`);
  if (result.success) {
    revalidatePath("/admin/admins");
  }
  return result;
}
