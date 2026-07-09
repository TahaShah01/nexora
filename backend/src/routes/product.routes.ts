import { Router } from "express";

import {
  createProduct,
  deleteProduct,
  getProductBySlug,
  listProducts,
  listRelatedProducts,
  updateProduct,
} from "../controllers/product.controller";
import { optionalAuth, requireAuth, requireRole } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { createProductSchema, listProductsQuerySchema, updateProductSchema } from "../validators/product.validators";

const router = Router();

router.get("/", validate(listProductsQuerySchema), listProducts);
router.post("/", requireAuth, requireRole("seller", "provider", "admin"), validate(createProductSchema), createProduct);
router.get("/:slug", optionalAuth, getProductBySlug);
router.get("/:slug/related", listRelatedProducts);
router.patch("/:slug", requireAuth, validate(updateProductSchema), updateProduct);
router.delete("/:slug", requireAuth, deleteProduct);

export default router;
