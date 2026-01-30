"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, ShoppingCart, Heart, User, ChevronDown } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
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
import { ComingSoonModal } from "@/components/coming-soon-modal";
import { MobileSidebar } from "./mobile-sidebar";
import { CategoryTree } from "@/lib/utils";
import { Brand } from "@/lib/types";

import { useCartStore } from "@/hooks/use-cart";
import { logoutAction } from "@/app/actions/auth";
import { UserSession } from "@/lib/session";

interface HeaderProps {
  categories: CategoryTree[];
  brands: Brand[];
  user?: UserSession | null;
}

export function Header({ categories, brands, user }: HeaderProps) {
  const router = useRouter();
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted
    ? items.reduce((acc, item) => acc + item.quantity, 0)
    : 0;
  const wishlistCount = 0; // Placeholder until wishlist store is implemented

  /* Debounced Search Logic */
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Sync state with URL search param if it changes externally
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";

    if (debouncedSearch !== currentSearch) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      } else {
        params.delete("search");
      }

      if (window.location.pathname === "/store") {
        params.set("page", "1");
        router.push(`/store?${params.toString()}`);
      } else {
        router.push(`/store?search=${encodeURIComponent(debouncedSearch)}`);
      }
    }
  }, [debouncedSearch, router, searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  const renderCategory = (category: CategoryTree) => {
    if (category.children && category.children.length > 0) {
      return (
        <DropdownMenuSub key={category.id}>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Link href={`/store?categoryId=${category.id}`} className="w-full">
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
        <Link href={`/store?categoryId=${category.id}`} className="w-full">
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
          wishlistCount={wishlistCount}
        />

        {/* Logo */}
        <Link href="/" className="mr-4 flex items-center space-x-2 md:mr-8">
          <Image src="/logo.png" alt="Logo" width={250} height={150} />
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
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full max-w-md lg:max-w-lg"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              type="search"
              placeholder="Search products..."
              className="pl-9 w-full bg-muted/50 focus:bg-background transition-colors h-10 lg:h-11 shadow-sm"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          <ComingSoonModal title="Wishlist">
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
          </ComingSoonModal>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 lg:h-10 lg:w-10 relative"
            asChild
          >
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-background">
                  {cartCount}
                </span>
              )}
            </Link>
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
              {user ? (
                <>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.fullName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <ComingSoonModal title="User Profile">
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="cursor-pointer"
                    >
                      <span className="w-full font-medium">Profile</span>
                    </DropdownMenuItem>
                  </ComingSoonModal>
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => logoutAction()}
                  >
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
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
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
