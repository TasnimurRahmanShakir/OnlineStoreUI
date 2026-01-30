"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Brand } from "@/lib/types";
import { CategoryTree } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StoreFiltersProps {
  categories: CategoryTree[];
  brands: Brand[];
}

export function StoreFilters({ categories, brands }: StoreFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  useEffect(() => {
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  // Modified to handle multi-select
  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reset to page 1 on filter change

    if (value === null) {
      return;
    }

    // Check if we are toggling a category or brand
    if (key === "categoryId" || key === "brand") {
      const currentValues = params.getAll(key);
      if (currentValues.includes(value)) {
        // Remove it
        const newValues = currentValues.filter((v) => v !== value);
        params.delete(key);
        newValues.forEach((v) => params.append(key, v));
      } else {
        // Add it
        params.append(key, value);
      }
    } else {
      // Single value behavior for others if any (though currently only price/sort are different)
      if (value) params.set(key, value);
      else params.delete(key);
    }

    router.push(`/store?${params.toString()}`);
  };

  const activeCategoryIds = searchParams.getAll("categoryId");
  const activeBrands = searchParams.getAll("brand");

  const handlePriceApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    router.push(`/store?${params.toString()}`);
  };

  const hasFilters =
    activeCategoryIds.length > 0 ||
    activeBrands.length > 0 ||
    minPrice ||
    maxPrice;

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    router.push("/store");
  };

  // Recursive Category Item Renderer
  const renderCategoryItem = (category: CategoryTree, depth = 0) => {
    const isSelected = activeCategoryIds.includes(category.id);
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div key={category.id} className="w-full">
        {hasChildren ? (
          <AccordionItem
            value={`cat-${category.id}`}
            className="border-none w-full"
          >
            <div className="flex items-center w-full hover:bg-muted/50 rounded-sm">
              <Checkbox
                id={`cat-${category.id}`}
                checked={isSelected}
                onCheckedChange={(checked) => {
                  updateFilter("categoryId", category.id);
                }}
                className="ml-2"
              />
              <AccordionTrigger
                className={cn(
                  "py-2 hover:no-underline flex-1 pl-2 pr-4",
                  depth > 0 && "text-sm",
                )}
              >
                <div className="flex items-center gap-2 w-full">
                  <span
                    className={cn(
                      "text-sm text-left active:scale-95 transition-all w-full",
                      isSelected && "font-semibold text-primary",
                    )}
                  >
                    {category.name}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                    {category.productCount || 0}
                  </span>
                </div>
              </AccordionTrigger>
            </div>
            <AccordionContent className="pb-0 pl-4 border-l ml-2">
              <div className="flex flex-col gap-1">
                {category.children.map((child) =>
                  renderCategoryItem(child, depth + 1),
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ) : (
          <div
            className={cn(
              "flex items-center space-x-2 py-2 w-full",
              depth > 0 && "pl-4",
            )}
          >
            <Checkbox
              id={`cat-${category.id}`}
              checked={isSelected}
              onCheckedChange={(checked) => {
                updateFilter("categoryId", category.id);
              }}
            />
            <Label
              htmlFor={`cat-${category.id}`}
              className={cn(
                "text-sm font-normal cursor-pointer hover:text-primary transition-colors leading-none w-full flex justify-between items-center",
                isSelected && "font-semibold text-primary",
              )}
            >
              <span>{category.name}</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                {category.productCount || 0}
              </span>
            </Label>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-primary h-auto p-0"
          >
            Clear all
          </Button>
        )}
      </div>

      <Accordion
        type="multiple"
        defaultValue={["categories", "brands", "price"]}
        className="w-full"
      >
        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-base font-medium">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <Accordion type="multiple" className="w-full pt-2">
              {categories.map((category) => renderCategoryItem(category))}
            </Accordion>
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground pt-2">
                No categories found.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Brands */}
        <AccordionItem value="brands">
          <AccordionTrigger className="text-base font-medium">
            Brands
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex items-center space-x-2 justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand.id}`}
                      checked={activeBrands.includes(brand.name)}
                      onCheckedChange={(checked) => {
                        updateFilter("brand", brand.name);
                      }}
                    />
                    <Label
                      htmlFor={`brand-${brand.id}`}
                      className="text-sm font-normal cursor-pointer hover:text-primary transition-colors leading-none"
                    >
                      {brand.name}
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                    0
                  </span>
                </div>
              ))}
              {brands.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No brands found.
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-medium">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label
                    htmlFor="min-price"
                    className="text-xs text-muted-foreground"
                  >
                    Min
                  </Label>
                  <Input
                    id="min-price"
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min={0}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor="max-price"
                    className="text-xs text-muted-foreground"
                  >
                    Max
                  </Label>
                  <Input
                    id="max-price"
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min={0}
                    className="h-9"
                  />
                </div>
              </div>
              <Button className="w-full" size="sm" onClick={handlePriceApply}>
                Apply Price
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
