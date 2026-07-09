import { z } from "zod";

export const sendMessageSchema = z.object({
  body: z
    .object({
      type: z.enum(["text", "image", "file", "voice"]).optional().default("text"),
      content: z.string().max(4000).optional(),
      attachmentUrl: z.string().url().optional(),
    })
    .refine((data) => Boolean(data.content || data.attachmentUrl), {
      message: "A message needs text content or an attachment",
      path: ["content"],
    }),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>["body"];
