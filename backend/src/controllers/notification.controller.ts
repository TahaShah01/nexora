import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../middleware/errorHandler";
import { Notification } from "../models/Notification.model";
import type { ListNotificationsQuery } from "../validators/notification.validators";

export async function listNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
    const { page, limit } = req.query as unknown as ListNotificationsQuery;

    const [items, total, unreadCount] = await Promise.all([
      Notification.find({ recipient: req.user.id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Notification.countDocuments({ recipient: req.user.id }),
      Notification.countDocuments({ recipient: req.user.id, isRead: false }),
    ]);

    res.json({ items, page, totalPages: Math.max(1, Math.ceil(total / limit)), total, unreadCount });
  } catch (err) {
    next(err);
  }
}

export async function markNotificationRead(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { isRead: true },
      { new: true }
    );
    if (!notification) throw new ApiError(404, "Notification not found");

    res.json({ notification });
  } catch (err) {
    next(err);
  }
}

export async function markAllNotificationsRead(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
    await Notification.updateMany({ recipient: req.user.id, isRead: false }, { isRead: true });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function deleteNotification(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user.id });
    if (!notification) throw new ApiError(404, "Notification not found");
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function deleteAllNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
    await Notification.deleteMany({ recipient: req.user.id });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
