"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Download, MoreHorizontal, FileText, XCircle, CheckCircle, Package } from "lucide-react";

import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownItem } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useMyBookings, useUpdateBookingStatus } from "@/hooks/use-bookings";
import { invoiceDownloadUrl } from "@/lib/api/orders.api";
import type { Booking, BookingStatus } from "@/types/booking";

const STATUS_OPTIONS: BookingStatus[] = ["pending", "accepted", "declined", "completed", "cancelled"];

const STATUS_VARIANT: Record<BookingStatus, "success" | "warning" | "danger" | "default" | "info"> = {
  pending: "warning",
  accepted: "info",
  declined: "danger",
  completed: "success",
  cancelled: "danger",
};

function partyName(party: Booking["buyer"] | Booking["provider"]): string {
  return typeof party === "object" ? party.name : "Unknown";
}

function serviceTitle(service: Booking["service"]): string {
  return typeof service === "object" ? service.title : "Service";
}

export default function BookingsPage() {
  const { user } = useAuth();
  const { data: bookings = [], isLoading } = useMyBookings();
  const updateStatus = useUpdateBookingStatus();

  const made = bookings.filter((b) => (typeof b.buyer === "object" ? b.buyer._id : b.buyer) === user?.id);
  const received = bookings.filter((b) => (typeof b.provider === "object" ? b.provider._id : b.provider) === user?.id);

  const madeColumns: ColumnDef<Booking, unknown>[] = [
    { header: "Service", cell: ({ row }) => serviceTitle(row.original.service) },
    { header: "Package", cell: ({ row }) => row.original.package.name },
    { header: "Provider", cell: ({ row }) => partyName(row.original.provider) },
    { header: "Price", cell: ({ row }) => `$${row.original.package.price.toFixed(2)}` },
    {
      header: "Status",
      cell: ({ row }) => <Badge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Badge>,
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original;
        const canCancel = booking.status === "pending" || booking.status === "accepted";
        
        return (
          <DropdownMenu
            trigger={
              <button type="button" className="p-1 text-text-muted hover:text-text-primary rounded hover:bg-elevated">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            }
          >
            <a href={invoiceDownloadUrl(booking._id)} target="_blank" rel="noreferrer">
              <DropdownItem>
                <FileText className="h-4 w-4" /> Download Invoice
              </DropdownItem>
            </a>
            {canCancel && (
              <DropdownItem danger onClick={() => updateStatus.mutate({ bookingId: booking._id, status: "cancelled" })}>
                <XCircle className="h-4 w-4" /> Cancel Booking
              </DropdownItem>
            )}
          </DropdownMenu>
        );
      },
    },
  ];

  const receivedColumns: ColumnDef<Booking, unknown>[] = [
    { header: "Service", cell: ({ row }) => serviceTitle(row.original.service) },
    { header: "Package", cell: ({ row }) => row.original.package.name },
    { header: "Client", cell: ({ row }) => partyName(row.original.buyer) },
    { header: "Price", cell: ({ row }) => `$${row.original.package.price.toFixed(2)}` },
    {
      header: "Status",
      cell: ({ row }) => <Badge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Badge>,
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original;
        const update = (s: BookingStatus) => updateStatus.mutate({ bookingId: booking._id, status: s });
        const canCancel = booking.status === "pending" || booking.status === "accepted";
        
        return (
          <DropdownMenu
            trigger={
              <button type="button" className="p-1 text-text-muted hover:text-text-primary rounded hover:bg-elevated">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            }
          >
            <a href={invoiceDownloadUrl(booking._id)} target="_blank" rel="noreferrer">
              <DropdownItem>
                <FileText className="h-4 w-4" /> Download Invoice
              </DropdownItem>
            </a>
            {booking.status === "pending" && (
              <>
                <DropdownItem onClick={() => update("accepted")}>
                  <CheckCircle className="h-4 w-4 text-info" /> Accept Booking
                </DropdownItem>
                <DropdownItem danger onClick={() => update("declined")}>
                  <XCircle className="h-4 w-4" /> Decline Booking
                </DropdownItem>
              </>
            )}
            {booking.status === "accepted" && (
              <DropdownItem onClick={() => update("completed")}>
                <Package className="h-4 w-4 text-success" /> Mark as Completed
              </DropdownItem>
            )}
            {canCancel && (
              <DropdownItem danger onClick={() => update("cancelled")}>
                <XCircle className="h-4 w-4" /> Cancel Booking
              </DropdownItem>
            )}
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-text-primary">Bookings</h1>

      <Tabs defaultValue="made">
        <TabsList>
          <TabsTrigger value="made">Made ({made.length})</TabsTrigger>
          <TabsTrigger value="received">Received ({received.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="made">
          <DataTable
            columns={madeColumns}
            data={made}
            isLoading={isLoading}
            emptyMessage="You haven't booked any services yet."
          />
        </TabsContent>

        <TabsContent value="received">
          <DataTable
            columns={receivedColumns}
            data={received}
            isLoading={isLoading}
            emptyMessage="No one has booked your services yet."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
