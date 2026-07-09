import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api/categories.api";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
  });
}
