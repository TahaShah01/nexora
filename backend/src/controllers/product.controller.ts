import type { NextFunction, Request, Response } from "express";
import type { HydratedDocument } from "mongoose";

import { ApiError } from "../middleware/errorHandler";
import { type IProduct, Product } from "../models/Product.model";
import { User } from "../models/User.model";
import { Wishlist } from "../models/Wishlist.model";
import { ensureUniqueSlug } from "../utils/slug";
import type { ListProductsQuery } from "../validators/product.validators";

export function serializeProduct(product: HydratedDocument<IProduct>, isWishlisted = false) {
  return {
    id: product._id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    category: product.category,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    condition: product.condition,
    images: product.images,
    location: product.location,
    stock: product.stock,
    ratingAvg: product.ratingAvg,
    ratingCount: product.ratingCount,
    status: product.status,
    seller: product.seller,
    createdAt: product.createdAt,
    isWishlisted,
  };
}

export async function listProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, seller, minPrice, maxPrice, condition, location, minRating, q, sort, page, limit } =
      req.query as unknown as ListProductsQuery;

    const filter: Record<string, unknown> = { status: "active" };
    if (category) filter.category = category;
    if (seller) {
      const sellerUser = await User.findOne({ username: seller }).select("_id");
      if (!sellerUser) {
        res.json({ items: [], page: 1, totalPages: 1, total: 0 });
        return;
      }
      filter.seller = sellerUser._id;
    }
    if (condition) filter.condition = condition;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (minRating) filter.ratingAvg = { $gte: minRating };
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {
        ...(minPrice !== undefined ? { $gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { $lte: maxPrice } : {}),
      };
    }
    if (q) filter.$text = { $search: q };

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { ratingAvg: -1 },
    };
    const sortBy = sortMap[sort] ?? sortMap.newest;

    const [items, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .populate("seller", "name username avatarUrl verificationStatus")
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      items: items.map((p) => serializeProduct(p)),
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      total,
    });
  } catch (err) {
    next(err);
  }
}

export async function getProductBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category", "name slug")
      .populate("seller", "name username avatarUrl verificationStatus trustScore responseTimeMinutes");
    if (!product) throw new ApiError(404, "Product not found");

    let isWishlisted = false;
    if (req.user) {
      isWishlisted = Boolean(await Wishlist.exists({ user: req.user.id, product: product._id }));
    }

    res.json({ product: serializeProduct(product, isWishlisted) });
  } catch (err) {
    next(err);
  }
}

export async function listRelatedProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) throw new ApiError(404, "Product not found");

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: "active",
    })
      .limit(4)
      .populate("seller", "name username avatarUrl");

    res.json({ items: related.map((p) => serializeProduct(p)) });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const slug = await ensureUniqueSlug(
      (candidate) => Product.exists({ slug: candidate }).then(Boolean),
      req.body.title
    );
    const product = await Product.create({ ...req.body, slug, seller: req.user.id });
    res.status(201).json({ product: serializeProduct(product) });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) throw new ApiError(404, "Product not found");
    if (product.seller.toString() !== req.user.id && req.user.role !== "admin") {
      throw new ApiError(403, "You don't own this listing");
    }

    Object.assign(product, req.body);
    await product.save();
    res.json({ product: serializeProduct(product) });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) throw new ApiError(404, "Product not found");
    if (product.seller.toString() !== req.user.id && req.user.role !== "admin") {
      throw new ApiError(403, "You don't own this listing");
    }

    await product.deleteOne();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
