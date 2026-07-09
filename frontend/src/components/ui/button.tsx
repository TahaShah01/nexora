import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

// Minimal primitive, forward-borrowed from Phase 2 (Design System) because
// Phase 1's login/register forms need it today. Phase 2 will expand variants
// (icon-only, loading spinner, etc.) but the API surface stays stable.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-btn text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        primary: "bg-primary text-ink hover:bg-primary-hover",
        secondary: "bg-secondary text-white hover:opacity-90",
        outline: "border border-border bg-transparent text-text-primary hover:bg-surface",
        ghost: "bg-transparent text-text-primary hover:bg-surface",
        danger: "bg-danger text-ink hover:opacity-90",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "…" : children}
    </button>
  )
);
Button.displayName = "Button";
