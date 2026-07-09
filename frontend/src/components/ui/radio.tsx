import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const radio = (
      <input
        ref={ref}
        type="radio"
        id={id}
        className={cn(
          "h-4 w-4 border-border bg-surface accent-primary focus:outline-none focus:ring-2 focus:ring-primary",
          className
        )}
        {...props}
      />
    );
    if (!label) return radio;
    return (
      <label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
        {radio}
        {label}
      </label>
    );
  }
);
Radio.displayName = "Radio";
