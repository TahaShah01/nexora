import type { ServiceCategory } from "@/types/service";
import { apiClient } from "./client";

export async function fetchServiceCategories(): Promise<ServiceCategory[]> {
  const { data } = await apiClient.get<{ categories: ServiceCategory[] }>("/service-categories");
  return data.categories;
}
