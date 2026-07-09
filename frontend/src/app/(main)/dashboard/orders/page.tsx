"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Download, MoreHorizontal, FileText, XCircle, CheckCircle, Truck, Package } from "lucide-react";
import Image from "next/image";

import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownItem } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useMyOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import { invoiceDownloadUrl } from "@/lib/api/orders.api";
import type { Order, OrderStatus } from "@/types/order";

const STATUS_OPTIONS: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled", "refunded"];

const STATUS_VARIANT: Record<OrderStatus, "success" | "warning" | "danger" | "default" | "info"> = {
  pending: "warning",
  confirmed: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
  refunded: "danger",
};

function partyName(party: Order["buyer"] | Order["seller"]): string {
  return typeof party === "object" ? party.name : "Unknown";
}

export default function OrdersPage() {
  const { user } = useAuth();
  const { data: orders = [], isLoading } = useMyOrders();
  const updateStatus = useUpdateOrderStatus();

  const purchases = orders.filter((o) => (typeof o.buyer === "object" ? o.buyer._id : o.buyer) === user?.id);
  const sales = orders.filter((o) => (typeof o.seller === "object" ? o.seller._id : o.seller) === user?.id);

  const purchaseColumns: ColumnDef<Order, unknown>[] = [
    {
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-input bg-elevated">
            {row.original.productSnapshot.image && (
              <Image src={row.original.productSnapshot.image} alt="" fill className="object-cover" />
            )}
          </div>
          <span className="truncate font-medium">{row.original.productSnapshot.title}</span>
        </div>
      ),
    },
    { header: "Seller", cell: ({ row }) => partyName(row.original.seller) },
    { header: "Total", cell: ({ row }) => `$${row.original.total.toFixed(2)}` },
    {
      header: "Status",
      cell: ({ row }) => <Badge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Badge>,
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <DropdownMenu
            trigger={
              <button type="button" className="p-1 text-text-muted hover:text-text-primary rounded hover:bg-elevated">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            }
          >
            <a href={invoiceDownloadUrl(order._id)} target="_blank" rel="noreferrer">
              <DropdownItem>
                <FileText className="h-4 w-4" /> Download Invoice
              </DropdownItem>
            </a>
            {order.status === "pending" && (
              <DropdownItem danger onClick={() => updateStatus.mutate({ orderId: order._id, status: "cancelled" })}>
                <XCircle className="h-4 w-4" /> Cancel Order
              </DropdownItem>
            )}
          </DropdownMenu>
        );
      },
    },
  ];

  const salesColumns: ColumnDef<Order, unknown>[] = [
    {
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-input bg-elevated">
            {row.original.productSnapshot.image && (
              <Image src={row.original.productSnapshot.image} alt="" fill className="object-cover" />
            )}
          </div>
          <span className="truncate font-medium">{row.original.productSnapshot.title}</span>
        </div>
      ),
    },
    { header: "Buyer", cell: ({ row }) => partyName(row.original.buyer) },
    { header: "Total", cell: ({ row }) => `$${row.original.total.toFixed(2)}` },
    {
      header: "Status",
      cell: ({ row }) => <Badge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Badge>,
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        const update = (s: OrderStatus) => updateStatus.mutate({ orderId: order._id, status: s });
        
        return (
          <DropdownMenu
            trigger={
              <button type="button" className="p-1 text-text-muted hover:text-text-primary rounded hover:bg-elevated">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            }
          >
            <a href={invoiceDownloadUrl(order._id)} target="_blank" rel="noreferrer">
              <DropdownItem>
                <FileText className="h-4 w-4" /> Download Invoice
              </DropdownItem>
            </a>
            {order.status === "pending" && (
              <>
                <DropdownItem onClick={() => update("confirmed")}>
                  <CheckCircle className="h-4 w-4 text-info" /> Confirm Order
                </DropdownItem>
                <DropdownItem danger onClick={() => update("cancelled")}>
                  <XCircle className="h-4 w-4" /> Cancel Order
                </DropdownItem>
              </>
            )}
            {order.status === "confirmed" && (
              <DropdownItem onClick={() => update("shipped")}>
                <Truck className="h-4 w-4 text-info" /> Mark as Shipped
              </DropdownItem>
            )}
            {order.status === "shipped" && (
              <DropdownItem onClick={() => update("delivered")}>
                <Package className="h-4 w-4 text-success" /> Mark as Delivered
              </DropdownItem>
            )}
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-text-primary">Orders</h1>

      <Tabs defaultValue="purchases">
        <TabsList>
          <TabsTrigger value="purchases">Purchases ({purchases.length})</TabsTrigger>
          <TabsTrigger value="sales">Sales ({sales.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="purchases">
          <DataTable
            columns={purchaseColumns}
            data={purchases}
            isLoading={isLoading}
            emptyMessage="You haven't ordered anything yet."
          />
        </TabsContent>

        <TabsContent value="sales">
          <DataTable
            columns={salesColumns}
            data={sales}
            isLoading={isLoading}
            emptyMessage="No one has ordered your products yet."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
