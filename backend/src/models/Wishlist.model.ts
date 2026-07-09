import { Schema, model, models, type Document, type Types } from "mongoose";

export interface IWishlist extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  createdAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

export const Wishlist = models.Wishlist || model<IWishlist>("Wishlist", wishlistSchema);
