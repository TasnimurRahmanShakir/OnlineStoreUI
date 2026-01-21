import { z } from "zod";

export type NewArrivals = {
  Id: string;
  Name: string;
  Brand: string;
  BaseImage: string;
  PriceSummary: string;
  SalePrice: number;
  OriginalPrice: number;
  Rating: number;
  ReviewCount: number;
  SoldCount: number;
  TotalStock: number;
  Badges: string[];
};

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

export type Variant = {
  id: string;
  color: string;
  size: string;
  sku: string;
  price: number;
  stockQuantity: number;
  image?: string;
};

export type Review = {
  rating: number;
  comment: string;
  user: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  baseImage: string;
  description: string;
  priceSummary: string;
  salePrice?: number;
  originalPrice?: number;
  totalStock: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  badges?: string[];
  variants?: Variant[];
  reviews?: Review[];
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
