import { Router } from "express";
import {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  updateUserRole,
  getListings,
  updateListingStatus,
  getCategories,
  createCategory,
  deleteCategory,
  getReports,
  updateReportStatus,
  getActivityLogs,
  updateUserVerification,
} from "../controllers/admin.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";

const router = Router();

// All admin routes are protected by auth + admin role
router.use(requireAuth, requireRole("admin"));

// Dashboard Insights
router.get("/stats", getDashboardStats);

// Users
router.get("/users", getUsers);
router.patch("/users/:id/status", updateUserStatus);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id/verification", updateUserVerification);

// Listings
router.get("/listings", getListings);
router.patch("/listings/:id/status", updateListingStatus);

// Categories
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.delete("/categories/:id", deleteCategory);

// Reports
router.get("/reports", getReports);
router.patch("/reports/:id/status", updateReportStatus);

// Activity Logs
router.get("/activity", getActivityLogs);

export default router;
