import { Types } from "mongoose";

import { Product } from "../models/Product.model";
import type { ReviewTargetType } from "../models/Review.model";
import { Review } from "../models/Review.model";
import { Service } from "../models/Service.model";
import { User } from "../models/User.model";

const TARGET_MODEL = { product: Product, service: Service, user: User } as const;

/** Recomputes ratingAvg/ratingCount on the target document from all its reviews. Call after any review create/delete. */
export async function recomputeRating(targetType: ReviewTargetType, targetId: Types.ObjectId | string) {
  const [agg] = await Review.aggregate([
    { $match: { targetType, targetId: new Types.ObjectId(targetId) } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  const Model = TARGET_MODEL[targetType];
  await Model.findByIdAndUpdate(targetId, {
    ratingAvg: agg ? Math.round(agg.avg * 10) / 10 : 0,
    ratingCount: agg ? agg.count : 0,
  });
}
