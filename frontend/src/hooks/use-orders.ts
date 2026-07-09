"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/api/client";
import { createOrder, fetchMyOrderForProduct, fetchMyOrders, updateOrderStatus, type CreateOrderPayload } from "@/lib/api/orders.api";

export function useMyOrders() {
  return useQuery({ queryKey: ["orders", "mine"], queryFn: fetchMyOrders });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      toast.success("Order updated");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Couldn't update that order")),
  });
}

export function useMyOrderForProduct(productSlug: string, enabled: boolean) {
  return useQuery({
    queryKey: ["orders", "for-product", productSlug],
    queryFn: () => fetchMyOrderForProduct(productSlug),
    enabled: enabled && !!productSlug,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      toast.success("Order placed");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Couldn't place that order")),
  });
}
