"use client";

import { useCartStore } from "@/hooks/use-cart";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { BASE_URL2 } from "@/lib/api-constants";

export function OrderSummary() {
  const { items, shippingCost } = useCartStore();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const shipping = shippingCost;
  const total = subtotal + shipping;

  return (
    <div className="rounded-lg border bg-gray-50 px-4 py-6 sm:p-6 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

      <div className="mt-6 space-y-4">
        <ul
          role="list"
          className="divide-y divide-gray-200 text-sm font-medium text-gray-900 border-b border-gray-200 pb-6"
        >
          {items.map((item) => (
            <li
              key={`${item.productId}-${item.variantId}`}
              className="flex items-start space-x-4 py-6"
            >
              <div className="relative h-20 w-20 flex-none rounded-md border border-gray-200 bg-white overflow-hidden">
                <Image
                  src={BASE_URL2 + item.image || "/placeholder.png"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-auto space-y-1">
                <h3>{item.name}</h3>
                <p className="text-gray-500">
                  {item.color && (
                    <span className="mr-2 capitalize">{item.color}</span>
                  )}
                  {item.size && <span className="uppercase">{item.size}</span>}
                </p>
                <p className="text-gray-500">Qty {item.quantity}</p>
              </div>
              <div className="flex-none text-base font-medium text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Subtotal</div>
          <div className="text-sm font-medium text-gray-900">
            ${subtotal.toFixed(2)}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Shipping (ডেলিভারি চার্জ )
          </div>
          <div className="text-sm font-medium text-gray-900">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">
            Order total (মোট বিক্রি মূল্য)
          </div>
          <div className="text-base font-medium text-gray-900">
            ${total.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
