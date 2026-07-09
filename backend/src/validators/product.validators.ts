import { z } from "zod";

const conditionEnum = z.enum(["new", "like_new", "used", "refurbished"]);

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(140),
    description: z.string().min(10).max(5000),
    category: z.string().min(1, "Category is required"),
    price: z.coerce.number().positive(),
    compareAtPrice: z.coerce.number().positive().optional(),
    condition: conditionEnum.optional().default("new"),
    images: z.array(z.string().url()).min(1, "At least one image is required").max(10),
    location: z.string().max(120).optional(),
    stock: z.coerce.number().int().min(0).optional().default(1),
  }),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial().extend({
    status: z.enum(["active", "draft", "sold"]).optional(),
  }),
});

export const listProductsQuerySchema = z.object({
  query: z.object({
    category: z.string().optional(),
    seller: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    condition: conditionEnum.optional(),
    location: z.string().optional(),
    minRating: z.coerce.number().min(0).max(5).optional(),
    q: z.string().optional(),
    sort: z.enum(["newest", "price_asc", "price_desc", "rating"]).optional().default("newest"),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(12),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
export type UpdateProductInput = z.infer<typeof updateProductSchema>["body"];
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>["query"];
