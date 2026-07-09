export type ReviewTargetType = "product" | "service" | "user";

export interface Review {
  _id: string;
  author: { _id: string; name: string; username: string; avatarUrl?: string } | string;
  targetType: ReviewTargetType;
  targetId: string;
  order?: string;
  booking?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewListResponse {
  items: Review[];
  page: number;
  totalPages: number;
  total: number;
  breakdown: Record<number, number>;
}
