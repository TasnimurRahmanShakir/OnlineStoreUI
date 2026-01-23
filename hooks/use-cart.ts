"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, CartState } from "@/lib/types";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

type CartStore = CartState & {
  lastSyncedItems: CartItem[];
  syncCart: (items: CartItem[]) => Promise<void>;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => {
      const performSync = async (items: CartItem[]) => {
        try {
          const response = await api.post("/cart/sync", { items });

          if (!response.success) {
            throw new Error(response.error || "Sync failed");
          }

          set({ lastSyncedItems: items });
        } catch (error) {
          console.error("Cart sync error:", error);
          toast.error("Failed to sync cart with server. Reverting changes.");

          set({ items: get().lastSyncedItems });
        }
      };

      const debouncedSync = debounce(performSync, 500);

      return {
        items: [],
        lastSyncedItems: [],
        isOpen: false,

        addItem: (item) => {
          const { items } = get();
          const existingItemIndex = items.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.variantId === item.variantId &&
              i.color === item.color &&
              i.size === item.size,
          );

          let newItems = [...items];
          if (existingItemIndex > -1) {
            newItems[existingItemIndex].quantity += item.quantity;
          } else {
            newItems.push(item);
          }

          set({ items: newItems, isOpen: true });

          debouncedSync(newItems);
        },

        removeItem: (productId, variantId) => {
          const { items } = get();
          const newItems = items.filter(
            (i) =>
              !(
                i.productId === productId &&
                (variantId ? i.variantId === variantId : true)
              ),
          );

          set({ items: newItems });

          debouncedSync(newItems);
        },

        updateQuantity: (productId, quantity, variantId) => {
          const { items } = get();
          if (quantity <= 0) {
            if (quantity === 0) {
              get().removeItem(productId, variantId);
              return;
            }
          }

          const newItems = items.map((i) => {
            if (
              i.productId === productId &&
              (variantId ? i.variantId === variantId : true)
            ) {
              return { ...i, quantity };
            }
            return i;
          });

          set({ items: newItems });

          debouncedSync(newItems);
        },

        clearCart: () => {
          const newItems: CartItem[] = [];

          set({ items: newItems });

          debouncedSync(newItems);
        },

        toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

        syncCart: async () => {
          performSync(get().items);
        },
      };
    },
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      
      partialize: (state) => ({
        items: state.items,
        
        lastSyncedItems: state.lastSyncedItems,
      }),
    },
  ),
);
