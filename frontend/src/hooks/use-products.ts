import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api/products.api";
import type { ProductListParams } from "@/types/product";

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
  });
}

/** Infinite-scroll variant of the products list — powers the Products marketplace page (Phase 10). */
export function useInfiniteProducts(params: Omit<ProductListParams, "page">) {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", params],
    queryFn: ({ pageParam }) => fetchProducts({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
  });
}
