import { Schema, model, models, type Document, type Types } from "mongoose";

export interface IServiceCategory extends Document {
  name: string;
  slug: string;
  icon?: string;
  parent: Types.ObjectId | null;
  order: number;
}

const serviceCategorySchema = new Schema<IServiceCategory>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  icon: String,
  parent: { type: Schema.Types.ObjectId, ref: "ServiceCategory", default: null },
  order: { type: Number, default: 0 },
});

export const ServiceCategory =
  models.ServiceCategory || model<IServiceCategory>("ServiceCategory", serviceCategorySchema);
