import type { Category } from "@/types/product";
import { apiClient } from "./client";

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<{ categories: Category[] }>("/categories");
  return data.categories;
}
