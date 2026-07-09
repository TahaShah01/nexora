"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Same interaction model as DropdownMenu, but content stays open on inner clicks (for filter forms, etc.). */
export function Popover({ trigger, children, className }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute z-40 mt-2 rounded-input border border-border bg-card p-4 shadow-lg",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
