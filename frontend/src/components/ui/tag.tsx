import { cn } from "@/lib/utils";

/** Static label — used for skills lists, category tags, etc. Not interactive (see Chip for that). */
export function Tag({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-badge border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text-secondary",
        className
      )}
      {...props}
    />
  );
}
