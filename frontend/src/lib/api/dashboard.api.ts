import type { ActivityEvent } from "@/types/activity";
import type { DashboardAnalytics } from "@/types/dashboard";
import { apiClient } from "./client";

export async function fetchAnalytics(): Promise<DashboardAnalytics> {
  const { data } = await apiClient.get<DashboardAnalytics>("/dashboard/analytics");
  return data;
}

export async function fetchActivity(): Promise<{ items: ActivityEvent[] }> {
  const { data } = await apiClient.get<{ items: ActivityEvent[] }>("/dashboard/activity");
  return data;
}
