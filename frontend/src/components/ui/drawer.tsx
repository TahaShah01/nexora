"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks/use-focus-trap";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: "left" | "right";
  children: React.ReactNode;
  className?: string;
}

export function Drawer({ open, onClose, title, side = "right", children, className }: DrawerProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  useFocusTrap(contentRef, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div
        ref={contentRef}
        tabIndex={-1}
        className={cn(
          "absolute top-0 h-full w-full max-w-sm bg-card p-6 shadow-lg focus:outline-none",
          side === "right" ? "right-0 border-l border-border" : "left-0 border-r border-border",
          className
        )}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1 text-text-muted hover:bg-elevated hover:text-text-primary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
