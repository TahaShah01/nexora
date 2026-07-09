import { Router } from "express";

import { followUser, getProfile, unfollowUser, updateProfile } from "../controllers/user.controller";
import { optionalAuth, requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { updateProfileSchema } from "../validators/user.validators";

const router = Router();

router.patch("/me", requireAuth, validate(updateProfileSchema), updateProfile);
router.get("/:username", optionalAuth, getProfile);
router.post("/:username/follow", requireAuth, followUser);
router.delete("/:username/follow", requireAuth, unfollowUser);

export default router;
