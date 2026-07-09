"use client";

import { Calendar as CalendarIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useMyBookings } from "@/hooks/use-bookings";
import type { Booking } from "@/types/booking";

function serviceTitle(service: Booking["service"]): string {
  return typeof service === "object" ? service.title : "Service";
}

function otherPartyName(booking: Booking, myId: string): string {
  const buyer = typeof booking.buyer === "object" ? booking.buyer : null;
  const provider = typeof booking.provider === "object" ? booking.provider : null;
  const iAmBuyer = (buyer?._id ?? booking.buyer) === myId;
  return iAmBuyer ? (provider?.name ?? "Provider") : (buyer?.name ?? "Client");
}

export default function CalendarPage() {
  const { user } = useAuth();
  const { data: bookings = [], isLoading } = useMyBookings();

  const upcoming = bookings
    .filter((b) => b.scheduledDate && b.status !== "cancelled" && b.status !== "declined")
    .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime());

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-text-primary">Calendar</h1>
      <p className="mb-4 text-sm text-text-secondary">
        Upcoming scheduled bookings, soonest first.
      </p>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-card" />
          ))}
        </div>
      ) : upcoming.length === 0 ? (
        <EmptyState
          icon={CalendarIcon}
          title="Nothing scheduled"
          description="Bookings with a scheduled date will appear here, soonest first."
        />
      ) : (
        <div className="divide-y divide-border rounded-card border border-border bg-card">
          {upcoming.map((booking) => (
            <div key={booking._id} className="flex items-center justify-between gap-3 px-4 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">{serviceTitle(booking.service)}</p>
                <p className="text-xs text-text-muted">with {otherPartyName(booking, user?.id ?? "")}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-primary">
                  {new Date(booking.scheduledDate!).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <Badge variant={booking.status === "accepted" ? "success" : "default"} className="mt-1">
                  {booking.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
