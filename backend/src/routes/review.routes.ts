import { Router } from "express";
import { createReview, deleteReview, listMyReviews, listReviews } from "../controllers/review.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { createReviewSchema, listReviewsQuerySchema } from "../validators/review.validators";

const router = Router();

router.get("/", validate(listReviewsQuerySchema), listReviews);
router.get("/mine", requireAuth, listMyReviews);
router.post("/", requireAuth, validate(createReviewSchema), createReview);
router.delete("/:id", requireAuth, deleteReview);

export default router;
