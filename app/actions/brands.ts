"use server";

import { Brand, PaginatedResult } from "@/lib/types";
import { api } from "@/lib/api-client";

export async function getAllBrandsAction() {
  const result = await api.get<PaginatedResult<Brand>>("/Product/brands", {
    params: { page: 1, limit: 1000 },
  });
  
  if (result.success && result.data) {
    return result.data.items;
  }
  return [];
}
