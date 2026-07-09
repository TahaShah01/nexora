import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

import { ApiError } from "../middleware/errorHandler";
import { Booking } from "../models/Booking.model";
import { Follow } from "../models/Follow.model";
import { Notification } from "../models/Notification.model";
import { Order } from "../models/Order.model";
import { Review } from "../models/Review.model";
import { Wishlist } from "../models/Wishlist.model";

export async function getActivity(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(userId);

    const [orders, bookings, reviewsGiven, followsGiven] = await Promise.all([
      Order.find({ $or: [{ buyer: userObjectId }, { seller: userObjectId }] })
        .sort({ createdAt: -1 })
        .limit(10)
        .select("productSnapshot status createdAt buyer seller"),
      Booking.find({ $or: [{ buyer: userObjectId }, { provider: userObjectId }] })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("service", "title"),
      Review.find({ author: userObjectId }).sort({ createdAt: -1 }).limit(10),
      Follow.find({ follower: userObjectId }).sort({ createdAt: -1 }).limit(10).populate("following", "name"),
    ]);

    type ActivityEvent = { type: string; message: string; createdAt: Date };

    const events: ActivityEvent[] = [
      ...orders.map((o) => ({
        type: "order",
        message:
          o.buyer.toString() === userId
            ? `You ordered "${o.productSnapshot.title}" (${o.status})`
            : `You received an order for "${o.productSnapshot.title}" (${o.status})`,
        createdAt: o.createdAt,
      })),
      ...bookings.map((b) => {
        const service = b.service as unknown as { title?: string } | null;
        return {
          type: "booking",
          message:
            b.buyer.toString() === userId
              ? `You requested to book "${service?.title ?? "a service"}" (${b.status})`
              : `You received a booking request for "${service?.title ?? "a service"}" (${b.status})`,
          createdAt: b.createdAt,
        };
      }),
      ...reviewsGiven.map((r) => ({
        type: "review",
        message: `You left a ${r.rating}-star review`,
        createdAt: r.createdAt,
      })),
      ...followsGiven.map((f) => {
        const following = f.following as unknown as { name?: string } | null;
        return {
          type: "follow",
          message: `You followed ${following?.name ?? "someone"}`,
          createdAt: f.createdAt,
        };
      }),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20);

    res.json({ items: events });
  } catch (err) {
    next(err);
  }
}

export async function getAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
    const userId = new Types.ObjectId(req.user.id);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalOrders,
      totalBookings,
      totalSpentAgg,
      wishlistCount,
      unreadNotifications,
      revenueByDayAgg,
      ordersByStatusAgg,
      topProductsAgg,
      bookingRevenueByDayAgg,
      bookingsByStatusAgg,
      topServicesAgg,
    ] = await Promise.all([
      Order.countDocuments({ buyer: userId }),
      Booking.countDocuments({ buyer: userId }),
      Order.aggregate([
        { $match: { buyer: userId, status: { $nin: ["cancelled", "refunded"] } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Wishlist.countDocuments({ user: userId }),
      Notification.countDocuments({ recipient: userId, isRead: false }),
      Order.aggregate([
        {
          $match: {
            seller: userId,
            createdAt: { $gte: thirtyDaysAgo },
            status: { $nin: ["cancelled", "refunded"] },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([{ $match: { seller: userId } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { seller: userId, status: { $nin: ["cancelled", "refunded"] } } },
        { $group: { _id: "$product", orderCount: { $sum: 1 }, revenue: { $sum: "$total" } } },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
        { $unwind: "$product" },
      ]),
      Booking.aggregate([
        {
          $match: {
            provider: userId,
            createdAt: { $gte: thirtyDaysAgo },
            status: { $nin: ["declined", "cancelled"] },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$package.price" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Booking.aggregate([{ $match: { provider: userId } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
      Booking.aggregate([
        { $match: { provider: userId, status: { $nin: ["declined", "cancelled"] } } },
        { $group: { _id: "$service", bookingCount: { $sum: 1 }, revenue: { $sum: "$package.price" } } },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        { $lookup: { from: "services", localField: "_id", foreignField: "_id", as: "service" } },
        { $unwind: "$service" },
      ]),
    ]);

    res.json({
      summary: {
        totalOrders,
        totalBookings,
        totalSpent: totalSpentAgg[0]?.total ?? 0,
        wishlistCount,
        unreadNotifications,
      },
      revenueByDay: revenueByDayAgg.map((r) => ({ date: r._id, revenue: r.revenue })),
      ordersByStatus: ordersByStatusAgg.map((r) => ({ status: r._id, count: r.count })),
      topProducts: topProductsAgg.map((r) => ({
        id: r.product._id,
        title: r.product.title,
        slug: r.product.slug,
        orderCount: r.orderCount,
        revenue: r.revenue,
      })),
      bookingRevenueByDay: bookingRevenueByDayAgg.map((r) => ({ date: r._id, revenue: r.revenue })),
      bookingsByStatus: bookingsByStatusAgg.map((r) => ({ status: r._id, count: r.count })),
      topServices: topServicesAgg.map((r) => ({
        id: r.service._id,
        title: r.service.title,
        slug: r.service.slug,
        bookingCount: r.bookingCount,
        revenue: r.revenue,
      })),
    });
  } catch (err) {
    next(err);
  }
}
