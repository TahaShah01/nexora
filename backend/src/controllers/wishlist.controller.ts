import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../middleware/errorHandler";
import { Product } from "../models/Product.model";
import { User } from "../models/User.model";
import { Wishlist } from "../models/Wishlist.model";
import { serializeProduct } from "./product.controller";
import { createNotification } from "../services/notification.service";

export async function listWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const items = await Wishlist.find({ user: req.user.id }).populate({
      path: "product",
      populate: [
        { path: "category", select: "name slug" },
        { path: "seller", select: "name username avatarUrl" },
      ],
    });

    res.json({ items: items.map((w) => serializeProduct(w.product as any, true)) });
  } catch (err) {
    next(err);
  }
}

export async function addToWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
    await Wishlist.updateOne(
      { user: req.user.id, product: req.params.productId },
      { $setOnInsert: { user: req.user.id, product: req.params.productId } },
      { upsert: true }
    );

    const product = await Product.findById(req.params.productId).select("seller title slug");
    if (product && product.seller.toString() !== req.user.id) {
      const fan = await User.findById(req.user.id).select("name");
      await createNotification({
        recipient: product.seller.toString(),
        type: "favorite",
        title: "New favorite",
        body: `${fan?.name ?? "Someone"} added "${product.title}" to their wishlist`,
        targetUrl: `/products/${product.slug}`,
      });
    }

    res.status(201).json({ wishlisted: true });
  } catch (err) {
    next(err);
  }
}

export async function removeFromWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
    await Wishlist.deleteOne({ user: req.user.id, product: req.params.productId });
    res.status(200).json({ wishlisted: false });
  } catch (err) {
    next(err);
  }
}
