import { Router } from "express";

import {
  createOrder,
  getMyOrderForProduct,
  getOrderInvoice,
  listMyOrders,
  updateOrderStatus,
} from "../controllers/order.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { createOrderSchema, updateOrderStatusSchema } from "../validators/order.validators";

const router = Router();

router.get("/", requireAuth, listMyOrders);
router.get("/my-order", requireAuth, getMyOrderForProduct);
router.post("/", requireAuth, validate(createOrderSchema), createOrder);
router.patch("/:id/status", requireAuth, validate(updateOrderStatusSchema), updateOrderStatus);
router.get("/:id/invoice", requireAuth, getOrderInvoice);

export default router;
