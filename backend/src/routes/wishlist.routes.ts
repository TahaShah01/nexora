import { Router } from "express";
import { addToWishlist, listWishlist, removeFromWishlist } from "../controllers/wishlist.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, listWishlist);
router.post("/:productId", requireAuth, addToWishlist);
router.delete("/:productId", requireAuth, removeFromWishlist);

export default router;
