"use client";

import { ChevronDown } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

const AccordionContext = createContext<{ openItems: Set<string>; toggle: (v: string) => void } | null>(
  null
);

export function Accordion({
  children,
  allowMultiple = false,
  className,
}: {
  children: React.ReactNode;
  allowMultiple?: boolean;
  className?: string;
}) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  function toggle(value: string) {
    setOpenItems((prev) => {
      const next = allowMultiple ? new Set(prev) : new Set<string>();
      if (prev.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className={cn("divide-y divide-border rounded-card border border-border", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  title,
  children,
}: {
  value: string;
  title: string;
  children: React.ReactNode;
}) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem must be used within Accordion");
  const open = ctx.openItems.has(value);

  return (
    <div>
      <button
        type="button"
        onClick={() => ctx.toggle(value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-text-primary"
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 text-text-muted transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="px-4 pb-4 text-sm text-text-secondary">{children}</div>}
    </div>
  );
}
