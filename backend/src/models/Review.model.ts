import { Schema, model, models, type Document, type Types } from "mongoose";

export type ReviewTargetType = "product" | "service" | "user";

export interface IReview extends Document {
  author: Types.ObjectId;
  targetType: ReviewTargetType;
  targetId: Types.ObjectId;
  order?: Types.ObjectId;
  booking?: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetType: { type: String, enum: ["product", "service", "user"], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

reviewSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });
// Prevents spamming duplicate reviews for the exact same transaction.
reviewSchema.index({ author: 1, targetType: 1, targetId: 1, order: 1, booking: 1 }, { unique: true });

export const Review = models.Review || model<IReview>("Review", reviewSchema);
