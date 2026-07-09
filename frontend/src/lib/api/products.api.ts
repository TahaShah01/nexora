import type { Product, ProductListParams, ProductListResponse } from "@/types/product";
import { apiClient } from "./client";

export async function fetchProducts(params: ProductListParams = {}): Promise<ProductListResponse> {
  const { data } = await apiClient.get<ProductListResponse>("/products", { params });
  return data;
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const { data } = await apiClient.get<{ product: Product }>(`/products/${slug}`);
  return data.product;
}

export async function fetchRelatedProducts(slug: string): Promise<Product[]> {
  const { data } = await apiClient.get<{ items: Product[] }>(`/products/${slug}/related`);
  return data.items;
}

export interface ProductInput {
  title: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  condition: string;
  images: string[];
  location?: string;
  stock?: number;
  status?: string;
}

export async function createProduct(payload: ProductInput): Promise<Product> {
  const { data } = await apiClient.post<{ product: Product }>("/products", payload);
  return data.product;
}

export async function updateProduct(slug: string, payload: Partial<ProductInput>): Promise<Product> {
  const { data } = await apiClient.patch<{ product: Product }>(`/products/${slug}`, payload);
  return data.product;
}

export async function deleteProduct(slug: string): Promise<void> {
  await apiClient.delete(`/products/${slug}`);
}
