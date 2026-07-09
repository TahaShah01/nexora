import type { LucideIcon } from "lucide-react";
import { Button } from "./button";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** An empty screen is an invitation to act, not just an apology. */
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border px-6 py-14 text-center">
      {Icon && (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-elevated text-text-muted">
          <Icon className="h-6 w-6" />
        </span>
      )}
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-text-secondary">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
