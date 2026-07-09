import { z } from "zod";

const packageSchema = z.object({
  name: z.string().min(1).max(60),
  price: z.coerce.number().positive(),
  deliveryDays: z.coerce.number().int().min(1),
  features: z.array(z.string().max(100)).max(10).optional().default([]),
});

export const createServiceSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(140),
    description: z.string().min(10).max(5000),
    category: z.string().min(1, "Category is required"),
    packages: z.array(packageSchema).min(1, "At least one package is required").max(5),
    images: z.array(z.string().url()).max(10).optional().default([]),
    location: z.string().max(120).optional(),
  }),
});

export const updateServiceSchema = z.object({
  body: createServiceSchema.shape.body.partial().extend({
    status: z.enum(["active", "draft"]).optional(),
  }),
});

export const listServicesQuerySchema = z.object({
  query: z.object({
    category: z.string().optional(),
    provider: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    location: z.string().optional(),
    minRating: z.coerce.number().min(0).max(5).optional(),
    maxDeliveryDays: z.coerce.number().int().positive().optional(),
    q: z.string().optional(),
    sort: z.enum(["newest", "price_asc", "price_desc", "rating"]).optional().default("newest"),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(12),
  }),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>["body"];
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>["body"];
export type ListServicesQuery = z.infer<typeof listServicesQuerySchema>["query"];
