import { Router } from "express";

import { getAvailabilityForService, updateAvailabilityForService } from "../controllers/availability.controller";
import {
  createService,
  deleteService,
  getServiceBySlug,
  listRelatedServices,
  listServices,
  updateService,
} from "../controllers/service.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { updateAvailabilitySchema } from "../validators/availability.validators";
import { createServiceSchema, listServicesQuerySchema, updateServiceSchema } from "../validators/service.validators";

const router = Router();

router.get("/", validate(listServicesQuerySchema), listServices);
router.post("/", requireAuth, requireRole("provider", "admin"), validate(createServiceSchema), createService);
router.get("/:slug", getServiceBySlug);
router.get("/:slug/related", listRelatedServices);
router.get("/:slug/availability", getAvailabilityForService);
router.put("/:slug/availability", requireAuth, validate(updateAvailabilitySchema), updateAvailabilityForService);
router.patch("/:slug", requireAuth, validate(updateServiceSchema), updateService);
router.delete("/:slug", requireAuth, deleteService);

export default router;
