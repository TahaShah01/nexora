import { Schema, model, models, type Document, type Types } from "mongoose";

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  lastMessageAt?: Date;
  unreadCounts: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    lastMessageAt: Date,
    unreadCounts: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

// 1:1 conversations only (no group chats in the SRS) — this index makes
// "find the conversation between these two users" cheap.
conversationSchema.index({ participants: 1 });

export const Conversation = models.Conversation || model<IConversation>("Conversation", conversationSchema);
