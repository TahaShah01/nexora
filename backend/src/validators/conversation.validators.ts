import { z } from "zod";

export const createConversationSchema = z.object({
  body: z.object({
    username: z.string().min(1, "username is required"),
  }),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>["body"];
