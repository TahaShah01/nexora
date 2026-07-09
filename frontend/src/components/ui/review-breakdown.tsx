import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Rating } from "./rating";

export interface ReviewBreakdownProps {
  ratingAvg: number;
  ratingCount: number;
  breakdown: Record<number, number>;
  className?: string;
}

export function ReviewBreakdown({ ratingAvg, ratingCount, breakdown, className }: ReviewBreakdownProps) {
  if (ratingCount === 0) return null;

  return (
    <div className={cn("flex flex-col md:flex-row gap-6 md:gap-12 items-center", className)}>
      <div className="flex flex-col items-center shrink-0">
        <span className="text-5xl font-bold text-text-primary">{ratingAvg.toFixed(1)}</span>
        <Rating value={ratingAvg} size="md" className="mt-2 mb-1" />
        <span className="text-sm text-text-muted">{ratingCount} {ratingCount === 1 ? "review" : "reviews"}</span>
      </div>

      <div className="flex-1 w-full flex flex-col gap-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = breakdown[star] || 0;
          const percentage = ratingCount > 0 ? (count / ratingCount) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 w-8 shrink-0 font-medium text-text-secondary">
                {star} <Star className="h-3 w-3 fill-text-secondary text-text-secondary" />
              </span>
              <div className="h-2 flex-1 rounded-full bg-border overflow-hidden">
                <div 
                  className="h-full bg-warning rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-text-muted">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
