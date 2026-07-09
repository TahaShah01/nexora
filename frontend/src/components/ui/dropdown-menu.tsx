"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

/** Lightweight dropdown — click trigger to open, click outside or Escape to close. */
export function DropdownMenu({ trigger, children, align = "right", className }: DropdownMenuProps) {
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
            "absolute z-40 mt-2 min-w-[12rem] rounded-input border border-border bg-card p-1.5 shadow-lg",
            align === "right" ? "right-0" : "left-0",
            className
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  className,
  danger,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-sm transition-colors hover:bg-elevated",
        danger ? "text-danger" : "text-text-primary",
        className
      )}
      {...props}
    />
  );
}
