"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Rating } from "@/components/ui/rating";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "@/hooks/use-reviews";
import type { ReviewTargetType } from "@/types/review";
import { cn } from "@/lib/utils";

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

/** Reusable review composer — used for product reviews, service reviews, and "rate the seller/provider" (targetType="user"). */
export function ReviewForm({
  targetType,
  targetId,
  orderId,
  bookingId,
  triggerLabel,
}: {
  targetType: ReviewTargetType;
  targetId: string;
  orderId?: string;
  bookingId?: string;
  triggerLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const createReview = useCreateReview();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createReview.mutate(
      { targetType, targetId, order: orderId, booking: bookingId, rating, comment },
      {
        onSuccess: () => {
          setOpen(false);
          setComment("");
          setRating(5);
        },
      }
    );
  }

  const isOverLimit = comment.length > 500;
  const isUnderLimit = comment.length > 0 && comment.length < 10;
  const isValid = !isOverLimit && !isUnderLimit && comment.length >= 10;

  return (
    <>
      <Button variant="outline" size="sm" type="button" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={triggerLabel}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col items-center justify-center py-2">
            <p className="mb-2 text-sm font-medium text-text-secondary">Overall Rating</p>
            <div className="flex flex-col items-center gap-1">
              <Rating value={rating} interactive onChange={setRating} size="lg" />
              <span className="text-sm font-semibold text-primary">{RATING_LABELS[rating]}</span>
            </div>
          </div>
          
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-sm font-medium text-text-secondary">Review Details</p>
              <span className={cn(
                "text-xs",
                isOverLimit ? "text-danger font-medium" : "text-text-muted"
              )}>
                {comment.length}/500
              </span>
            </div>
            <Textarea
              rows={4}
              placeholder="What did you like or dislike? What should other people know?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              minLength={10}
              maxLength={500}
              className={cn(isOverLimit && "border-danger focus-visible:ring-danger")}
            />
            {isUnderLimit && (
              <p className="mt-1 text-xs text-danger">Review must be at least 10 characters.</p>
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createReview.isPending} disabled={!isValid}>
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
