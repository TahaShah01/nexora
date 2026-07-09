"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SIZES = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" };

export interface RatingProps {
  value: number;
  count?: number;
  size?: keyof typeof SIZES;
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

/** Display mode by default; pass `interactive` + `onChange` to use as a review-form input. */
export function Rating({ value, count, size = "md", interactive, onChange, className }: RatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const shown = hovered ?? value;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex" onMouseLeave={() => setHovered(null)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : undefined}
            onMouseEnter={() => interactive && setHovered(i)}
            onClick={() => interactive && onChange?.(i)}
            className={interactive ? "cursor-pointer" : undefined}
          >
            <Star
              className={cn(
                SIZES[size],
                i <= Math.round(shown) ? "fill-warning text-warning" : "fill-transparent text-border"
              )}
            />
          </span>
        ))}
      </div>
      {typeof count === "number" && (
        <span className="ml-1 text-sm text-text-secondary">
          {value.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}
