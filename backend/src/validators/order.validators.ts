import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    product: z.string().min(1, "Product is required"),
    quantity: z.coerce.number().int().min(1).max(20).optional().default(1),
    shippingAddress: z.string().max(500).optional(),
    paymentMethod: z.enum(["cod", "online"]).optional(),
    paymentProofUrl: z.string().url().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(["confirmed", "shipped", "delivered", "cancelled", "refunded"]),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>["body"];
