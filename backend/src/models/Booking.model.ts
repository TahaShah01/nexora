import { Schema, model, models, type Document, type Types } from "mongoose";
import type { IServicePackage } from "./Service.model";

export type BookingStatus = "pending" | "accepted" | "declined" | "completed" | "cancelled";

export interface IBooking extends Document {
  service: Types.ObjectId;
  package: IServicePackage; // snapshot at booking time — price changes on the service shouldn't retroactively change a pending booking
  buyer: Types.ObjectId;
  provider: Types.ObjectId;
  status: BookingStatus;
  scheduledDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    package: {
      name: String,
      price: Number,
      deliveryDays: Number,
      features: [String],
    },
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "completed", "cancelled"],
      default: "pending",
    },
    scheduledDate: Date,
    notes: { type: String, maxlength: 1000 },
  },
  { timestamps: true }
);

bookingSchema.index({ buyer: 1, createdAt: -1 });
bookingSchema.index({ provider: 1, createdAt: -1 });

export const Booking = models.Booking || model<IBooking>("Booking", bookingSchema);
