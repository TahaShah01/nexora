"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/api/admin.api";
import { Users, Package, Briefcase, ShoppingBag } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!stats) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
      <p className="mt-1 mb-6 text-sm text-text-secondary">Platform insights and overview</p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} />
        <StatCard title="Total Products" value={stats.totalProducts} icon={Package} />
        <StatCard title="Total Services" value={stats.totalServices} icon={Briefcase} />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: { title: string; value: number; icon: any }) {
  return (
    <div className="rounded-card bg-card p-6 shadow-sm border border-border flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <p className="mt-2 text-3xl font-bold text-text-primary">{value}</p>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
