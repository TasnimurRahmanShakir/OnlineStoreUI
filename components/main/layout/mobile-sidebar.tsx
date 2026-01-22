"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Search,
  User,
  ShoppingBag,
  Heart,
  Home,
  LogOut,
  Package,
  ShoppingCart,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { CategoryTree } from "@/lib/utils";
import { Brand } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MobileSidebarProps {
  categories: CategoryTree[];
  brands: Brand[];
  cartCount?: number;
  wishlistCount?: number;
}

export function MobileSidebar({
  categories,
  brands,
  cartCount = 0,
  wishlistCount = 0,
}: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search")?.toString().trim();
    if (query) {
      router.push(`/store?search=${encodeURIComponent(query)}`);
      setOpen(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon" className="md:hidden mr-2">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open Menu</span>
      </Button>
    );
  }

  const renderMobileCategory = (category: CategoryTree) => {
    if (category.children && category.children.length > 0) {
      return (
        <AccordionItem
          value={`cat-${category.id}`}
          key={category.id}
          className="border-none"
        >
          <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
            <span className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              {category.name}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pl-6 pb-2">
            <div className="flex flex-col gap-1 border-l pl-2">
              <Link
                href={`/store?categoryId=${category.id}`}
                onClick={() => setOpen(false)}
                className="py-1.5 text-sm text-foreground/80 hover:text-primary"
              >
                All {category.name}
              </Link>
              {category.children.map((child) => renderMobileCategory(child))}
            </div>
          </AccordionContent>
        </AccordionItem>
      );
    }

    return (
      <Link
        key={category.id}
        href={`/store?categoryId=${category.id}`}
        onClick={() => setOpen(false)}
        className="flex items-center gap-2 rounded-lg px-0 py-2 text-sm font-medium hover:bg-accent/50 transition-colors text-foreground/80 hover:text-foreground"
      >
        <Package className="h-4 w-4 text-muted-foreground opacity-0" />
        <span className="flex items-center gap-2 -ml-6">
          <Package className="h-4 w-4 text-muted-foreground" />
          {category.name}
        </span>
      </Link>
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden mr-2">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[85vw] sm:w-[380px] p-0 flex flex-col"
      >
        <SheetHeader className="p-6 border-b text-left">
          <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              type="search"
              placeholder="Search products..."
              className="pl-9 h-11 bg-muted/30"
            />
          </form>

          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Navigation
            </h4>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium hover:bg-muted transition-colors"
            >
              <Home className="h-5 w-5 text-muted-foreground" />
              Home
            </Link>
            <Link
              href="/store"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium hover:bg-muted transition-colors"
            >
              <ShoppingBag className="h-5 w-5 text-muted-foreground" />
              Store
            </Link>
          </div>

          <Separator className="my-1" />

          {/* Categories Accordion */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Categories
            </h4>
            <Accordion type="single" collapsible className="w-full">
              {categories.map((category) => renderMobileCategory(category))}
            </Accordion>
            <Link
              href="/store"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted transition-colors text-primary mt-2"
            >
              View All Categories
            </Link>
          </div>

          <Separator className="my-1" />

          {/* Brands Accordion */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Brands
            </h4>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="brands-list" className="border-none">
                <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                  <span className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    All Brands
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pl-6 pb-2">
                  <div className="flex flex-col gap-1 border-l pl-2">
                    {brands.slice(0, 10).map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/store?brandId=${brand.id}`}
                        onClick={() => setOpen(false)}
                        className="py-1.5 text-sm text-foreground/80 hover:text-primary"
                      >
                        {brand.name}
                      </Link>
                    ))}
                    {brands.length > 10 && (
                      <Link
                        href="/store"
                        onClick={() => setOpen(false)}
                        className="py-1.5 text-sm font-semibold text-primary"
                      >
                        View All
                      </Link>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <Separator className="my-1" />

          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Account
            </h4>
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium hover:bg-muted transition-colors"
            >
              <User className="h-5 w-5 text-muted-foreground" />
              Profile
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-3 text-base font-medium hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-muted-foreground" />
                Wishlist
              </div>
              {wishlistCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-3 text-base font-medium hover:bg-muted transition-colors md:hidden"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                Cart
              </div>
              {cartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium hover:bg-muted transition-colors"
            >
              <LogOut className="h-5 w-5 text-muted-foreground" />
              Login / Register
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
