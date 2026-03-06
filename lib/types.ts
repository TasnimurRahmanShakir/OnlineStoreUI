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
  productCount?: number;
};

export type Brand = {
  id: string;
  name: string;
  productCount?: number;
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
  slug: string;
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

  // Delivery Charges
  deliveryChargeInsideDhaka?: number;
  deliveryChargeOutsideDhaka?: number;
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

export type CartItem = {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  color?: string;
  size?: string;
  productSlug: string; // helpful for linking back
  deliveryChargeInsideDhaka?: number;
  deliveryChargeOutsideDhaka?: number;
};

export type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem, userId?: string) => Promise<boolean>;
  removeItem: (productId: string, userId?: string, variantId?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    userId?: string,
    variantId?: string,
  ) => Promise<void>;
  clearCart: (userId?: string) => void;
  toggleCart: () => void;
  syncCart: (userId: string) => Promise<void>; // Explicit sync action if needed, though usually automatic
};

export type AuthResponse = {
  id: string;
  token: string;
  refreshToken: string;
  refreshTokenExpiration: string; // ISO Date string
  fullName: string;
  email: string;
  role: string;
};

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  addresses?: Address[];
};

export type Address = {
  id: string;
  addressLine: string;
  label: "Home" | "Office";
  isDefault: boolean;
};

export type OrderSummary = {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  total: number;
  status: string;
  canEdit?: boolean;
  assignedAdminName?: string;
};

export type OrderItem = {
  productId: string;
  variantId?: string;
  productName: string;
  quantity: number;
  price: number;
  subTotal: number;
  image?: string;
  color?: string;
  size?: string;
};

export type OrderDetails = {
  id: string;
  orderNumber: string;
  orderDate: string;
  orderStatus: string;
  totalAmount: number;
  shippingFee: number;

  // Customer Info
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Shipping Info
  shippingAddress: string;
  shippingLabel: string;
  paymentMethod: string;

  assignedAdminId?: string;
  assignedAdminName?: string;
  canEdit?: boolean;

  items: OrderItem[];
};
