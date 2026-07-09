import { apiClient } from "./client";

export interface SearchResult {
  products: any[];
  services: any[];
  users: any[];
}

export async function globalSearch(q: string, type?: string): Promise<SearchResult> {
  const params = new URLSearchParams({ q });
  if (type) params.set("type", type);
  const { data } = await apiClient.get<SearchResult>(`/search?${params.toString()}`);
  return data;
}
