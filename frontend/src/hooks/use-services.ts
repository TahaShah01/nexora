import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/lib/api/services.api";
import type { ServiceListParams } from "@/types/service";

export function useServices(params: ServiceListParams) {
  return useQuery({
    queryKey: ["services", params],
    queryFn: () => fetchServices(params),
  });
}

/** Infinite-scroll variant — powers the Services marketplace page (Phase 10). */
export function useInfiniteServices(params: Omit<ServiceListParams, "page">) {
  return useInfiniteQuery({
    queryKey: ["services", "infinite", params],
    queryFn: ({ pageParam }) => fetchServices({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
  });
}
