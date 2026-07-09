import { z } from "zod";

export const profileEditFormSchema = z.object({
  name: z.string().min(2, "Name is too short").max(80),
  bio: z.string().max(500, "Keep it under 500 characters").optional().or(z.literal("")),
  location: z.string().max(120).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  skills: z.string().max(300).optional().or(z.literal("")), // comma-separated in the form, split on submit
  website: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
});
export type ProfileEditFormValues = z.infer<typeof profileEditFormSchema>;
