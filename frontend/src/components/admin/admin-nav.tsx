"use client";

import {
  Activity,
  BarChart,
  FolderTree,
  LayoutDashboard,
  MessageSquareWarning,
  Package,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/listings", label: "Listings", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/reports", label: "Reports", icon: MessageSquareWarning },
  { href: "/admin/activity", label: "Activity Logs", icon: Activity },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <nav className="sticky top-20 space-y-1">
        <div className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Administration
        </div>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-btn px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/15 text-primary"
                  : "text-text-secondary hover:bg-elevated hover:text-text-primary"
              )}
            >
              <span className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <div className="mb-6 overflow-x-auto pb-2 md:hidden">
      <nav className="flex min-w-max space-x-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-btn px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/15 text-primary"
                  : "text-text-secondary hover:bg-elevated hover:text-text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
