import { z } from "zod";

const slotSchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM"),
});

export const updateAvailabilitySchema = z.object({
  body: z.object({
    recurringSlots: z.array(slotSchema).max(21).optional(),
    blockedDates: z.array(z.coerce.date()).max(200).optional(),
  }),
});

export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>["body"];
