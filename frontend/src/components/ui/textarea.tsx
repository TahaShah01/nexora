import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-input border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-placeholder transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
        error ? "border-danger" : "border-border",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
