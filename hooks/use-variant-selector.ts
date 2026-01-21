import { useState, useEffect, useMemo } from "react";
import { Product, Variant } from "@/lib/types";

interface UseVariantSelectorProps {
  product: Product;
}

export function useVariantSelector({ product }: UseVariantSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentVariant, setCurrentVariant] = useState<Variant | null>(null);

  // Extract unique options
  const colors = useMemo(() => {
    if (!product.variants) return [];
    return Array.from(new Set(product.variants.map((v) => v.color))).filter(
      Boolean,
    );
  }, [product.variants]);

  const sizes = useMemo(() => {
    if (!product.variants) return [];
    return Array.from(new Set(product.variants.map((v) => v.size))).filter(
      Boolean,
    );
  }, [product.variants]);

  // Initial selection
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      if (!selectedColor && colors.length > 0) setSelectedColor(colors[0]);
      if (!selectedSize && sizes.length > 0) setSelectedSize(sizes[0]);
    }
  }, [product.variants, colors, sizes, selectedColor, selectedSize]);

  // Update current variant based on selection
  useEffect(() => {
    if (!product.variants) return;

    const variant = product.variants.find(
      (v) =>
        (!selectedColor || v.color === selectedColor) &&
        (!selectedSize || v.size === selectedSize),
    );

    setCurrentVariant(variant || null);
  }, [selectedColor, selectedSize, product.variants]);

  // Check availability
  const isVariantAvailable = (color: string | null, size: string | null) => {
    if (!product.variants) return false;

    // If checking a specific combination
    if (color && size) {
      const variant = product.variants.find(
        (v) => v.color === color && v.size === size,
      );
      return variant ? variant.stockQuantity > 0 : false;
    }

    // If checking only color (is there ANY size available for this color?)
    if (color && !size) {
      return product.variants.some(
        (v) => v.color === color && v.stockQuantity > 0,
      );
    }

    // If checking only size (is there ANY color available for this size?)
    if (!color && size) {
      return product.variants.some(
        (v) => v.size === size && v.stockQuantity > 0,
      );
    }

    return false;
  };

  const currentPrice =
    currentVariant?.price || product.salePrice || product.originalPrice || 0;
  const isOutOfStock = currentVariant
    ? currentVariant.stockQuantity <= 0
    : false;

  // Calculate discount percentage
  const discountPercentage = useMemo(() => {
    const original = product.originalPrice || 0;
    const current = currentPrice;

    if (original > current && original > 0) {
      return Math.round(((original - current) / original) * 100);
    }
    return 0;
  }, [product.originalPrice, currentPrice]);

  return {
    colors,
    sizes,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    currentVariant,
    currentPrice,
    isOutOfStock,
    isVariantAvailable,
    discountPercentage,
  };
}
