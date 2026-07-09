import { z } from "zod";

export const createReviewSchema = z.object({
  body: z
    .object({
      targetType: z.enum(["product", "service", "user"]),
      targetId: z.string().min(1),
      order: z.string().optional(),
      booking: z.string().optional(),
      rating: z.coerce.number().int().min(1).max(5),
      comment: z.string().min(3).max(1000),
    })
    .refine((data) => Boolean(data.order || data.booking), {
      message: "A review must reference the order or booking it's based on",
      path: ["order"],
    }),
});

export const listReviewsQuerySchema = z.object({
  query: z.object({
    targetType: z.enum(["product", "service", "user"]),
    targetId: z.string().min(1),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>["body"];
export type ListReviewsQuery = z.infer<typeof listReviewsQuerySchema>["query"];
