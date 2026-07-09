import { Schema, model, models, type Document, type Types } from "mongoose";

export type MessageType = "text" | "image" | "file" | "voice";

export interface IMessage extends Document {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  type: MessageType;
  content?: string;
  attachmentUrl?: string;
  readBy: Types.ObjectId[];
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["text", "image", "file", "voice"], default: "text" },
    content: { type: String, maxlength: 4000 },
    attachmentUrl: String,
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ content: "text" }); // powers in-conversation search

export const Message = models.Message || model<IMessage>("Message", messageSchema);
