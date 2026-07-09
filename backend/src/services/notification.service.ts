import { Notification, type NotificationType } from "../models/Notification.model";
import { getIO } from "../sockets/io-instance";

interface CreateNotificationInput {
  recipient: string;
  type: NotificationType;
  title: string;
  body: string;
  targetUrl: string;
}

/**
 * Every notification in the app is created through this one function —
 * persists it, then pushes it live to the recipient's socket room if
 * they're connected (reuses the Phase 7 `user:<id>` room; no separate
 * notifications namespace needed).
 */
export async function createNotification(input: CreateNotificationInput) {
  const notification = await Notification.create(input);
  getIO()?.to(`user:${input.recipient}`).emit("notification:new", notification);
  return notification;
}
