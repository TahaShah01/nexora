import type { NextFunction, Request, Response } from "express";
import { ServiceCategory } from "../models/ServiceCategory.model";

export async function listServiceCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await ServiceCategory.find().sort({ order: 1 });
    res.json({
      categories: categories.map((c) => ({
        id: c._id,
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        order: c.order,
      })),
    });
  } catch (err) {
    next(err);
  }
}
