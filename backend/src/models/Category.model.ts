import { Schema, model, models, type Document, type Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  icon?: string;
  parent: Types.ObjectId | null;
  order: number;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  icon: String,
  parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  order: { type: Number, default: 0 },
});

export const Category = models.Category || model<ICategory>("Category", categorySchema);
