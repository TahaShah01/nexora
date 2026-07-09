import { Router } from "express";
import { listServiceCategories } from "../controllers/service-category.controller";

const router = Router();
router.get("/", listServiceCategories);

export default router;
