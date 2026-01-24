"use client";

import { useState } from "react";
import { Star, Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

interface ProductInfoProps {
  product: Product;
  selectedColor: string | null;
  setSelectedColor: (color: string) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string) => void;
  colors: string[];
  sizes: string[];
  currentPrice: number;
  isOutOfStock: boolean;
  isVariantAvailable: (color: string | null, size: string | null) => boolean;
  discountPercentage: number;
  userId?: string;
}

export function ProductInfo({
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  colors,
  sizes,
  currentPrice,
  isOutOfStock,
  isVariantAvailable,
  userId,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="flex flex-col gap-5 md:gap-6 w-full">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {product.brand}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.isOnSale && product.discountLabel && (
              <Badge
                variant="destructive"
                className="px-2 py-0.5 text-xs font-semibold"
              >
                {product.discountLabel} OFF
              </Badge>
            )}
            {product.categoryName && (
              <Badge
                variant="secondary"
                className="px-2 py-0.5 text-xs font-semibold"
              >
                {product.categoryName}
              </Badge>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
          {product.name}
        </h1>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-sm sm:text-base">
              {product.averageRating || 0}
            </span>
            <span className="text-muted-foreground text-xs sm:text-sm">
              ({product.reviewCount || 0} reviews)
            </span>
          </div>
          <Separator orientation="vertical" className="h-4 sm:h-5" />
          <span className="text-muted-foreground text-xs sm:text-sm">
            {product.soldCount || 0} sold
          </span>
        </div>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl sm:text-3xl font-bold text-primary">
          ৳{currentPrice.toFixed(2)}
        </span>
        {product.isOnSale && product.originalPrice > currentPrice && (
          <span className="text-base sm:text-lg text-muted-foreground line-through">
            ৳{product.originalPrice.toFixed(2)}
          </span>
        )}
      </div>

      <Separator />

      {/* Variant Selectors */}
      <div className="space-y-5">
        {colors.length > 0 && (
          <div className="space-y-3">
            <span className="text-sm font-medium text-gray-900 block">
              Color:{" "}
              <span className="text-muted-foreground">{selectedColor}</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => {
                const isColorInStock =
                  product.variants?.some(
                    (v) =>
                      v.color === color &&
                      v.stockQuantity > 0 &&
                      (v.isActive ?? true),
                  ) ?? false;

                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    disabled={!isColorInStock}
                    className={cn(
                      "group relative flex items-center justify-center m-0.5 p-0.5 rounded-full ring-2 ring-offset-2 transition-all",
                      selectedColor === color
                        ? "ring-primary"
                        : "ring-transparent hover:ring-gray-300",
                      !isColorInStock && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <span
                      className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                    {!isColorInStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-0.5 w-full bg-red-500 rotate-45 transform" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">
                Size:{" "}
                <span className="text-muted-foreground">{selectedSize}</span>
              </span>
              <Link
                href="#description"
                className="text-xs text-primary underline"
              >
                Size Guide
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const available = isVariantAvailable(selectedColor, size);
                return (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    disabled={!available && size !== selectedSize}
                    className={cn(
                      "min-w-12 h-10 px-3",
                      selectedSize === size &&
                        "ring-2 ring-offset-2 ring-primary border-primary",
                      !available && "opacity-50 line-through",
                    )}
                  >
                    {size}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <div className="flex gap-4 w-full">
          <div className="flex items-center border rounded-md h-12 flex-1 sm:flex-none sm:w-auto">
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-12 rounded-none px-0 hover:bg-gray-100"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1 || isOutOfStock}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex-1 sm:w-12 text-center font-medium flex items-center justify-center border-x h-full">
              {quantity}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-12 rounded-none px-0 hover:bg-gray-100"
              onClick={() => handleQuantityChange(1)}
              disabled={isOutOfStock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 shrink-0 border-gray-200"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>

        {/* Add to Cart */}
        <Button
          className="w-full h-12 text-base font-medium shadow-md transition-transform active:scale-[0.98]"
          size="lg"
          disabled={isOutOfStock}
          onClick={async () => {
            if (
              (colors.length > 0 && !selectedColor) ||
              (sizes.length > 0 && !selectedSize)
            ) {
              // Should ideally be handled by disabling button, but safe guard
              toast.error("Please select options");
              return;
            }

            // Find variant
            const variant = product.variants.find(
              (v) =>
                (colors.length === 0 || v.color === selectedColor) &&
                (sizes.length === 0 || v.size === selectedSize),
            );

            const success = await useCartStore.getState().addItem(
              {
                productId: product.id,
                variantId: variant?.id,
                name: product.name,
                price: currentPrice,
                quantity: quantity,
                image: product.images?.[0] || product.baseImage,
                color: selectedColor || undefined,
                size: selectedSize || undefined,
                productSlug: product.slug,
              },
              userId,
            );

            if (success) {
              toast.success("Added to cart");
            }
          }}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
          <span>Free Delivery on orders over ৳5000</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
          <span>30 Day Return Policy</span>
        </div>
      </div>
    </div>
  );
}
