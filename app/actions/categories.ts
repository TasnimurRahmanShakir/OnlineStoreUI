"use server";

import { revalidatePath } from "next/cache";
import {
  CategoryFormValues,
  Category,
  ApiResponse,
  PaginatedResult,
} from "@/lib/types";
import { api } from "@/lib/api-client";

export interface CategoryOption {
  id: string;
  name: string;
}

// Backend returns the PaginatedResult directly
export async function getCategoriesAction(
  page: number = 1,
  limit: number = 10
) {
  return await api.get<PaginatedResult<Category>>("/Category", {
    params: { page, limit },
  });
}

export async function createCategoryAction(values: CategoryFormValues) {
  console.log(values);
  const result = await api.post<ApiResponse<Category>>("/Category/add", values);

  if (result.success) {
    revalidatePath("/admin/categories");
  }

  return result;
}

export async function updateCategoryAction(
  id: string,
  values: CategoryFormValues,
  path: string = "/admin/categories"
) {
  const result = await api.put<ApiResponse<Category>>(
    `/Category/update/${id}`,
    values
  );

  if (result.success) {
    revalidatePath(path);
  }

  return result;
}

export async function deleteCategoryAction(id: string) {
  const result = await api.del<boolean>(`/Category/delete/${id}`);

  if (result.success) {
    revalidatePath("/admin/categories");
  }

  return result;
}

export async function getCategoriesForProductAction() {
  const result = await api.get<{ items: CategoryOption[] }>(
    "/Category/CategoryName"
  );

  console.log(JSON.stringify(result.data));
  if (result.success && result.data) {
    return result.data;
  }
  return { items: [] };
}
