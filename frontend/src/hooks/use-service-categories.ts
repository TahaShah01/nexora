import { useQuery } from "@tanstack/react-query";
import { fetchServiceCategories } from "@/lib/api/service-categories.api";

export function useServiceCategories() {
  return useQuery({
    queryKey: ["service-categories"],
    queryFn: fetchServiceCategories,
    staleTime: 10 * 60 * 1000,
  });
}
