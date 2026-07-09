import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

import { ApiError } from "../middleware/errorHandler";
import { Booking } from "../models/Booking.model";
import { Order } from "../models/Order.model";
import { Product } from "../models/Product.model";
import { Review } from "../models/Review.model";
import { Service } from "../models/Service.model";
import { User } from "../models/User.model";
import { createNotification } from "../services/notification.service";
import { recomputeRating } from "../utils/rating";
import type { ListReviewsQuery } from "../validators/review.validators";

export async function createReview(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const { targetType, targetId, order: orderId, booking: bookingId, rating, comment } = req.body;

    // Eligibility: the reviewer must actually be the buyer on a real,
    // non-cancelled order or non-declined booking that matches the target.
    // This is what stops anyone from posting a review for something they
    // never bought or booked.
    if (orderId) {
      const order = await Order.findById(orderId);
      if (!order || order.buyer.toString() !== req.user.id) {
        throw new ApiError(403, "You can only review orders you placed");
      }
      if (["cancelled", "refunded"].includes(order.status)) {
        throw new ApiError(400, "This order was cancelled or refunded");
      }
      const validTarget =
        (targetType === "product" && order.product.toString() === targetId) ||
        (targetType === "user" && order.seller.toString() === targetId);
      if (!validTarget) throw new ApiError(400, "This order doesn't match the review target");
    } else if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (!booking || booking.buyer.toString() !== req.user.id) {
        throw new ApiError(403, "You can only review bookings you made");
      }
      if (["declined", "cancelled"].includes(booking.status)) {
        throw new ApiError(400, "This booking was declined or cancelled");
      }
      const validTarget =
        (targetType === "service" && booking.service.toString() === targetId) ||
        (targetType === "user" && booking.provider.toString() === targetId);
      if (!validTarget) throw new ApiError(400, "This booking doesn't match the review target");
    }

    const review = await Review.create({
      author: req.user.id,
      targetType,
      targetId,
      order: orderId,
      booking: bookingId,
      rating,
      comment,
    });

    await recomputeRating(targetType, targetId);

    const author = await User.findById(req.user.id).select("name username");
    let recipientId: string | null = null;
    if (targetType === "user") {
      recipientId = targetId;
    } else if (targetType === "product") {
      const product = await Product.findById(targetId).select("seller");
      recipientId = product?.seller.toString() ?? null;
    } else if (targetType === "service") {
      const service = await Service.findById(targetId).select("provider");
      recipientId = service?.provider.toString() ?? null;
    }
    if (recipientId && author && recipientId !== req.user.id) {
      await createNotification({
        recipient: recipientId,
        type: "review",
        title: "New review",
        body: `${author.name} left a ${rating}-star review`,
        targetUrl: `/profile/${author.username}`,
      });
    }

    res.status(201).json({ review });
  } catch (err) {
    if ((err as { code?: number }).code === 11000) {
      next(new ApiError(409, "You've already reviewed this"));
      return;
    }
    next(err);
  }
}

/** Reviews I've written — powers the Phase 9 dashboard Reviews tab's "Given" side. */
export async function listMyReviews(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
    const reviews = await Review.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json({ items: reviews });
  } catch (err) {
    next(err);
  }
}

export async function listReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const { targetType, targetId, page, limit } = req.query as unknown as ListReviewsQuery;
    const targetObjectId = new Types.ObjectId(targetId);

    const [items, total, distribution] = await Promise.all([
      Review.find({ targetType, targetId: targetObjectId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("author", "name username avatarUrl"),
      Review.countDocuments({ targetType, targetId: targetObjectId }),
      Review.aggregate([
        { $match: { targetType, targetId: targetObjectId } },
        { $group: { _id: "$rating", count: { $sum: 1 } } },
      ]),
    ]);

    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const d of distribution) {
      if (breakdown[d._id as keyof typeof breakdown] !== undefined) {
        breakdown[d._id as keyof typeof breakdown] = d.count;
      }
    }

    res.json({ items, page, totalPages: Math.max(1, Math.ceil(total / limit)), total, breakdown });
  } catch (err) {
    next(err);
  }
}

export async function deleteReview(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const review = await Review.findById(req.params.id);
    if (!review) throw new ApiError(404, "Review not found");
    if (review.author.toString() !== req.user.id) throw new ApiError(403, "You can only delete your own reviews");

    const { targetType, targetId } = review;
    await review.deleteOne();
    await recomputeRating(targetType, targetId.toString());

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
