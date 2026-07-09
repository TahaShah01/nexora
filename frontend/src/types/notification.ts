export type NotificationType = "message" | "order" | "review" | "favorite" | "system" | "payment" | "follow";

export interface AppNotification {
  _id: string;
  recipient: string;
  type: NotificationType;
  title: string;
  body: string;
  targetUrl: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  items: AppNotification[];
  page: number;
  totalPages: number;
  total: number;
  unreadCount: number;
}
