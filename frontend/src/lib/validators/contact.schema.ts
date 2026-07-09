import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(150, "Subject is too long"),
  category: z.string().min(1, "Please select a category"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message is too long"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
