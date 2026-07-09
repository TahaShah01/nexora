import { Schema, model, models, type Document, type Types } from "mongoose";

export type NotificationType = "message" | "order" | "review" | "favorite" | "system" | "payment" | "follow";

export interface INotification extends Document {
  recipient: Types.ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  targetUrl: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["message", "order", "review", "favorite", "system", "payment", "follow"],
      required: true,
    },
    title: { type: String, required: true, maxlength: 140 },
    body: { type: String, required: true, maxlength: 500 },
    targetUrl: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export const Notification = models.Notification || model<INotification>("Notification", notificationSchema);
