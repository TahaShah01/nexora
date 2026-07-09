import { ProtectedRoute } from "@/components/shared/protected-route";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/admin-nav";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { apiClient } from "@/lib/api/client";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Simple server-side protection fallback, client-side is handled by ProtectedRoute
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <AdminMobileNav />
        <div className="flex gap-6">
          <AdminSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
