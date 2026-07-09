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
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";
import type { AppNotification, NotificationType } from "@/types/notification";

const TYPE_CONFIG: Record<NotificationType, { icon: React.ElementType; color: string; bg: string }> = {
  message:  { icon: MessageCircle, color: "text-blue-400",   bg: "bg-blue-400/10" },
  order:    { icon: ShoppingBag,   color: "text-amber-400",  bg: "bg-amber-400/10" },
  review:   { icon: Star,          color: "text-yellow-400", bg: "bg-yellow-400/10" },
  favorite: { icon: Heart,         color: "text-red-400",    bg: "bg-red-400/10" },
  follow:   { icon: UserPlus,      color: "text-green-400",  bg: "bg-green-400/10" },
  system:   { icon: Zap,           color: "text-primary",    bg: "bg-primary/10" },
  payment:  { icon: Zap,           color: "text-primary",    bg: "bg-primary/10" },
};

function NotificationIcon({ type }: { type: NotificationType }) {
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.system;
  const Icon = config.icon;
  return (
    <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", config.bg)}>
      <Icon className={cn("h-5 w-5", config.color)} />
    </span>
  );
}

function NotificationItem({
  n,
  onClick,
  onDelete,
}: {
  n: AppNotification;
  onClick: (n: AppNotification) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 px-5 py-4 transition-colors hover:bg-elevated",
        !n.isRead && "bg-primary/5"
      )}
    >
      {/* Unread dot */}
      {!n.isRead && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
      )}

      <NotificationIcon type={n.type} />

      <button
        type="button"
        className="min-w-0 flex-1 text-left"
        onClick={() => onClick(n)}
      >
        <p className="text-sm font-semibold text-text-primary leading-snug">{n.title}</p>
        <p className="mt-0.5 text-sm text-text-secondary line-clamp-2">{n.body}</p>
        <p className="mt-1 text-xs text-text-muted">
          {formatDistanceToNowStrict(new Date(n.createdAt), { addSuffix: true })}
        </p>
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete(n._id); }}
        className="ml-2 shrink-0 rounded-btn p-1.5 text-text-muted opacity-0 transition-opacity hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
        aria-label="Delete notification"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const { data, isLoading, markRead, markAllRead, deleteOne, deleteAll } = useNotifications();
  const notifications = data?.items ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  function handleClick(n: AppNotification) {
    if (!n.isRead) markRead.mutate(n._id);
    router.push(n.targetUrl);
  }

  function handleDelete(id: string) {
    deleteOne.mutate(id);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Notifications</h1>
          {unreadCount > 0 && (
            <p className="mt-0.5 text-sm text-text-muted">{unreadCount} unread</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()} isLoading={markAllRead.isPending}>
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteAll.mutate()}
              isLoading={deleteAll.isPending}
              className="text-danger hover:text-danger hover:bg-danger/10"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Clear all
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-card" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="You're all caught up!"
          description="Activity on your account — orders, bookings, messages, follows — will show up here."
        />
      ) : (
        <div className="rounded-card border border-border bg-card divide-y divide-border overflow-hidden">
          {notifications.map((n) => (
            <NotificationItem
              key={n._id}
              n={n}
              onClick={handleClick}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
