"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Link from "next/link";
import { Heart, Package, ShoppingBag, Star, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalytics } from "@/hooks/use-analytics";
import { useAuth } from "@/contexts/AuthContext";

// Reuses the exact hex values from DESIGN_SYSTEM.md — Recharts needs
// concrete color strings, not Tailwind classes, for SVG fill/stroke.
const CHART_PRIMARY = "#B97A35";
const CHART_SECONDARY = "#6E7D57";

function StatCard({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-btn bg-primary/15 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-lg font-semibold text-text-primary">{value}</p>
          <p className="text-xs text-text-muted">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { data, isLoading } = useAnalytics();

  const isSeller = user?.role === "seller" || user?.role === "admin";
  const isProvider = user?.role === "provider" || user?.role === "admin";

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-card" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-card" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Overview</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard icon={ShoppingBag} label="Orders" value={data.summary.totalOrders} />
        <StatCard icon={Package} label="Bookings" value={data.summary.totalBookings} />
        <StatCard icon={Wallet} label="Total Spent" value={`$${data.summary.totalSpent.toFixed(2)}`} />
        <StatCard icon={Heart} label="Wishlist" value={data.summary.wishlistCount} />
        <StatCard icon={Star} label="Unread Alerts" value={data.summary.unreadNotifications} />
      </div>

      {isSeller && (
        <Card>
          <CardHeader>
            <CardTitle>Revenue (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {data.revenueByDay.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No sales yet"
                description="Revenue from your product orders will chart here once you make a sale."
              />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={data.revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--color-text-muted)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--color-text-muted)" />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }} />
                  <Area type="monotone" dataKey="revenue" stroke={CHART_PRIMARY} fill={CHART_PRIMARY} fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
            {data.topProducts.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium text-text-secondary">Top Products</p>
                <div className="space-y-2">
                  {data.topProducts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      className="flex items-center justify-between rounded-input border border-border px-3 py-2 text-sm hover:border-primary"
                    >
                      <span className="truncate text-text-primary">{p.title}</span>
                      <span className="shrink-0 text-text-muted">
                        {p.orderCount} orders · ${p.revenue.toFixed(2)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isProvider && (
        <Card>
          <CardHeader>
            <CardTitle>Booking Revenue (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {data.bookingRevenueByDay.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No bookings yet"
                description="Revenue from your service bookings will chart here once you get one."
              />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.bookingRevenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--color-text-muted)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--color-text-muted)" />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }} />
                  <Bar dataKey="revenue" fill={CHART_SECONDARY} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
            {data.topServices.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium text-text-secondary">Top Services</p>
                <div className="space-y-2">
                  {data.topServices.map((s) => (
                    <Link
                      key={s.id}
                      href={`/services/${s.slug}`}
                      className="flex items-center justify-between rounded-input border border-border px-3 py-2 text-sm hover:border-primary"
                    >
                      <span className="truncate text-text-primary">{s.title}</span>
                      <span className="shrink-0 text-text-muted">
                        {s.bookingCount} bookings · ${s.revenue.toFixed(2)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isSeller && !isProvider && (
        <EmptyState
          icon={Package}
          title="Nothing to sell yet"
          description="Revenue analytics show up here once your account has a seller or provider role and at least one listing."
        />
      )}
    </div>
  );
}
