// ... imports
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, CartState } from "@/lib/types";
import { toast } from "sonner";
import { syncCartAction } from "@/app/actions/cart";
import { checkStockAction } from "@/app/actions/product";

const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
  let timeout: any;
  return (...args: Parameters<T>) => {
    console.log("Debounce: Queuing execution", { args });
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      console.log("Debounce: Executing function");
      func(...args);
    }, wait);
  };
};

type CartStore = CartState & {
  lastSyncedItems: CartItem[];
  shippingCost: number;
  setShippingCost: (cost: number) => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => {
      const performSync = async (items: CartItem[], userId: string) => {
        console.log("performSync called", { itemsCount: items.length, userId });
        try {
          const response = await syncCartAction(items, userId);

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

        addItem: async (item, userId) => {
          const { items } = get();
          const existingItemIndex = items.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.variantId === item.variantId &&
              i.color === item.color &&
              i.size === item.size,
          );

          let newQuantity = item.quantity;
          if (existingItemIndex > -1) {
            newQuantity += items[existingItemIndex].quantity;
          }

          // Verify stock
          const stockCheck = await checkStockAction(
            item.productId,
            item.variantId,
            newQuantity,
          );

          if (!stockCheck.success || !stockCheck.available) {
            toast.error(
              stockCheck.message || "Requested quantity not available",
            );
            return false;
          }

          let newItems = [...items];
          if (existingItemIndex > -1) {
            newItems[existingItemIndex].quantity += item.quantity;
          } else {
            newItems.push(item);
          }

          set({ items: newItems, isOpen: true });

          if (userId) {
            console.log("addItem: Triggering debouncedSync", { userId });
            debouncedSync(newItems, userId);
          }
          return true;
        },

        removeItem: (productId, userId, variantId) => {
          const { items } = get();
          const newItems = items.filter(
            (i) =>
              !(
                i.productId === productId &&
                (variantId ? i.variantId === variantId : true)
              ),
          );

          set({ items: newItems });

          if (userId) {
            debouncedSync(newItems, userId);
          }
        },

        updateQuantity: async (productId, quantity, userId, variantId) => {
          const { items } = get();
          if (quantity <= 0) {
            if (quantity === 0) {
              get().removeItem(productId, userId, variantId);
              return;
            }
          }

          // Verify stock if increasing quantity
          const currentItem = items.find(
            (i) =>
              i.productId === productId &&
              (variantId ? i.variantId === variantId : true),
          );

          if (currentItem && quantity > currentItem.quantity) {
            try {
              const stockCheck = await checkStockAction(
                productId,
                variantId,
                quantity,
              );

              if (!stockCheck.success || !stockCheck.available) {
                toast.error(
                  stockCheck.message || "Requested quantity not available",
                );
                return;
              }
            } catch (error) {
              console.error("Stock check failed:", error);
              // Optimistically allow or block? Let's block to be safe but not crash
              toast.error("Could not verify stock. Please try again.");
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

          if (userId) {
            debouncedSync(newItems, userId);
          }
        },

        clearCart: (userId) => {
          const newItems: CartItem[] = [];

          set({ items: newItems });

          if (userId) {
            debouncedSync(newItems, userId);
          }
        },

        toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

        shippingCost: 120, // Default to outside Dhaka
        setShippingCost: (cost: number) => set({ shippingCost: cost }),

        syncCart: async (userId: string) => {
          performSync(get().items, userId);
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
