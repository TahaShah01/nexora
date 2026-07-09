import { ApiError } from "../middleware/errorHandler";
import { Conversation } from "../models/Conversation.model";
import { Message, type MessageType } from "../models/Message.model";
import { User } from "../models/User.model";
import { createNotification } from "./notification.service";

interface CreateMessageInput {
  conversationId: string;
  senderId: string;
  type?: MessageType;
  content?: string;
  attachmentUrl?: string;
}

/**
 * Shared by both the Socket.io handler (primary send path) and the REST
 * fallback endpoint, so there's exactly one place that knows how sending a
 * message updates a conversation's lastMessage/unreadCounts.
 */
export async function createMessage({
  conversationId,
  senderId,
  type = "text",
  content,
  attachmentUrl,
}: CreateMessageInput) {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation || !conversation.participants.some((p: any) => p.toString() === senderId)) {
    throw new ApiError(404, "Conversation not found");
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    type,
    content,
    attachmentUrl,
    readBy: [senderId],
  });

  const other = conversation.participants.find((p: any) => p.toString() !== senderId);
  conversation.lastMessage = message._id;
  conversation.lastMessageAt = new Date();
  if (other) {
    const key = other.toString();
    conversation.unreadCounts.set(key, (conversation.unreadCounts.get(key) ?? 0) + 1);
  }
  await conversation.save();

  const sender = await User.findById(senderId).select("name");
  if (other && sender) {
    await createNotification({
      recipient: other.toString(),
      type: "message",
      title: "New message",
      body: `${sender.name}: ${content ? content.slice(0, 80) : "sent an attachment"}`,
      targetUrl: `/dashboard/messages?c=${conversationId}`,
    });
  }

  return { message, participantIds: conversation.participants.map((p: any) => p.toString()) };
}
