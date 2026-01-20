"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, ShoppingBag, User, Heart } from "lucide-react";

interface BottomNavProps {
  cartCount?: number;
  wishlistCount?: number;
}

export function BottomNav({
  cartCount = 0,
  wishlistCount = 0,
}: BottomNavProps) {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/store",
      label: "Store",
      icon: ShoppingBag,
      active: pathname === "/store",
    },
    {
      href: "/wishlist",
      label: "Wishlist",
      icon: Heart,
      active: pathname === "/wishlist",
      count: wishlistCount,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
      active: pathname === "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/80 backdrop-blur-lg md:hidden pb-safe supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-around px-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 min-w-[64px] rounded-lg p-2 transition-all duration-200 select-none relative",
              route.active
                ? "text-primary scale-105"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
            )}
          >
            <div className="relative">
              <route.icon
                className={cn(
                  "h-5 w-5 transition-transform",
                  route.active && "stroke-[2.5px]",
                )}
              />
              {route.count !== undefined && route.count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-1 ring-background">
                  {route.count}
                </span>
              )}
            </div>
            <span
              className={cn(
                "text-[10px] font-medium transition-all",
                route.active ? "font-semibold" : "",
              )}
            >
              {route.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
