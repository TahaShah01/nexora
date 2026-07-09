import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function pageWindow(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - (sorted[i - 1] as number) > 1) result.push("ellipsis");
    result.push(p);
  });
  return result;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className={cn("flex items-center justify-center gap-1", className)} aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="rounded-input p-2 text-text-secondary hover:bg-elevated disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pageWindow(page, totalPages).map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e-${i}`} className="px-2 text-text-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page}
            className={cn(
              "h-9 w-9 rounded-input text-sm font-medium transition-colors",
              p === page ? "bg-primary text-ink" : "text-text-secondary hover:bg-elevated"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="rounded-input p-2 text-text-secondary hover:bg-elevated disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
