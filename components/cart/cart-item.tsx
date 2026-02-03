"use client";

import { useCartStore } from "@/hooks/use-cart";
import { CartItem as CartItemType } from "@/lib/types";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { constructImageUrl } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
  userId?: string;
}

export function CartItem({ item, userId }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="relative aspect-square h-24 w-24 min-w-24 overflow-hidden rounded-md border bg-gray-100">
        <Image
          src={constructImageUrl(item.image) || "/placeholder.png"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="grid gap-1">
          <Link
            href={`/product/${item.productSlug}`}
            className="font-medium hover:underline line-clamp-2"
          >
            {item.name}
          </Link>
          <div className="flex text-sm text-muted-foreground gap-2">
            {item.color && (
              <span className="capitalize border-r pr-2 last:border-0">
                {item.color}
              </span>
            )}
            {item.size && <span className="uppercase">{item.size}</span>}
          </div>
          <div className="text-sm font-semibold mt-1">
            ${item.price.toFixed(2)}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          {/* Quantity Controls */}
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-8 w-8 rounded-none"
              onClick={() =>
                updateQuantity(
                  item.productId,
                  item.quantity - 1,
                  userId,
                  item.variantId,
                )
              }
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <div className="w-8 text-center text-sm">{item.quantity}</div>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-8 w-8 rounded-none"
              onClick={() =>
                updateQuantity(
                  item.productId,
                  item.quantity + 1,
                  userId,
                  item.variantId,
                )
              }
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            type="button"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => removeItem(item.productId, userId, item.variantId)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
