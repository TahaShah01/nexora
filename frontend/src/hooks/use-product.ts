import { useQuery } from "@tanstack/react-query";
import { fetchProductBySlug, fetchRelatedProducts } from "@/lib/api/products.api";

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });
}

export function useRelatedProducts(slug: string) {
  return useQuery({
    queryKey: ["product", slug, "related"],
    queryFn: () => fetchRelatedProducts(slug),
    enabled: !!slug,
  });
}
