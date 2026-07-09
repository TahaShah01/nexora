import { apiClient } from "./client";
import type { Product } from "@/types/product";
import type { Service } from "@/types/service";
import type { PublicProfile } from "@/types/user";

export interface FeedData {
  latestProducts: Product[];
  featuredServices: Service[];
  topProviders: PublicProfile[];
}

export async function fetchFeed(): Promise<FeedData> {
  const { data } = await apiClient.get<FeedData>("/feed");
  return data;
}
