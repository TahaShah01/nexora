import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../middleware/errorHandler";
import { Availability } from "../models/Availability.model";
import { Service } from "../models/Service.model";

export async function getAvailabilityForService(req: Request, res: Response, next: NextFunction) {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) throw new ApiError(404, "Service not found");

    const availability = await Availability.findOne({ provider: service.provider });
    res.json({
      recurringSlots: availability?.recurringSlots ?? [],
      blockedDates: availability?.blockedDates ?? [],
    });
  } catch (err) {
    next(err);
  }
}

export async function updateAvailabilityForService(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) throw new ApiError(404, "Service not found");
    if (service.provider.toString() !== req.user.id) {
      throw new ApiError(403, "You don't own this service");
    }

    const availability = await Availability.findOneAndUpdate(
      { provider: req.user.id },
      { $set: req.body },
      { new: true, upsert: true }
    );

    res.json({
      recurringSlots: availability.recurringSlots,
      blockedDates: availability.blockedDates,
    });
  } catch (err) {
    next(err);
  }
}
