import type { Order } from "@/types/order";
import { apiClient } from "./client";

export interface CreateOrderPayload {
  product: string;
  quantity?: number;
  shippingAddress?: string;
  paymentMethod?: "cod" | "online";
  paymentProofUrl?: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await apiClient.post<{ order: Order }>("/orders", payload);
  return data.order;
}

export async function fetchMyOrderForProduct(productSlug: string): Promise<Order | null> {
  const { data } = await apiClient.get<{ order: Order | null }>("/orders/my-order", {
    params: { product: productSlug },
  });
  return data.order;
}

export async function fetchMyOrders(): Promise<Order[]> {
  const { data } = await apiClient.get<{ items: Order[] }>("/orders");
  return data.items;
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
  const { data } = await apiClient.patch<{ order: Order }>(`/orders/${orderId}/status`, { status });
  return data.order;
}

export function invoiceDownloadUrl(orderId: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
  return `${base}/orders/${orderId}/invoice`;
}
