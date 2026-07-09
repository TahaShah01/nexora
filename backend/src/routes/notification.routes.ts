import { Router } from "express";

import {
  deleteAllNotifications,
  deleteNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controllers/notification.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { listNotificationsQuerySchema } from "../validators/notification.validators";

const router = Router();

router.get("/", requireAuth, validate(listNotificationsQuerySchema), listNotifications);
router.patch("/read-all", requireAuth, markAllNotificationsRead);
router.patch("/:id/read", requireAuth, markNotificationRead);
router.delete("/all", requireAuth, deleteAllNotifications);
router.delete("/:id", requireAuth, deleteNotification);

export default router;
