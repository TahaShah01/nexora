import { Schema, model, models, type Document, type Types } from "mongoose";

export type ActivityAction =
  | "auth:login"
  | "auth:logout"
  | "profile:update"
  | "listing:create"
  | "listing:update"
  | "listing:delete"
  | "order:create"
  | "order:update"
  | "booking:create"
  | "booking:update"
  | "review:create"
  | "review:update"
  | "review:delete"
  | "message:send"
  | "admin:suspend_user"
  | "admin:activate_user"
  | "admin:delete_user"
  | "admin:update_role"
  | "admin:approve_listing"
  | "admin:remove_listing"
  | "admin:remove_review"
  | "admin:create_category"
  | "admin:update_category"
  | "admin:delete_category"
  | "admin:moderate_report"
  | "admin:update_verification";

export interface IActivityLog extends Document {
  actor: Types.ObjectId; // User performing the action
  action: ActivityAction;
  targetModel?: "User" | "Product" | "Service" | "Order" | "Booking" | "Review" | "Category" | "ServiceCategory" | "Report";
  targetId?: Types.ObjectId; // ID of the entity affected
  previousValue?: any; // E.g., { status: "active" }
  newValue?: any; // E.g., { status: "suspended" }
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    actor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    targetModel: { type: String },
    targetId: { type: Schema.Types.ObjectId },
    previousValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // Logs are immutable, no updates
);

activityLogSchema.index({ actor: 1, createdAt: -1 });
activityLogSchema.index({ targetModel: 1, targetId: 1 });
activityLogSchema.index({ action: 1, createdAt: -1 });

export const ActivityLog = models.ActivityLog || model<IActivityLog>("ActivityLog", activityLogSchema);
