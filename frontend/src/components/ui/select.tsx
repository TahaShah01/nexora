import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "h-11 w-full appearance-none rounded-input border bg-surface px-3 pr-9 text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
          error ? "border-danger" : "border-border",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
    </div>
  )
);
Select.displayName = "Select";
