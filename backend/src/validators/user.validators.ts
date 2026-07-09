import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80).optional(),
    bio: z.string().max(500).optional(),
    location: z.string().max(120).optional(),
    avatarUrl: z.string().url().optional(),
    coverImageUrl: z.string().url().optional(),
    contact: z
      .object({
        phone: z.string().max(30).optional(),
        email: z.string().email().optional(),
      })
      .optional(),
    skills: z.array(z.string().max(40)).max(20).optional(),
    socialLinks: z
      .array(z.object({ platform: z.string().max(20), url: z.string().url() }))
      .max(10)
      .optional(),
    portfolioImages: z.array(z.string().url()).max(20).optional(),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"];
