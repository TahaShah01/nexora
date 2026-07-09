import type { Server, Socket } from "socket.io";

import { Conversation } from "../models/Conversation.model";
import { Message } from "../models/Message.model";
import { createMessage } from "../services/message.service";
import { authenticateSocket } from "./auth";
import { markOffline, markOnline } from "./presence";

interface SendMessagePayload {
  conversationId: string;
  type?: "text" | "image" | "file" | "voice";
  content?: string;
  attachmentUrl?: string;
}

export function registerMessagingSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    const authed = authenticateSocket(socket);
    if (!authed) {
      socket.disconnect();
      return;
    }

    const userId = authed.id;
    socket.join(`user:${userId}`);
    markOnline(userId, socket.id);

    socket.on("message:send", async (payload: SendMessagePayload, ack?: (res: unknown) => void) => {
      try {
        const { message, participantIds } = await createMessage({
          conversationId: payload.conversationId,
          senderId: userId,
          type: payload.type,
          content: payload.content,
          attachmentUrl: payload.attachmentUrl,
        });

        const out = { ...message.toObject(), conversationId: payload.conversationId };
        participantIds.forEach((id: string) => io.to(`user:${id}`).emit("message:new", out));
        ack?.({ message: out });
      } catch {
        ack?.({ error: "Could not send message" });
      }
    });

    socket.on("conversation:join", (conversationId: string) => {
      socket.join(`conversation-typing:${conversationId}`);
    });

    socket.on("message:typing", (payload: { conversationId: string; isTyping: boolean }) => {
      socket.broadcast
        .to(`conversation-typing:${payload.conversationId}`)
        .emit("message:typing", { conversationId: payload.conversationId, userId, isTyping: payload.isTyping });
    });

    socket.on("message:read", async (payload: { conversationId: string }) => {
      try {
        const conversation = await Conversation.findById(payload.conversationId);
        if (!conversation) return;

        conversation.unreadCounts.set(userId, 0);
        await conversation.save();
        await Message.updateMany(
          { conversation: payload.conversationId, sender: { $ne: userId } },
          { $addToSet: { readBy: userId } }
        );

        const other = conversation.participants.find((p: any) => p.toString() !== userId);
        if (other) {
          io.to(`user:${other.toString()}`).emit("message:read", {
            conversationId: payload.conversationId,
            readBy: userId,
          });
        }
      } catch {
        // Best-effort — a missed read receipt isn't worth crashing the socket over.
      }
    });

    socket.on("disconnect", () => {
      markOffline(userId, socket.id);
    });
  });
}
