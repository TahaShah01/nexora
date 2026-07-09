"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/api/client";
import { createReview, deleteReview, fetchReviews, type CreateReviewPayload } from "@/lib/api/reviews.api";
import type { ReviewTargetType } from "@/types/review";

export function useReviews(targetType: ReviewTargetType, targetId: string) {
  return useQuery({
    queryKey: ["reviews", targetType, targetId],
    queryFn: () => fetchReviews(targetType, targetId),
    enabled: !!targetId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(payload),
    onSuccess: (_review, payload) => {
      toast.success("Review posted");
      queryClient.invalidateQueries({ queryKey: ["reviews", payload.targetType, payload.targetId] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["service"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Couldn't post that review")),
  });
}

export function useDeleteReview(targetType: ReviewTargetType, targetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      toast.success("Review deleted");
      queryClient.invalidateQueries({ queryKey: ["reviews", targetType, targetId] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["service"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Couldn't delete that review")),
  });
}
