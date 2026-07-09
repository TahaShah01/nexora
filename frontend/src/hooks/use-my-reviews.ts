import { useQuery } from "@tanstack/react-query";
import { fetchMyReviews } from "@/lib/api/reviews.api";

export function useMyReviews() {
  return useQuery({ queryKey: ["reviews", "mine"], queryFn: fetchMyReviews });
}
