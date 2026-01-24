"use server";

import { api } from "@/lib/api-client";
import { CartItem } from "@/lib/types";

export async function syncCartAction(items: CartItem[], userId: string) {
  return await api.post("/Cart/sync", { items, userId });
}
