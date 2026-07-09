import type { Product } from "@/types/product";
import { apiClient } from "./client";

export async function fetchWishlist(): Promise<Product[]> {
  const { data } = await apiClient.get<{ items: Product[] }>("/wishlist");
  return data.items;
}

export async function addToWishlist(productId: string): Promise<void> {
  await apiClient.post(`/wishlist/${productId}`);
}

export async function removeFromWishlist(productId: string): Promise<void> {
  await apiClient.delete(`/wishlist/${productId}`);
}
