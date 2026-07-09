import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-input border bg-surface px-3 text-sm text-text-primary placeholder:text-placeholder transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
        error ? "border-danger" : "border-border",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
