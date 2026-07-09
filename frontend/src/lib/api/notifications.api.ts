import type { NotificationsResponse } from "@/types/notification";
import { apiClient } from "./client";

export async function fetchNotifications(page = 1, limit = 20): Promise<NotificationsResponse> {
  const { data } = await apiClient.get<NotificationsResponse>("/notifications", { params: { page, limit } });
  return data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.patch("/notifications/read-all");
}

export async function deleteNotification(id: string): Promise<void> {
  await apiClient.delete(`/notifications/${id}`);
}

export async function deleteAllNotifications(): Promise<void> {
  await apiClient.delete("/notifications/all");
}
