import type { Review, ReviewListResponse, ReviewTargetType } from "@/types/review";
import { apiClient } from "./client";

export async function fetchReviews(targetType: ReviewTargetType, targetId: string): Promise<ReviewListResponse> {
  const { data } = await apiClient.get<ReviewListResponse>("/reviews", { params: { targetType, targetId } });
  return data;
}

export async function fetchMyReviews(): Promise<Review[]> {
  const { data } = await apiClient.get<{ items: Review[] }>("/reviews/mine");
  return data.items;
}

export interface CreateReviewPayload {
  targetType: ReviewTargetType;
  targetId: string;
  order?: string;
  booking?: string;
  rating: number;
  comment: string;
}

export async function createReview(payload: CreateReviewPayload): Promise<Review> {
  const { data } = await apiClient.post<{ review: Review }>("/reviews", payload);
  return data.review;
}

export async function deleteReview(id: string): Promise<void> {
  await apiClient.delete(`/reviews/${id}`);
}
