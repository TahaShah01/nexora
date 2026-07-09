import { Router } from "express";
import { getActivity, getAnalytics } from "../controllers/dashboard.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/analytics", requireAuth, getAnalytics);
router.get("/activity", requireAuth, getActivity);

export default router;
