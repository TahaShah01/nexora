import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

/** Interactive filter chip — used in the left filter panel and tag pickers. */
export function Chip({ label, selected, onClick, onRemove, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-badge border px-3 py-1.5 text-sm transition-colors",
        selected
          ? "border-primary bg-primary/15 text-primary"
          : "border-border bg-surface text-text-secondary hover:bg-elevated",
        className
      )}
    >
      {label}
      {onRemove && (
        <span
          role="button"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded-full hover:text-danger"
        >
          <X className="h-3 w-3" />
        </span>
      )}
    </button>
  );
}
