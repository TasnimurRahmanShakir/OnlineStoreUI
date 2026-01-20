"use client";

import Link from "next/link";
import { Search, ShoppingCart, Heart, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { MobileSidebar } from "./mobile-sidebar";
import { CategoryTree } from "@/lib/utils";
import { Brand } from "@/lib/types";

interface HeaderProps {
  categories: CategoryTree[];
  brands: Brand[];
  cartCount?: number;
  wishlistCount?: number;
}

export function Header({
  categories,
  brands,
  cartCount = 0,
  wishlistCount = 0,
}: HeaderProps) {
  const renderCategory = (category: CategoryTree) => {
    if (category.children && category.children.length > 0) {
      return (
        <DropdownMenuSub key={category.id}>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Link href={`/store?category=${category.name}`} className="w-full">
              {category.name}
            </Link>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-[220px]">
            {category.children.map((child) => renderCategory(child))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }
    return (
      <DropdownMenuItem key={category.id} asChild className="cursor-pointer">
        <Link href={`/store?category=${category.name}`} className="w-full">
          {category.name}
        </Link>
      </DropdownMenuItem>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 md:h-20 items-center px-4 md:px-6 lg:px-8">
        {/* Mobile Menu Trigger */}
        <MobileSidebar
          categories={categories}
          brands={brands}
          cartCount={cartCount}
          wishlistCount={wishlistCount}
        />

        {/* Logo */}
        <Link href="/" className="mr-4 flex items-center space-x-2 md:mr-8">
          <span className="text-xl md:text-2xl font-bold tracking-tight">
            Store
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-primary text-foreground/80"
          >
            Home
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-primary text-foreground/60 outline-none">
              Store <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[220px]">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/store" className="w-full">
                  All Products
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-primary text-foreground/60 outline-none">
              Categories <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[220px]">
              {categories.map((category) => renderCategory(category))}
              {categories.length > 10 && (
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/store"
                    className="font-semibold text-primary w-full"
                  >
                    View All Categories
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-primary text-foreground/60 outline-none">
              Brands <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[220px]">
              {brands.slice(0, 10).map((brand) => (
                <DropdownMenuItem
                  key={brand.id}
                  asChild
                  className="cursor-pointer"
                >
                  <Link href={`/store?brand=${brand.name}`} className="w-full">
                    {brand.name}
                  </Link>
                </DropdownMenuItem>
              ))}
              {brands.length > 10 && (
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/store"
                    className="font-semibold text-primary w-full"
                  >
                    View All Brands
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 items-center justify-center px-4 lg:px-12">
          <div className="relative w-full max-w-md lg:max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-9 w-full bg-muted/50 focus:bg-background transition-colors h-10 lg:h-11 shadow-sm"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex h-9 w-9 lg:h-10 lg:w-10 relative"
          >
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background">
                {wishlistCount}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 lg:h-10 lg:w-10 relative"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-background">
                {cartCount}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 lg:h-10 lg:w-10 rounded-full border border-transparent hover:border-border"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">User Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/login" className="w-full font-medium">
                  Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/register" className="w-full">
                  Register
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
