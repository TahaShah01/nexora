"use client";

import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom";
  className?: string;
}

/** CSS-only tooltip (no JS positioning) — shows on hover/focus, respects reduced motion via the global rule in globals.css. */
export function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-[8px] bg-elevated px-2.5 py-1.5 text-xs text-text-primary opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
          className
        )}
      >
        {content}
      </span>
    </span>
  );
}
