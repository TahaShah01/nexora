"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterCategoryOption {
  id: string;
  label: string;
  count?: number;
}

export interface PriceRange {
  min?: number;
  max?: number;
}

export interface FilterPanelProps {
  categories: FilterCategoryOption[];
  selectedCategoryId?: string | null;
  onCategoryChange?: (id: string | null) => void;
  priceRange?: PriceRange;
  onPriceRangeChange?: (range: PriceRange) => void;
  minRating?: number;
  onMinRatingChange?: (rating: number) => void;
  onClearAll?: () => void;
  /** Slot for module-specific filters — e.g. "Condition" on Products, "Delivery Time" on Services. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Structural shell only — no product/service/category data is baked in.
 * Products (Phase 4) and Services (Phase 5) pass their real, API-fetched
 * categories and wire the on*Change callbacks to actual query params.
 */
export function FilterPanel({
  categories,
  selectedCategoryId,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  minRating,
  onMinRatingChange,
  onClearAll,
  children,
  className,
}: FilterPanelProps) {
  return (
    <aside className={cn("w-full max-w-xs space-y-6 rounded-card border border-border bg-card p-5", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">Filters</h3>
        {onClearAll && (
          <button type="button" onClick={onClearAll} className="text-sm text-primary hover:text-primary-hover">
            Clear All
          </button>
        )}
      </div>

      <div>
        <h4 className="mb-3 text-sm font-medium text-text-secondary">Categories</h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onCategoryChange?.(null)}
            className={cn(
              "flex w-full items-center justify-between rounded-btn px-2.5 py-1.5 text-left text-sm transition-colors",
              !selectedCategoryId ? "bg-primary/15 text-primary" : "text-text-secondary hover:bg-elevated"
            )}
          >
            All Categories
          </button>
          {categories.length === 0 && (
            <p className="px-2.5 py-1.5 text-sm text-text-muted">Categories will appear here.</p>
          )}
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange?.(cat.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-btn px-2.5 py-1.5 text-left text-sm transition-colors",
                selectedCategoryId === cat.id
                  ? "bg-primary/15 text-primary"
                  : "text-text-secondary hover:bg-elevated"
              )}
            >
              <span>{cat.label}</span>
              {typeof cat.count === "number" && <span className="text-xs text-text-muted">{cat.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {onPriceRangeChange && (
        <div>
          <h4 className="mb-3 text-sm font-medium text-text-secondary">Price Range</h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange?.min ?? ""}
              onChange={(e) =>
                onPriceRangeChange({ ...priceRange, min: e.target.value ? Number(e.target.value) : undefined })
              }
              className="h-9 w-full rounded-input border border-border bg-surface px-2 text-sm text-text-primary placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="text-text-muted">–</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange?.max ?? ""}
              onChange={(e) =>
                onPriceRangeChange({ ...priceRange, max: e.target.value ? Number(e.target.value) : undefined })
              }
              className="h-9 w-full rounded-input border border-border bg-surface px-2 text-sm text-text-primary placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {onMinRatingChange && (
        <div>
          <h4 className="mb-3 text-sm font-medium text-text-secondary">Rating</h4>
          <div className="space-y-1.5">
            {[4, 3, 2, 1].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onMinRatingChange(r)}
                className={cn(
                  "flex w-full items-center gap-1.5 rounded-btn px-2.5 py-1 text-sm transition-colors",
                  minRating === r ? "bg-primary/15 text-primary" : "text-text-secondary hover:bg-elevated"
                )}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn("h-3.5 w-3.5", i < r ? "fill-warning text-warning" : "fill-transparent text-border")}
                  />
                ))}
                <span className="ml-1">& Up</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {children}
    </aside>
  );
}
