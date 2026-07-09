"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { Activity as ActivityIcon, Heart, ShoppingBag, Star, UserPlus } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivity } from "@/hooks/use-activity";

const ICONS: Record<string, typeof ActivityIcon> = {
  order: ShoppingBag,
  booking: ShoppingBag,
  review: Star,
  follow: UserPlus,
  favorite: Heart,
};

export default function ActivityPage() {
  const { data, isLoading } = useActivity();
  const events = data?.items ?? [];

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-text-primary">Activity</h1>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-card" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={ActivityIcon}
          title="No activity yet"
          description="Your orders, bookings, reviews, and follows will show up here as a timeline."
        />
      ) : (
        <div className="divide-y divide-border rounded-card border border-border bg-card">
          {events.map((event, i) => {
            const Icon = ICONS[event.type] ?? ActivityIcon;
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-primary/15 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-text-primary">{event.message}</p>
                  <p className="text-xs text-text-muted">
                    {formatDistanceToNowStrict(new Date(event.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
