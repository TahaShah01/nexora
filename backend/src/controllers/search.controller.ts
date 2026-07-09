import type { NextFunction, Request, Response } from "express";
import { Product } from "../models/Product.model";
import { Service } from "../models/Service.model";
import { User } from "../models/User.model";

export async function globalSearch(req: Request, res: Response, next: NextFunction) {
  try {
    const q = String(req.query.q || "").trim();
    const type = String(req.query.type || "all");

    if (!q || q.length < 2) {
      return res.json({ products: [], services: [], users: [] });
    }

    const regex = new RegExp(q, "i");

    const [products, services, users] = await Promise.all([
      type === "service" || type === "user"
        ? []
        : Product.find({ status: "active", $or: [{ title: regex }, { description: regex }] })
            .select("title slug images price ratingAvg condition")
            .limit(12),

      type === "product" || type === "user"
        ? []
        : Service.find({ status: "active", $or: [{ title: regex }, { description: regex }] })
            .select("title slug images startingPrice ratingAvg")
            .populate("provider", "name username")
            .limit(12),

      type === "product" || type === "service"
        ? []
        : User.find({
            accountStatus: "active",
            $or: [{ name: regex }, { username: regex }, { bio: regex }],
          })
            .select("name username avatarUrl bio role ratingAvg ratingCount skills")
            .limit(8),
    ]);

    res.json({ products, services, users });
  } catch (err) {
    next(err);
  }
}
