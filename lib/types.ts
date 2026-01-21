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
  price?: number; // Optional as price is now at product level mostly
  stockQuantity: number;
  image?: string;
  isActive?: boolean;
};

export type Review = {
  id: string;
  Name: string;
  rating: number;
  comment: string;
  datePosted?: string;
  user?: string; // Keep for backward compatibility if needed, or remove
};

export type AvailableOption = {
  color: string;
  sizes: string[];
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  description: string;
  categoryName: string;

  // Price & Sale
  originalPrice: number;
  salePrice: number;
  discountLabel?: string;
  isOnSale: boolean;

  // Stock & Logic
  totalStock: number;
  skus?: string[]; // Optional if not used in frontend display

  // Images
  images: string[]; // First image is base
  baseImage?: string; // Keep for compatibility, or map to images[0]

  // Selectors
  availableColors: string[];
  availableOptions: AvailableOption[];

  // Data
  variants: Variant[];
  reviews: Review[];

  // Aggregates
  averageRating?: number;
  reviewCount?: number;

  // Old fields to keep optional or remove if sure
  priceSummary?: string;
  soldCount?: number;
  badges?: string[];
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
