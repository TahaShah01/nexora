import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User.model";
import { Product } from "../models/Product.model";
import { Service } from "../models/Service.model";
import { Category } from "../models/Category.model";
import { ServiceCategory } from "../models/ServiceCategory.model";
import { Report } from "../models/Report.model";
import { Review } from "../models/Review.model";
import { Order } from "../models/Order.model";
import { ActivityLog } from "../models/ActivityLog.model";
import { ApiError } from "../middleware/errorHandler";
import { logActivity } from "../services/activity.service";

// --- DASHBOARD & INSIGHTS ---

export async function getDashboardStats(req: Request, res: Response, next: NextFunction) {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalOrders = await Order.countDocuments();

    // In a real app, you'd aggregate revenue, growth, etc.
    // For MVP admin dashboard, we fetch basic counts.
    res.json({
      totalUsers,
      totalProducts,
      totalServices,
      totalOrders,
    });
  } catch (err) {
    next(err);
  }
}

// --- USER MANAGEMENT ---

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const skip = (page - 1) * limit;

    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-passwordHash");

    const total = await User.countDocuments();
    res.json({ users, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

export async function updateUserStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status } = req.body; // "active" | "suspended" | "deleted"

    if (!["active", "suspended", "deleted"].includes(status)) {
      throw new ApiError(400, "Invalid status");
    }

    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");

    const oldStatus = user.accountStatus;
    user.accountStatus = status;
    await user.save();

    await logActivity({
      actor: req.user!.id,
      action: status === "suspended" ? "admin:suspend_user" : status === "deleted" ? "admin:delete_user" : "admin:activate_user",
      targetModel: "User",
      targetId: user._id,
      previousValue: { accountStatus: oldStatus },
      newValue: { accountStatus: status },
      ipAddress: req.ip,
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["buyer", "seller", "provider", "admin"].includes(role)) {
      throw new ApiError(400, "Invalid role");
    }

    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");

    const oldRole = user.role;
    user.role = role;
    await user.save();

    await logActivity({
      actor: req.user!.id,
      action: "admin:update_role",
      targetModel: "User",
      targetId: user._id,
      previousValue: { role: oldRole },
      newValue: { role },
      ipAddress: req.ip,
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
}

// --- VERIFICATION MANAGEMENT ---

export async function updateUserVerification(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["unverified", "pending", "verified"].includes(status)) {
      throw new ApiError(400, "Invalid verification status");
    }

    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");

    const oldStatus = user.verificationStatus;
    user.verificationStatus = status;
    await user.save();

    await logActivity({
      actor: req.user!.id,
      action: "admin:update_verification",
      targetModel: "User",
      targetId: user._id,
      previousValue: { verificationStatus: oldStatus },
      newValue: { verificationStatus: status },
      ipAddress: req.ip,
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
}

// --- LISTING MODERATION ---

export async function getListings(req: Request, res: Response, next: NextFunction) {
  try {
    const type = req.query.type; // "product" or "service"
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const skip = (page - 1) * limit;

    let items = [];
    let total = 0;

    if (type === "service") {
      items = await Service.find().populate("provider", "name").sort({ createdAt: -1 }).skip(skip).limit(limit);
      total = await Service.countDocuments();
    } else {
      items = await Product.find().populate("seller", "name").sort({ createdAt: -1 }).skip(skip).limit(limit);
      total = await Product.countDocuments();
    }

    res.json({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

export async function updateListingStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { type, status } = req.body; // type: "product" | "service", status: "active" | "archived" (or removed)

    let listing;
    let targetModel: "Product" | "Service";

    if (type === "service") {
      listing = await Service.findById(id);
      targetModel = "Service";
    } else {
      listing = await Product.findById(id);
      targetModel = "Product";
    }

    if (!listing) throw new ApiError(404, "Listing not found");

    const oldStatus = listing.status;
    listing.status = status;
    await listing.save();

    await logActivity({
      actor: req.user!.id,
      action: status === "active" ? "admin:approve_listing" : "admin:remove_listing",
      targetModel,
      targetId: listing._id,
      previousValue: { status: oldStatus },
      newValue: { status },
      ipAddress: req.ip,
    });

    res.json(listing);
  } catch (err) {
    next(err);
  }
}

// --- CATEGORY MANAGEMENT ---

export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const type = req.query.type; // "product" | "service"
    if (type === "service") {
      const cats = await ServiceCategory.find().sort({ order: 1, name: 1 });
      res.json(cats);
    } else {
      const cats = await Category.find().sort({ order: 1, name: 1 });
      res.json(cats);
    }
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { type, name, slug, icon, order } = req.body;
    let cat;
    let targetModel: "Category" | "ServiceCategory";

    if (type === "service") {
      cat = await ServiceCategory.create({ name, slug, icon, order });
      targetModel = "ServiceCategory";
    } else {
      cat = await Category.create({ name, slug, icon, order });
      targetModel = "Category";
    }

    await logActivity({
      actor: req.user!.id,
      action: "admin:create_category",
      targetModel,
      targetId: cat._id,
      newValue: cat,
      ipAddress: req.ip,
    });

    res.status(201).json(cat);
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { type } = req.query;

    if (type === "service") {
      await ServiceCategory.findByIdAndDelete(id);
    } else {
      await Category.findByIdAndDelete(id);
    }

    await logActivity({
      actor: req.user!.id,
      action: "admin:delete_category",
      targetModel: type === "service" ? "ServiceCategory" : "Category",
      targetId: id,
      ipAddress: req.ip,
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// --- REPORTS MODERATION ---

export async function getReports(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const skip = (page - 1) * limit;

    const reports = await Report.find()
      .populate("reporter", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Report.countDocuments();
    res.json({ reports, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

export async function updateReportStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!["pending", "resolved", "dismissed"].includes(status)) {
      throw new ApiError(400, "Invalid status");
    }

    const report = await Report.findById(id);
    if (!report) throw new ApiError(404, "Report not found");

    const oldStatus = report.status;
    report.status = status;
    if (adminNotes) report.adminNotes = adminNotes;
    if (status !== "pending") {
      report.resolvedBy = req.user!.id as any;
      report.resolvedAt = new Date();
    }

    await report.save();

    await logActivity({
      actor: req.user!.id,
      action: "admin:moderate_report",
      targetModel: "Report",
      targetId: report._id,
      previousValue: { status: oldStatus },
      newValue: { status },
      ipAddress: req.ip,
    });

    res.json(report);
  } catch (err) {
    next(err);
  }
}

// --- ACTIVITY LOGS ---

export async function getActivityLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 50);
    const skip = (page - 1) * limit;

    const logs = await ActivityLog.find()
      .populate("actor", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ActivityLog.countDocuments();
    res.json({ logs, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

