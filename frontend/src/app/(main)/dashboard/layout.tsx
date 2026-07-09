import { ProtectedRoute } from "@/components/shared/protected-route";
import { DashboardMobileNav, DashboardSidebar } from "@/components/dashboard/dashboard-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <DashboardMobileNav />
        <div className="flex gap-6">
          <DashboardSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
