import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics } from "@/lib/api/dashboard.api";

export function useAnalytics() {
  return useQuery({ queryKey: ["dashboard", "analytics"], queryFn: fetchAnalytics });
}
