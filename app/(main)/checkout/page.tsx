"use client";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { useCartStore } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
  const { items } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    // Redirect to cart if empty
    // But need to wait for hydration.
    // Persist middleware should hydrate before render if using correct config,
    // or we're on client side.
    // If items is empty on mount, we assume it's empty (though there might be flash if rehydrating)
    // For now simple check.
    if (items.length === 0) {
      // router.push("/cart");
      // Don't auto redirect immediately to avoid annoyance if it's just loading?
      // But items is from store.
    }
  }, [items, router]);

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg text-muted-foreground">
          Your cart is empty. Please add items to verify checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Checkout
        </h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section className="lg:col-span-7">
            <CheckoutForm />
          </section>

          <section className="mt-16 lg:col-span-5 lg:mt-0">
            <OrderSummary />
          </section>
        </div>
      </div>
    </div>
  );
}
