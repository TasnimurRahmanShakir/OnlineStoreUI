"use server";

import { revalidatePath } from "next/cache";
import { CategoryFormValues, Category, ApiResponse } from "@/lib/types";
import { api } from "@/lib/api-client";

export async function getCategoriesAction() {
  return await api.get<ApiResponse<Category[]>>("/Category");
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
  values: CategoryFormValues
) {
  const result = await api.put<ApiResponse<Category>>(
    `/categories/${id}`,
    values
  );

  if (result.success) {
    revalidatePath("/admin/categories");
  }

  return result;
}

export async function deleteCategoryAction(id: string) {
  const result = await api.del<boolean>(`/categories/${id}`);

  if (result.success) {
    revalidatePath("/admin/categories");
  }

  return result;
}
