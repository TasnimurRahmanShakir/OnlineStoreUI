"use client";

import { useCartStore } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function CartSummary() {
  const { items } = useCartStore();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <div className="rounded-lg border bg-gray-50 px-4 py-6 sm:p-6 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Subtotal</div>
          <div className="text-sm font-medium text-gray-900">
            ৳{subtotal.toFixed(2)}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center text-base font-medium text-gray-900">
            Order total
          </div>
          <div className="text-base font-medium text-gray-900">
            ৳{subtotal.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button className="w-full" asChild>
          <Link href="/checkout">Checkout</Link>
        </Button>
      </div>
    </div>
  );
}
