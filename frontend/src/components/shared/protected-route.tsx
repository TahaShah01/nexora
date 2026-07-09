"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Auth guard for authenticated-only pages/layouts. Not consumed by any
 * route yet — dashboard (Phase 9) and profile-edit (Phase 3) are the first
 * real callers. Built now because it's core auth infrastructure.
 */
export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user === null) {
      router.replace("/login");
    } else if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace("/");
    }
  }, [isLoading, user, router, allowedRoles]);

  if (isLoading || !user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
