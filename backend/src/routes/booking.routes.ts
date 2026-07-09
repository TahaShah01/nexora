import { Router } from "express";
import { createBooking, getMyBookingForService, listMyBookings, updateBookingStatus } from "../controllers/booking.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { createBookingSchema, updateBookingStatusSchema } from "../validators/booking.validators";

const router = Router();

router.get("/", requireAuth, listMyBookings);
router.get("/my-booking", requireAuth, getMyBookingForService);
router.post("/", requireAuth, validate(createBookingSchema), createBooking);
router.patch("/:id/status", requireAuth, validate(updateBookingStatusSchema), updateBookingStatus);

export default router;
