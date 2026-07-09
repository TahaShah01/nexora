import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../middleware/errorHandler";
import { Booking } from "../models/Booking.model";
import { Service } from "../models/Service.model";
import { User } from "../models/User.model";
import { createNotification } from "../services/notification.service";

export async function createBooking(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const service = await Service.findById(req.body.service);
    if (!service) throw new ApiError(404, "Service not found");
    if (service.provider.toString() === req.user.id) {
      throw new ApiError(400, "You can't book your own service");
    }

    const pkg = service.packages.find((p: any) => p.name === req.body.packageName);
    if (!pkg) throw new ApiError(400, "Selected package doesn't exist on this service");

    const booking = await Booking.create({
      service: service._id,
      package: pkg,
      buyer: req.user.id,
      provider: service.provider,
      scheduledDate: req.body.scheduledDate,
      notes: req.body.notes,
    });

    const buyer = await User.findById(req.user.id).select("name");
    await createNotification({
      recipient: service.provider.toString(),
      type: "order",
      title: "New booking request",
      body: `${buyer?.name ?? "Someone"} requested to book "${service.title}"`,
      targetUrl: "/dashboard/bookings",
    });

    res.status(201).json({ booking });
  } catch (err) {
    next(err);
  }
}

export async function listMyBookings(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const bookings = await Booking.find({ $or: [{ buyer: req.user.id }, { provider: req.user.id }] })
      .sort({ createdAt: -1 })
      .populate("service", "title slug images")
      .populate("buyer", "name username avatarUrl")
      .populate("provider", "name username avatarUrl");

    res.json({ items: bookings });
  } catch (err) {
    next(err);
  }
}

/** Powers the service page's "did I book this?" check for Write a Review / Rate Provider gating. */
export async function getMyBookingForService(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const service = await Service.findOne({ slug: req.query.service as string });
    if (!service) {
      res.json({ booking: null });
      return;
    }

    const booking = await Booking.findOne({
      buyer: req.user.id,
      service: service._id,
      status: { $nin: ["declined", "cancelled"] },
    }).sort({ createdAt: -1 });

    res.json({ booking });
  } catch (err) {
    next(err);
  }
}

export async function updateBookingStatus(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const booking = await Booking.findById(req.params.id);
    if (!booking) throw new ApiError(404, "Booking not found");

    const { status } = req.body;
    const isProvider = booking.provider.toString() === req.user.id;
    const isBuyer = booking.buyer.toString() === req.user.id;

    if ((status === "accepted" || status === "declined" || status === "completed") && !isProvider) {
      throw new ApiError(403, "Only the provider can do that");
    }
    if (status === "cancelled" && !isProvider && !isBuyer) {
      throw new ApiError(403, "You're not part of this booking");
    }

    booking.status = status;
    await booking.save();

    if (isProvider) {
      await createNotification({
        recipient: booking.buyer.toString(),
        type: "order",
        title: "Booking update",
        body: `Your booking request is now ${status}`,
        targetUrl: "/dashboard/bookings",
      });
    } else if (isBuyer && status === "cancelled") {
      await createNotification({
        recipient: booking.provider.toString(),
        type: "order",
        title: "Booking cancelled",
        body: "A booking request was cancelled by the client",
        targetUrl: "/dashboard/bookings",
      });
    }

    res.json({ booking });
  } catch (err) {
    next(err);
  }
}
