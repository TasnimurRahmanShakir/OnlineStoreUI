"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ShoppingCart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types";
import { BASE_URL2 } from "@/lib/api-client";

// Extended interface to support UI-specific fields not yet in the official API
export interface ProductCardProps {
  product: Product & {
    rating?: number;
    reviewCount?: number;
    soldCount?: number;
    salePrice?: number;
    originalPrice?: number;
    badges?: string[];
  };
  className?: string;
  index?: number; // Used for staggered animation delay if needed
}

export function ProductCard({ product, className, index }: ProductCardProps) {
  const rating = product.rating || 0;
  const reviewCount = product.reviewCount || 0;
  const soldCount = product.soldCount || 0;
  const badges = product.badges || [];

  const priceDisplay = product.priceSummary || "৳100.00";

  const hasDiscount =
    badges.includes("Sale") ||
    (product.originalPrice && product.originalPrice > (product.salePrice || 0));

  return (
    <div
      className={cn(
        "group relative bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300",
        className,
      )}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {badges.map((badge) => (
          <Badge
            key={badge}
            className={cn(
              "rounded-md px-2 py-1 text-xs font-medium uppercase tracking-wider",
              badge === "Sale" && "bg-red-500 hover:bg-red-600 text-white",
              badge === "New" && "bg-blue-500 hover:bg-blue-600 text-white",
              badge.includes("%") &&
                "bg-orange-500 hover:bg-orange-600 text-white",
            )}
          >
            {badge}
          </Badge>
        ))}
      </div>

      {/* Image Area */}
      <div className="relative aspect-3/4 w-full bg-gray-50 overflow-hidden">
        <Image
          src={
            (product.baseImage?.startsWith("http")
              ? product.baseImage
              : BASE_URL2 + product.baseImage) ||
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop"
          }
          alt={product.name}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full w-10 h-10 bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            title="Add to Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full w-10 h-10 bg-white/90 hover:bg-white text-gray-700 hover:text-blue-500 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75"
            title="Quick View"
          >
            <Eye className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Details Area */}
      <div className="p-4 space-y-2">
        {/* Brand */}
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {product.brand}
        </p>

        {/* Title */}
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="font-bold text-gray-900 leading-tight line-clamp-2 min-h-10 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Metrics: Rating & Sold */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-900">{rating}</span>
            <span>({reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <span>
              {soldCount >= 1000
                ? `${(soldCount / 1000).toFixed(1)}k`
                : soldCount}{" "}
              sold
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="pt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            {product.salePrice
              ? `BDT. ${product.salePrice.toFixed(2)}`
              : priceDisplay}
          </span>
          {product.originalPrice &&
            product.originalPrice > (product.salePrice || 0) && (
              <span className="text-sm text-muted-foreground line-through decoration-gray-400">
                BDT. {product.originalPrice.toFixed(2)}
              </span>
            )}
        </div>
      </div>
    </div>
  );
}
