import { useState, useEffect, useMemo } from "react";
import { Product, Variant } from "@/lib/types";

interface UseVariantSelectorProps {
  product: Product;
}

export function useVariantSelector({ product }: UseVariantSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentVariant, setCurrentVariant] = useState<Variant | null>(null);

  const colors = useMemo(() => {
    return product.availableColors || [];
  }, [product.availableColors]);

  const sizes = useMemo(() => {
    if (product.availableOptions && product.availableOptions.length > 0) {
      const allSizes = new Set<string>();
      product.availableOptions.forEach((opt) =>
        opt.sizes.forEach((s) => allSizes.add(s)),
      );
      return Array.from(allSizes);
    }

    if (product.variants) {
      return Array.from(new Set(product.variants.map((v) => v.size))).filter(
        Boolean,
      );
    }

    return [];
  }, [product.availableOptions, product.variants]);

  useEffect(() => {
    if (!selectedColor && colors.length > 0) setSelectedColor(colors[0]);
  }, [colors, selectedColor]);

  useEffect(() => {
    if (selectedColor && product.availableOptions) {
      const option = product.availableOptions.find(
        (o) => o.color === selectedColor,
      );
      if (option) {
        if (!selectedSize || !option.sizes.includes(selectedSize)) {
          if (option.sizes.length > 0) {
            setSelectedSize(option.sizes[0]);
          } else {
            setSelectedSize(null);
          }
        }
      }
    }
  }, [selectedColor, product.availableOptions, selectedSize, setSelectedSize]);

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

  const isVariantAvailable = (color: string | null, size: string | null) => {
    if (product.availableOptions && color && size) {
      const option = product.availableOptions.find((o) => o.color === color);
      if (!option) return false;
      if (!option.sizes.includes(size)) return false;
    }

    if (product.variants) {
      if (color && size) {
        const variant = product.variants.find(
          (v) => v.color === color && v.size === size,
        );
        return true;
      }
    }

    return true;
  };

  const isOptionValid = (color: string | null, size: string | null) => {
    if (!product.availableOptions) return true;
    if (color && size) {
      const option = product.availableOptions.find((o) => o.color === color);
      return option ? option.sizes.includes(size) : false;
    }
    return true;
  };

  const currentPrice =
    product.salePrice && product.isOnSale
      ? product.salePrice
      : product.originalPrice;

  // Stock logic for the specific selected variant
  const isOutOfStock = currentVariant
    ? currentVariant.stockQuantity <= 0
    : false;

  // Calculate discount percentage
  const discountPercentage = useMemo(() => {
    const original = product.originalPrice || 0;
    const current = currentPrice || 0;

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
    isVariantAvailable: isOptionValid,
    discountPercentage,
  };
}
