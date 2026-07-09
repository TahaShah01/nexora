import { Schema, model, models, type Document, type Types } from "mongoose";

export type ProductCondition = "new" | "like_new" | "used" | "refurbished";
export type ProductStatus = "active" | "draft" | "sold";

export interface IProduct extends Document {
  seller: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  category: Types.ObjectId;
  price: number;
  compareAtPrice?: number;
  condition: ProductCondition;
  images: string[];
  location?: string;
  stock: number;
  ratingAvg: number;
  ratingCount: number;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true, maxlength: 5000 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    condition: {
      type: String,
      enum: ["new", "like_new", "used", "refurbished"],
      default: "new",
    },
    images: { type: [String], default: [] },
    location: String,
    stock: { type: Number, default: 1, min: 0 },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "draft", "sold"], default: "active" },
  },
  { timestamps: true }
);

// Text index powers the `q` search param; compound index speeds up the
// category+price filter combination used by the listing page.
productSchema.index({ title: "text", description: "text" });
productSchema.index({ category: 1, price: 1 });

export const Product = models.Product || model<IProduct>("Product", productSchema);
