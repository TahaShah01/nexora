import { cn } from "@/lib/utils";

const SIZES = { sm: "h-4 w-4 border-2", md: "h-6 w-6 border-2", lg: "h-9 w-9 border-[3px]" };

export function Spinner({ size = "md", className }: { size?: keyof typeof SIZES; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block animate-spin rounded-full border-border border-t-primary",
        SIZES[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
