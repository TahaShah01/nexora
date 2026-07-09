"use client";

import {
  Activity,
  Bell,
  Calendar,
  Heart,
  LayoutDashboard,
  MessageCircle,
  Package,
  Settings,
  ShoppingBag,
  Star,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { useUnreadMessageCount } from "@/hooks/use-conversations";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/listings", label: "Listings", icon: Package, roles: ["seller", "provider", "admin"] },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/bookings", label: "Bookings", icon: Calendar },
  { href: "/dashboard/messages", label: "Messages", icon: MessageCircle },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/saved", label: "Saved Items", icon: Heart },
  { href: "/dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/activity", label: "Activity", icon: Activity },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function useDashboardNavItems() {
  const { user } = useAuth();
  const unreadMessages = useUnreadMessageCount();
  const { data: notifData } = useNotifications();

  const items = NAV_ITEMS.filter((item) => !item.roles || (user && item.roles.includes(user.role)));

  function badgeFor(href: string): number {
    if (href === "/dashboard/messages") return unreadMessages;
    if (href === "/dashboard/notifications") return notifData?.unreadCount ?? 0;
    return 0;
  }

  return { items, badgeFor };
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { items, badgeFor } = useDashboardNavItems();

  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <nav className="sticky top-20 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          const badge = badgeFor(item.href);
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
              {badge > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-badge bg-primary px-1 text-[10px] font-semibold text-ink">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function DashboardMobileNav() {
  const pathname = usePathname();
  const { items, badgeFor } = useDashboardNavItems();

  return (
    <nav className="mb-4 flex gap-2 overflow-x-auto pb-1 md:hidden">
      {items.map((item) => {
        const active = pathname === item.href;
        const badge = badgeFor(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-badge border px-3 py-1.5 text-xs font-medium",
              active ? "border-primary bg-primary/15 text-primary" : "border-border text-text-secondary"
            )}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
            {badge > 0 && <span className="text-primary">({badge > 9 ? "9+" : badge})</span>}
          </Link>
        );
      })}
    </nav>
  );
}
