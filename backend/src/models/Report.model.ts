import { Schema, model, models, type Document, type Types } from "mongoose";

export type ReportReason = "spam" | "fraud" | "harassment" | "fake_listing" | "copyright" | "other";
export type ReportStatus = "pending" | "resolved" | "dismissed";
export type ReportTargetType = "product" | "service" | "user" | "review" | "message";

export interface IReport extends Document {
  reporter: Types.ObjectId;
  targetType: ReportTargetType;
  targetId: Types.ObjectId;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  adminNotes?: string;
  resolvedBy?: Types.ObjectId;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetType: {
      type: String,
      enum: ["product", "service", "user", "review", "message"],
      required: true,
    },
    targetId: { type: Schema.Types.ObjectId, required: true },
    reason: {
      type: String,
      enum: ["spam", "fraud", "harassment", "fake_listing", "copyright", "other"],
      required: true,
    },
    description: { type: String, maxlength: 1000 },
    status: {
      type: String,
      enum: ["pending", "resolved", "dismissed"],
      default: "pending",
    },
    adminNotes: { type: String, maxlength: 1000 },
    resolvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    resolvedAt: Date,
  },
  { timestamps: true }
);

reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ targetType: 1, targetId: 1 });
reportSchema.index({ reporter: 1, createdAt: -1 });

export const Report = models.Report || model<IReport>("Report", reportSchema);
