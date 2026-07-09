"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { getErrorMessage } from "@/lib/api/client";
import { addToWishlist, fetchWishlist, removeFromWishlist } from "@/lib/api/wishlist.api";
import type { Product } from "@/types/product";

export function useWishlist() {
  const { user } = useAuth();
  return useQuery({ queryKey: ["wishlist", "mine"], queryFn: fetchWishlist, enabled: !!user });
}

/**
 * Patches `isWishlisted` on every cached shape that might hold this
 * product: the single-product cache, plain paginated list responses, and
 * infinite-query list responses (`{ pages: [...] }`). Used for optimistic
 * updates — apply immediately on click, roll back on error.
 */
function patchWishlistInCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  productId: string,
  productSlug: string | undefined,
  isWishlisted: boolean
) {
  if (productSlug) {
    queryClient.setQueryData<Product>(["product", productSlug], (old) =>
      old ? { ...old, isWishlisted } : old
    );
  }

  queryClient.setQueriesData({ queryKey: ["products"] }, (old: unknown) => {
    if (!old || typeof old !== "object") return old;

    if ("pages" in old && Array.isArray((old as { pages: unknown[] }).pages)) {
      const infinite = old as { pages: { items: Product[]; [k: string]: unknown }[]; pageParams: unknown[] };
      return {
        ...infinite,
        pages: infinite.pages.map((page) => ({
          ...page,
          items: page.items.map((p) => (p.id === productId ? { ...p, isWishlisted } : p)),
        })),
      };
    }

    if ("items" in old && Array.isArray((old as { items: unknown[] }).items)) {
      const list = old as { items: Product[]; [k: string]: unknown };
      return { ...list, items: list.items.map((p) => (p.id === productId ? { ...p, isWishlisted } : p)) };
    }

    return old;
  });
}

export function useWishlistMutation(productId: string, productSlug?: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const router = useRouter();

  const add = useMutation({
    mutationFn: () => addToWishlist(productId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      patchWishlistInCaches(queryClient, productId, productSlug, true);
    },
    onError: (err) => {
      patchWishlistInCaches(queryClient, productId, productSlug, false);
      toast.error(getErrorMessage(err, "Couldn't add to wishlist"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      if (productSlug) queryClient.invalidateQueries({ queryKey: ["product", productSlug] });
    },
  });

  const remove = useMutation({
    mutationFn: () => removeFromWishlist(productId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      patchWishlistInCaches(queryClient, productId, productSlug, false);
    },
    onError: (err) => {
      patchWishlistInCaches(queryClient, productId, productSlug, true);
      toast.error(getErrorMessage(err, "Couldn't remove from wishlist"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      if (productSlug) queryClient.invalidateQueries({ queryKey: ["product", productSlug] });
    },
  });

  function toggle(isWishlisted?: boolean) {
    if (!user) {
      router.push("/login");
      return;
    }
    if (isWishlisted) remove.mutate();
    else add.mutate();
  }

  return { toggle, isPending: add.isPending || remove.isPending };
}
