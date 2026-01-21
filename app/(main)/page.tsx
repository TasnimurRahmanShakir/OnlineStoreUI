import { HeroSection } from "@/components/main/hero-section";
import { ProductShowcaseSection } from "@/components/main/product-showcase-section";

// Mock Data Generator
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Wireless Noise-Cancelling Headphones",
    brand: "Sony",
    baseImage:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    priceSummary: "$299.99",
    salePrice: 249.99,
    originalPrice: 299.99,
    rating: 4.8,
    reviewCount: 420,
    soldCount: 1500,
    badges: ["Sale", "-15%"],
    totalStock: 50,
  },
  {
    id: "2",
    name: "Smart Fitness Watch Series 7",
    brand: "Apple",
    baseImage:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
    priceSummary: "$399.00",
    salePrice: 399.0,
    rating: 4.9,
    reviewCount: 850,
    soldCount: 3200,
    badges: ["New", "Best Seller"],
    totalStock: 100,
  },
  {
    id: "3",
    name: "Ergonomic Mechanical Keyboard",
    brand: "Keychron",
    baseImage:
      "https://images.unsplash.com/photo-1587829741301-dc798b91a603?q=80&w=1000&auto=format&fit=crop",
    priceSummary: "$149.00",
    salePrice: 149.0,
    rating: 4.7,
    reviewCount: 120,
    soldCount: 540,
    badges: [],
    totalStock: 20,
  },
  {
    id: "4",
    name: "4K Ultra HD Action Camera",
    brand: "GoPro",
    baseImage:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1000&auto=format&fit=crop",
    priceSummary: "$349.99",
    salePrice: 299.99,
    originalPrice: 349.99,
    rating: 4.6,
    reviewCount: 230,
    soldCount: 890,
    badges: ["Sale"],
    totalStock: 45,
  },
  {
    id: "5",
    name: "Minimalist Leather Backpack",
    brand: "Herschel",
    baseImage:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
    priceSummary: "$89.00",
    salePrice: 89.0,
    rating: 4.5,
    reviewCount: 89,
    soldCount: 120,
    badges: [],
    totalStock: 80,
  },
  {
    id: "6",
    name: "Portable Bluetooth Speaker",
    brand: "JBL",
    baseImage:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop",
    priceSummary: "$59.95",
    salePrice: 45.0,
    originalPrice: 59.95,
    rating: 4.4,
    reviewCount: 310,
    soldCount: 2100,
    badges: ["-25%"],
    totalStock: 150,
  },
];

// Mock wrapper to simulate server delay
async function fetchFeaturedProducts() {
  "use server";
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return MOCK_PRODUCTS;
}

async function fetchPopularProducts() {
  "use server";
  await new Promise((resolve) => setTimeout(resolve, 600));
  // Return a slightly modified version (reversed)
  return [...MOCK_PRODUCTS].reverse();
}

import { getNewArrivalsAction } from "@/app/actions/product";

export default async function MainPage() {
  const newArrivals = await getNewArrivalsAction();
  const popularProducts = await fetchPopularProducts();
  const trendingProducts = await fetchFeaturedProducts();


  return (
    <div className="flex flex-col gap-8 pb-20">
      <HeroSection />

      <ProductShowcaseSection
        title="New Arrivals"
        products={newArrivals}
        viewAllLink="/products?sort=new"
      />

      <ProductShowcaseSection
        title="Most Popular"
        products={popularProducts}
        viewAllLink="/products?sort=popular"
        className="bg-gray-50/50"
      />

      <ProductShowcaseSection
        title="Trending Electronics"
        products={trendingProducts}
        viewAllLink="/category/electronics"
      />
    </div>
  );
}
