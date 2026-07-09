import type { NextFunction, Request, Response } from "express";
import type { HydratedDocument } from "mongoose";

import { ApiError } from "../middleware/errorHandler";
import { type IService, Service } from "../models/Service.model";
import { User } from "../models/User.model";
import { ensureUniqueSlug } from "../utils/slug";
import type { ListServicesQuery } from "../validators/service.validators";

function serializeService(service: HydratedDocument<IService>) {
  return {
    id: service._id,
    slug: service.slug,
    title: service.title,
    description: service.description,
    category: service.category,
    packages: service.packages,
    startingPrice: service.startingPrice,
    images: service.images,
    location: service.location,
    ratingAvg: service.ratingAvg,
    ratingCount: service.ratingCount,
    status: service.status,
    provider: service.provider,
    createdAt: service.createdAt,
  };
}

export async function listServices(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, provider, minPrice, maxPrice, location, minRating, maxDeliveryDays, q, sort, page, limit } =
      req.query as unknown as ListServicesQuery;

    const filter: Record<string, unknown> = { status: "active" };
    if (category) filter.category = category;
    if (provider) {
      const providerUser = await User.findOne({ username: provider }).select("_id");
      if (!providerUser) {
        res.json({ items: [], page: 1, totalPages: 1, total: 0 });
        return;
      }
      filter.provider = providerUser._id;
    }
    if (location) filter.location = { $regex: location, $options: "i" };
    if (minRating) filter.ratingAvg = { $gte: minRating };
    if (maxDeliveryDays !== undefined) {
      filter.packages = { $elemMatch: { deliveryDays: { $lte: maxDeliveryDays } } };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.startingPrice = {
        ...(minPrice !== undefined ? { $gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { $lte: maxPrice } : {}),
      };
    }
    if (q) filter.$text = { $search: q };

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      price_asc: { startingPrice: 1 },
      price_desc: { startingPrice: -1 },
      rating: { ratingAvg: -1 },
    };
    const sortBy = sortMap[sort] ?? sortMap.newest;

    const [items, total] = await Promise.all([
      Service.find(filter)
        .populate("category", "name slug")
        .populate("provider", "name username avatarUrl verificationStatus")
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit),
      Service.countDocuments(filter),
    ]);

    res.json({
      items: items.map(serializeService),
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      total,
    });
  } catch (err) {
    next(err);
  }
}

export async function getServiceBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const service = await Service.findOne({ slug: req.params.slug })
      .populate("category", "name slug")
      .populate("provider", "name username avatarUrl verificationStatus trustScore responseTimeMinutes");
    if (!service) throw new ApiError(404, "Service not found");
    res.json({ service: serializeService(service) });
  } catch (err) {
    next(err);
  }
}

export async function listRelatedServices(req: Request, res: Response, next: NextFunction) {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) throw new ApiError(404, "Service not found");

    const related = await Service.find({
      category: service.category,
      _id: { $ne: service._id },
      status: "active",
    })
      .limit(4)
      .populate("provider", "name username avatarUrl");

    res.json({ items: related.map(serializeService) });
  } catch (err) {
    next(err);
  }
}

export async function createService(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const slug = await ensureUniqueSlug(
      (candidate) => Service.exists({ slug: candidate }).then(Boolean),
      req.body.title
    );
    const service = await Service.create({ ...req.body, slug, provider: req.user.id });
    res.status(201).json({ service: serializeService(service) });
  } catch (err) {
    next(err);
  }
}

export async function updateService(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) throw new ApiError(404, "Service not found");
    if (service.provider.toString() !== req.user.id && req.user.role !== "admin") {
      throw new ApiError(403, "You don't own this service");
    }

    Object.assign(service, req.body);
    await service.save();
    res.json({ service: serializeService(service) });
  } catch (err) {
    next(err);
  }
}

export async function deleteService(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) throw new ApiError(404, "Service not found");
    if (service.provider.toString() !== req.user.id && req.user.role !== "admin") {
      throw new ApiError(403, "You don't own this service");
    }

    await service.deleteOne();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
