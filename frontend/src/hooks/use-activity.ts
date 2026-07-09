import { useQuery } from "@tanstack/react-query";
import { fetchActivity } from "@/lib/api/dashboard.api";

export function useActivity() {
  return useQuery({ queryKey: ["dashboard", "activity"], queryFn: fetchActivity });
}
