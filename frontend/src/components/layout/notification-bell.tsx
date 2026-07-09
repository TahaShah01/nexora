"use client";

import { formatDistanceToNowStrict } from "date-fns";
import {
  Bell,
  Heart,
  MessageCircle,
  ShoppingBag,
  Star,
  Trash2,
  UserPlus,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DropdownItem, DropdownMenu } from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";
import type { AppNotification, NotificationType } from "@/types/notification";

const TYPE_ICONS: Record<NotificationType, React.ElementType> = {
  message:  MessageCircle,
  order:    ShoppingBag,
  review:   Star,
  favorite: Heart,
  follow:   UserPlus,
  system:   Zap,
  payment:  Zap,
};

const TYPE_COLORS: Record<NotificationType, string> = {
  message:  "text-blue-400",
  order:    "text-amber-400",
  review:   "text-yellow-400",
  favorite: "text-red-400",
  follow:   "text-green-400",
  system:   "text-primary",
  payment:  "text-primary",
};

export function NotificationBell() {
  const router = useRouter();
  const { data, markRead, deleteOne } = useNotifications();
  const notifications = data?.items ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  function handleClick(n: AppNotification) {
    if (!n.isRead) markRead.mutate(n._id);
    router.push(n.targetUrl);
  }

  return (
    <DropdownMenu
      trigger={
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-btn text-text-secondary hover:bg-elevated hover:text-text-primary"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-badge bg-danger px-1 text-[9px] font-semibold text-ink">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      }
      className="max-h-[420px] w-80 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-sm font-semibold text-text-primary">Notifications</span>
        {unreadCount > 0 && (
          <span className="rounded-badge bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
            {unreadCount} new
          </span>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="px-3 py-6 text-center text-sm text-text-muted">No notifications yet.</p>
      ) : (
        notifications.slice(0, 8).map((n) => {
          const Icon = TYPE_ICONS[n.type] ?? Zap;
          const iconColor = TYPE_COLORS[n.type] ?? "text-primary";
          return (
            <DropdownItem
              key={n._id}
              onClick={() => handleClick(n)}
              className={cn("group relative", !n.isRead && "bg-primary/5")}
            >
              <div className="flex items-start gap-3 w-full min-w-0">
                {/* Unread dot */}
                {!n.isRead && (
                  <span className="absolute left-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
                <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", iconColor)} />
                <span className="min-w-0 flex-1 block">
                  <span className="block text-sm font-medium text-text-primary">{n.title}</span>
                  <span className="block truncate text-xs text-text-secondary">{n.body}</span>
                  <span className="block text-[10px] text-text-muted mt-0.5">
                    {formatDistanceToNowStrict(new Date(n.createdAt), { addSuffix: true })}
                  </span>
                </span>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); deleteOne.mutate(n._id); }}
                  className="ml-1 shrink-0 rounded p-1 text-text-muted opacity-0 hover:text-danger group-hover:opacity-100 cursor-pointer"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </div>
              </div>
            </DropdownItem>
          );
        })
      )}

      {notifications.length > 0 && (
        <div className="border-t border-border">
          <Link
            href="/dashboard/notifications"
            className="block px-3 py-2.5 text-center text-sm font-medium text-primary hover:bg-elevated transition-colors"
          >
            View all notifications
          </Link>
        </div>
      )}
    </DropdownMenu>
  );
}
