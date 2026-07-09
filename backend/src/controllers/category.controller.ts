import type { NextFunction, Request, Response } from "express";
import { Category } from "../models/Category.model";

export async function listCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await Category.find().sort({ order: 1 });
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
