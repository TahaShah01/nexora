"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/api/client";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  type ProductInput,
} from "@/lib/api/products.api";

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductInput) => createProduct(payload),
    onSuccess: () => {
      toast.success("Product listed");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Couldn't create that listing")),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: Partial<ProductInput> }) => updateProduct(slug, payload),
    onSuccess: () => {
      toast.success("Product updated");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Couldn't update that listing")),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => deleteProduct(slug),
    onSuccess: () => {
      toast.success("Product removed");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Couldn't remove that listing")),
  });
}
