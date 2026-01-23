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
  const result = await api.get<Product>(`/Product/details/${id}`);
  return result;
}

export async function getNewArrivalsAction() {
  const result = await api.get<NewArrivals[]>("/Product/new-arrivals");
  return result.success ? result.data || [] : [];
}

interface ProductFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string | string[];
  brand?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export async function getStoreProductsAction(params: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string | string[];
  brand?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}) {
  const queryParams: any = {
    PageNumber: params.page || 1,
    PageSize: params.limit || 24,
    Sort: params.sort || "newest",
  };

  if (params.search) queryParams.Search = params.search;
  if (params.minPrice) queryParams.MinPrice = params.minPrice;
  if (params.maxPrice) queryParams.MaxPrice = params.maxPrice;
  if (params.categoryId) queryParams.CategoryIds = params.categoryId;
  if (params.brand) queryParams.Brands = params.brand;

  const result = await api.get("/Product/store", { params: queryParams });

  if (result.success && result.data && result.data.items) {
    // Map PascalCase to camelCase
    result.data.items = result.data.items.map((item: any) => ({
      ...item,
      id: item.Id || item.id,
      name: item.Name || item.name,
      brand: item.Brand || item.brand,
      baseImage: item.BaseImage || item.baseImage,
      priceSummary: item.PriceSummary || item.priceSummary,
      salePrice: item.SalePrice || item.salePrice,
      originalPrice: item.OriginalPrice || item.originalPrice,
      rating: item.Rating || item.rating,
      reviewCount: item.ReviewCount || item.reviewCount,
      soldCount: item.SoldCount || item.soldCount,
      badges: item.Badges || item.badges,
      // Map other fields if necessary or keep existing
    }));
  }

  return result;
}
