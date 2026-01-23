"use client";

import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCartStore } from "@/hooks/use-cart";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  // We use useCartStore directly.
  // Note: Since we use persist, there might be a hydration mismatch initially if we render on server vs client.
  // Next.js 'use client' components still render on server initially.
  // To avoid hydration mismatch with local storage, we should check for mounted state or use a store selector that handles it.
  // However, zustand persist usually handles this via onRehydrateStorage or we just suppress warning?
  // Proper way is to clear mismatch. A simple way:
  // const items = useCartStore((state) => state.items);
  // Re-hydration might cause flicker.
  // Let's implement a 'isMounted' check or assume useCartStore is robust.

  const { items } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Your cart is empty</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            You haven&apos;t added any items to your cart yet.
          </p>
          <Button asChild>
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-b border-t border-gray-200"
            >
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId}-${item.color}-${item.size}`}
                >
                  <CartItem item={item} />
                </li>
              ))}
            </ul>
          </section>

          {/* Cart Summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <CartSummary />
          </section>
        </form>
      </div>
    </div>
  );
}
