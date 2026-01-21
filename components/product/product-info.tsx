"use client";

import { useState } from "react";
import { Star, Heart, ShoppingCart, Minus, Plus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

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
  discountPercentage,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {product.brand}
          </p>
          <div className="flex gap-2">
            {product.badges?.map((badge) => (
              <Badge
                key={badge}
                variant="secondary"
                className="px-2 py-0.5 text-xs font-semibold"
              >
                {badge}
              </Badge>
            ))}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {product.name}
        </h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{product.rating || 0}</span>
            <span className="text-muted-foreground">
              ({product.reviewCount || 0} reviews)
            </span>
          </div>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-muted-foreground text-sm">
            {product.soldCount || 0} sold
          </span>
        </div>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-primary">
          ৳{currentPrice.toFixed(2)}
        </span>
        {product.originalPrice && product.originalPrice > currentPrice ? (
          <>
            <span className="text-lg text-muted-foreground line-through">
              ৳{product.originalPrice.toFixed(2)}
            </span>
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 hover:bg-red-600">
                -{discountPercentage}%
              </Badge>
            )}
          </>
        ) : null}
      </div>

      <Separator />

      {/* Variant Selectors */}
      <div className="space-y-6">
        {/* Colors */}
        {colors.length > 0 && (
          <div className="space-y-3">
            <span className="text-sm font-medium text-gray-900">
              Color:{" "}
              <span className="text-muted-foreground">{selectedColor}</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => {
                const available = isVariantAvailable(color, selectedSize);
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    disabled={!available && color !== selectedColor} // Keep selected even if unavailable to allow switching size
                    className={cn(
                      "group relative flex items-center justify-center -m-0.5 p-0.5 rounded-full ring-2 ring-offset-2 transition-all",
                      selectedColor === color
                        ? "ring-primary"
                        : "ring-transparent hover:ring-gray-300",
                      !available && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {/* Simple Color Circle - In a real app mapping color names to hex codes is better */}
                    <span
                      className={cn(
                        "h-8 w-8 rounded-full border border-black/10",
                      )}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                    {!available && (
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
              <button className="text-xs text-primary underline">
                Size Guide
              </button>
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
                      "min-w-12 h-10",
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

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Quantity */}
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-none px-0"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1 || isOutOfStock}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-none px-0"
            onClick={() => handleQuantityChange(1)}
            disabled={isOutOfStock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Add to Cart */}
        <Button
          className="flex-1 h-11 text-base"
          disabled={isOutOfStock}
          onClick={() => {
            // Handle Add to Cart
            console.log("Add to cart", {
              product: product.id,
              variant: { color: selectedColor, size: selectedSize },
              quantity,
            });
          }}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>

        {/* Wishlist */}
        <Button variant="outline" size="icon" className="h-11 w-11">
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      {/* Features / Benefits (Mock) */}
      <div className="grid grid-cols-2 gap-4 pt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span>Free Delivery on orders over ৳5000</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span>30 Day Return Policy</span>
        </div>
      </div>
    </div>
  );
}
