import { z } from "zod";

export type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  parentName?: string | null;
  parentId?: string;
  createdAt?: string;
};
 
export type Brand = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  baseImage: string;
  priceSummary: string;
  totalStock: number;
};

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  imageUrl: z.string().optional(),
  parentId: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export type ApiResponse<T> = {
  message: string;
  items: T;
};

// Matches C# response:
// { items, totalPages, currentPage, pageSize, hasPreviousPage, hasNextPage, totalItems }
export type PaginatedResult<T> = {
  items: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
