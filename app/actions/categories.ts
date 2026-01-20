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
  limit: number = 10,
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
  path: string = "/admin/categories",
) {
  const result = await api.put<ApiResponse<Category>>(
    `/Category/update/${id}`,
    values,
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
    "/Category/CategoryName",
  );

  console.log(JSON.stringify(result.data));
  if (result.success && result.data) {
    return result.data;
  }
  return { items: [] };
}

export async function getAllCategoriesAction(isPaged: boolean = false) {
  const config = isPaged
    ? { params: { page: 1, limit: 10 } }
    : { params: { page: 1, limit: 1000 } };

  const result = await api.get<any>("/Category", config);

  if (result.success && result.data) {
    // If raw array, return it (unlikely given PaginatedResult type, but unsafe cast in api-client allows it)
    if (Array.isArray(result.data)) {
      return result.data as unknown as Category[];
    }

    const firstPageItems = result.data.items || [];
    // If paged mode or no more pages, return what we have
    if (isPaged || !result.data.hasNextPage) {
      // console.log(`getAllCategoriesAction: fetching ${firstPageItems.length} items (Page 1/${result.data.totalPages || 1})`);
      return firstPageItems;
    }

    // If "fetch all" mode and multiple pages exist
    const totalPages = result.data.totalPages;
    // console.log(`getAllCategoriesAction: fetching Page 1 of ${totalPages}. Triggering recursive fetch...`);

    const pagePromises = [];
    for (let page = 2; page <= totalPages; page++) {
      pagePromises.push(
        api.get<PaginatedResult<Category>>("/Category", {
          params: { page, limit: result.data.pageSize },
        }),
      );
    }

    const otherPagesResults = await Promise.all(pagePromises);
    const allItems = [...firstPageItems];

    otherPagesResults.forEach((res, index) => {
      if (res.success && res.data && res.data.items) {
        // console.log(`getAllCategoriesAction: fetched Page ${index + 2} (${res.data.items.length} items)`);
        allItems.push(...res.data.items);
      } else {
        console.error(
          `getAllCategoriesAction: failed to fetch Page ${index + 2}`,
        );
      }
    });

    // console.log(`getAllCategoriesAction: Total items fetched: ${allItems.length}`);
    return allItems;
  }

  return [];
}
