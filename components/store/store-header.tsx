"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { StoreFilters } from "./store-filters";
import { CategoryTree } from "@/lib/utils";
import { Brand } from "@/lib/types";

interface StoreHeaderProps {
  totalItems: number;
  categories: CategoryTree[];
  brands: Brand[];
}

export function StoreHeader({
  totalItems,
  categories,
  brands,
}: StoreHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/store?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-gray-100 mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          All Products
        </h1>
        <span className="text-sm text-gray-500 font-medium bg-gray-100 px-2.5 py-0.5 rounded-full">
          {totalItems}
        </span>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden gap-2 flex-1 sm:flex-none"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[300px] sm:w-[400px] overflow-y-auto"
          >
            <SheetHeader className="mb-4 text-left">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <StoreFilters categories={categories} brands={brands} />
          </SheetContent>
        </Sheet>

        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest Arrivals</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
