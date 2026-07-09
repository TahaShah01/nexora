import { z } from "zod";

export const createBookingSchema = z.object({
  body: z.object({
    service: z.string().min(1, "Service is required"),
    packageName: z.string().min(1, "Package is required"),
    scheduledDate: z.coerce.date().optional(),
    notes: z.string().max(1000).optional(),
  }),
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(["accepted", "declined", "completed", "cancelled"]),
  }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>["body"];
