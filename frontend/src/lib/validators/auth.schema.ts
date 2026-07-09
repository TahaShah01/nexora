import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z.object({
  name: z.string().min(2, "Name is too short").max(80),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  role: z.enum(["buyer", "seller", "provider"]),
});
export type RegisterFormValues = z.infer<typeof registerFormSchema>;

