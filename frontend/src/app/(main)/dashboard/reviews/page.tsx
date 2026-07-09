"use client";

import { Star } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { ReviewCard } from "@/components/ui/review-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useMyReviews } from "@/hooks/use-my-reviews";
import { useReviews } from "@/hooks/use-reviews";

export default function ReviewsPage() {
  const { user } = useAuth();
  const { data: received, isLoading: receivedLoading } = useReviews("user", user?.id ?? "");
  const { data: given = [], isLoading: givenLoading } = useMyReviews();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-text-primary">Reviews</h1>

      <Tabs defaultValue="received">
        <TabsList>
          <TabsTrigger value="received">Received ({received?.total ?? 0})</TabsTrigger>
          <TabsTrigger value="given">Given ({given.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="received">
          {receivedLoading ? (
            <Skeleton className="h-40 w-full rounded-card" />
          ) : received && received.items.length > 0 ? (
            <div className="rounded-card border border-border bg-card px-5">
              {received.items.map((review) => {
                const author = typeof review.author === "object" ? review.author : null;
                return (
                  <ReviewCard
                    key={review._id}
                    authorName={author?.name ?? "Nexora user"}
                    authorAvatarUrl={author?.avatarUrl}
                    rating={review.rating}
                    comment={review.comment}
                    createdAt={review.createdAt}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState icon={Star} title="No reviews yet" description="Reviews left about you will show up here." />
          )}
        </TabsContent>

        <TabsContent value="given">
          {givenLoading ? (
            <Skeleton className="h-40 w-full rounded-card" />
          ) : given.length > 0 ? (
            <div className="space-y-3">
              {given.map((review) => (
                <div key={review._id} className="rounded-card border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-badge bg-elevated px-2 py-0.5 text-xs font-medium text-text-secondary">
                      {review.targetType}
                    </span>
                    <span className="text-xs text-text-muted">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Star}
              title="You haven't reviewed anything yet"
              description="Reviews you leave on products, services, or people will show up here."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
