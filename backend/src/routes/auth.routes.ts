import { Router } from "express";

import { changePassword, login, logout, me, refresh, register } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { changePasswordSchema, loginSchema, registerSchema } from "../validators/auth.validators";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", requireAuth, logout);
router.post("/refresh", refresh);
router.get("/me", requireAuth, me);
router.patch("/change-password", requireAuth, validate(changePasswordSchema), changePassword);

export default router;
