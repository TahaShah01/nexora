import { Router } from "express";
import { signUpload } from "../controllers/upload.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/sign", requireAuth, signUpload);

export default router;
