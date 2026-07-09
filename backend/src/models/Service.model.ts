import { Schema, model, models, type Document, type Types } from "mongoose";

export type ServiceStatus = "active" | "draft";

export interface IServicePackage {
  name: string;
  price: number;
  deliveryDays: number;
  features: string[];
}

export interface IService extends Document {
  provider: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  category: Types.ObjectId;
  packages: IServicePackage[];
  startingPrice: number;
  images: string[];
  location?: string;
  ratingAvg: number;
  ratingCount: number;
  status: ServiceStatus;
  createdAt: Date;
  updatedAt: Date;
}

const servicePackageSchema = new Schema<IServicePackage>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    price: { type: Number, required: true, min: 0 },
    deliveryDays: { type: Number, required: true, min: 1 },
    features: { type: [String], default: [] },
  },
  { _id: false }
);

const serviceSchema = new Schema<IService>(
  {
    provider: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true, maxlength: 5000 },
    category: { type: Schema.Types.ObjectId, ref: "ServiceCategory", required: true },
    packages: {
      type: [servicePackageSchema],
      validate: {
        validator: (v: IServicePackage[]) => v.length > 0 && v.length <= 5,
        message: "A service needs between 1 and 5 packages",
      },
    },
    images: { type: [String], default: [] },
    location: String,
    startingPrice: { type: Number, default: 0 },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "draft"], default: "active" },
  },
  { timestamps: true }
);

serviceSchema.index({ title: "text", description: "text" });
serviceSchema.index({ category: 1 });
serviceSchema.index({ startingPrice: 1 });

// Denormalized for cheap sort/filter-by-price — packages don't have a single
// "the" price, so this is the min across packages, recomputed on every save.
serviceSchema.pre("save", function (next) {
  if (this.packages && this.packages.length > 0) {
    this.startingPrice = Math.min(...this.packages.map((p) => p.price));
  }
  next();
});

export const Service = models.Service || model<IService>("Service", serviceSchema);
