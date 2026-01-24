import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/product/product-details";
import {
  getProductByIdAction,
  getNewArrivalsAction,
} from "@/app/actions/product";
import { getSession } from "@/lib/session";

// Mock data fallback if API fails or returns null (for development)
// Mock data fallback if API fails or returns null (for development)
const MOCK_PRODUCT = {
  id: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  name: "Urban Explorer Waterproof Backpack",
  brand: "Nomad Gear",
  description:
    "<p>A durable, lightweight backpack designed for city commute and weekend adventures. Features a padded 15-inch laptop sleeve and water-resistant coating.</p>",
  categoryName: "Bags & Travel",
  originalPrice: 120.0,
  salePrice: 108.0,
  discountLabel: "10%",
  isOnSale: true,
  totalStock: 45,
  skus: ["BAG-BLK-STD-001", "BAG-GRY-STD-002"],
  images: [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop", // Base
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop", // Black
    "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?q=80&w=1000&auto=format&fit=crop", // Grey
    "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?q=80&w=1000&auto=format&fit=crop", // Lifestyle
  ],
  averageRating: 4.8,
  reviewCount: 12,
  availableColors: ["Black", "Grey", "Navy"],
  availableOptions: [
    {
      color: "Black",
      sizes: ["Standard", "Large"],
    },
    {
      color: "Grey",
      sizes: ["Standard"],
    },
    {
      color: "Navy",
      sizes: ["Standard"],
    },
  ],
  variants: [
    {
      id: "v1",
      color: "Black",
      size: "Standard",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
      sku: "BAG-BLK-STD-001",
      stockQuantity: 20,
      isActive: true,
    },
    {
      id: "v2",
      color: "Black",
      size: "Large",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop", // Reusing image for demo
      sku: "BAG-BLK-LRG-001",
      stockQuantity: 0,
      isActive: true,
    },
    {
      id: "v3",
      color: "Grey",
      size: "Standard",
      image:
        "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?q=80&w=1000&auto=format&fit=crop",
      sku: "BAG-GRY-STD-002",
      stockQuantity: 15,
      isActive: true,
    },
  ],
  reviews: [
    {
      id: "r1",
      Name: "Sarah J.",
      rating: 5,
      comment: "Amazing quality! Fits my MacBook Pro perfectly.",
      datePosted: "Jan 15, 2026",
    },
    {
      id: "r2",
      Name: "Mike T.",
      rating: 4,
      comment: "Great bag, but the side pockets are a bit tight.",
      datePosted: "Jan 10, 2026",
    },
  ],
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  const productResult = await getProductByIdAction(id);
  const similarProducts = await getNewArrivalsAction();

  const product =
    productResult.success && productResult.data ? productResult.data : null;

  const finalProduct = product || MOCK_PRODUCT;

  const session = await getSession();

  return (
    <div className="bg-white min-h-screen pb-20">
      <ProductDetails
        product={finalProduct as any}
        similarProducts={similarProducts}
        userId={session?.id}
      />
    </div>
  );
}
