"use server";

import { api } from "@/lib/api-client";
import { revalidatePath } from "next/cache";
import { PaginatedResult, Product, NewArrivals } from "@/lib/types";

export async function createProductAction(formData: FormData) {
  const result = await api.post("/Product/add", formData);

  if (result.success) {
    console.log(JSON.stringify(result.data));
    revalidatePath("/admin/products");
  }

  return result;
}

export async function updateProductAction(formData: FormData) {
  console.log("updateProductAction", JSON.stringify(formData));
  const id = formData.get("id");
  const result = await api.put(`/Product/update/${id}`, formData);

  if (result.success) {
    revalidatePath("/admin/products");
  }

  return result;
}

export async function getProductAction(page: number = 1, limit: number = 10) {
  return await api.get<PaginatedResult<Product>>("/Product/all", {
    params: { page, limit },
  });
}

export async function deleteProductAction(id: string) {
  const result = await api.del(`/Product/delete/${id}`);

  if (result.success) {
    revalidatePath("/admin/products");
  }

  return result;
}

export async function deleteVariantAction(id: string) {
  return await api.del(`/Variant/Delete/${id}`);
}

export async function getProductByIdAction(id: string) {
  const result = await api.get<Product>(`/Product/${id}`);
  return result;
}

export async function getNewArrivalsAction() {
  const result = await api.get<NewArrivals[]>("/Product/new-arrivals");
  return result.success ? result.data || [] : [];
}
