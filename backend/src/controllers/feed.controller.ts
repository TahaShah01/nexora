import type { NextFunction, Request, Response } from "express";
import { Product } from "../models/Product.model";
import { Service } from "../models/Service.model";
import { User } from "../models/User.model";

export async function getFeed(req: Request, res: Response, next: NextFunction) {
  try {
    const [latestProducts, featuredServices, topProviders] = await Promise.all([
      Product.find({ status: "active" })
        .sort({ createdAt: -1 })
        .limit(8)
        .populate("seller", "name username avatarUrl ratingAvg ratingCount"),
      
      Service.find({ status: "active" })
        .sort({ ratingAvg: -1, ratingCount: -1, createdAt: -1 })
        .limit(8)
        .populate("provider", "name username avatarUrl"),
      
      User.find({ role: "provider", accountStatus: "active" })
        .sort({ ratingAvg: -1, ratingCount: -1 })
        .select("name username avatarUrl bio skills ratingAvg ratingCount")
        .limit(8),
    ]);

    res.json({
      latestProducts,
      featuredServices,
      topProviders,
    });
  } catch (err) {
    next(err);
  }
}
