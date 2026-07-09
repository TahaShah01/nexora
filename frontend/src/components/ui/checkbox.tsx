import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkbox = (
      <input
        ref={ref}
        type="checkbox"
        id={id}
        className={cn(
          "h-4 w-4 rounded border-border bg-surface accent-primary focus:outline-none focus:ring-2 focus:ring-primary",
          className
        )}
        {...props}
      />
    );
    if (!label) return checkbox;
    return (
      <label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
        {checkbox}
        {label}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
