import { Schema, model, models, type Document, type Types } from "mongoose";

export interface IRecurringSlot {
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
}

export interface IAvailability extends Document {
  provider: Types.ObjectId;
  recurringSlots: IRecurringSlot[];
  blockedDates: Date[];
}

const recurringSlotSchema = new Schema<IRecurringSlot>(
  {
    dayOfWeek: { type: Number, min: 0, max: 6, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false }
);

const availabilitySchema = new Schema<IAvailability>({
  provider: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  recurringSlots: { type: [recurringSlotSchema], default: [] },
  blockedDates: { type: [Date], default: [] },
});

export const Availability = models.Availability || model<IAvailability>("Availability", availabilitySchema);
