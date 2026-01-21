import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/product/product-details";
import {
  getProductByIdAction,
  getNewArrivalsAction,
} from "@/app/actions/product";

// Mock data fallback if API fails or returns null (for development)
const MOCK_PRODUCT = {
  id: "1",
  name: "Wireless Noise-Cancelling Headphones",
  brand: "Sony",
  description: "<p>Experience world-class noise cancellation...</p>",
  baseImage:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
  priceSummary: "$249.99",
  salePrice: 249.99,
  originalPrice: 299.99,
  totalStock: 50,
  rating: 4.8,
  reviewCount: 420,
  soldCount: 1500,
  badges: ["Sale", "-15%"],
  variants: [
    {
      id: "v1",
      color: "Black",
      size: "Standard",
      sku: "WH-1000XM5-BLK",
      price: 249.99,
      stockQuantity: 20,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "v2",
      color: "Silver",
      size: "Standard",
      sku: "WH-1000XM5-SLV",
      price: 249.99,
      stockQuantity: 15,
      image:
        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "v3",
      color: "Blue",
      size: "Standard",
      sku: "WH-1000XM5-BLU",
      price: 269.99,
      stockQuantity: 5,
      image:
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop",
    },
  ],
  reviews: [
    { rating: 5, comment: "Amazing sound quality!", user: "John Doe" },
    { rating: 4, comment: "Great but expensive.", user: "Jane Smith" },
  ],
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch product data
  const productResult = await getProductByIdAction(id);
  const similarProducts = await getNewArrivalsAction();

  // Use mock data if API fails or returns no data (remove this in production)
  const product =
    productResult.success && productResult.data ? productResult.data : null; // MOCK_PRODUCT fallback can be added here if needed: || MOCK_PRODUCT

  if (!product && !productResult.success) {
    // NOTE: For now, I'll return the mock product if API fails so you can see the UI.
    // In a real app, you'd show notFound() or an error.
    // return notFound();
  }

  // Fallback to mock if API returns nothing (for demo purposes)
  const finalProduct = product || MOCK_PRODUCT;

  return (
    <div className="bg-white min-h-screen pb-20">
      <ProductDetails
        product={finalProduct as any}
        similarProducts={similarProducts}
      />
    </div>
  );
}
