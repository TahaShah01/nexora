import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../middleware/errorHandler";
import { Conversation } from "../models/Conversation.model";
import { Message } from "../models/Message.model";
import { User } from "../models/User.model";
import { createMessage } from "../services/message.service";
import { isOnline } from "../sockets/presence";

interface PopulatedParticipant {
  _id: { toString(): string };
  name: string;
  username: string;
  avatarUrl?: string;
}

export async function listConversations(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
    const userId = req.user.id;

    const conversations = await Conversation.find({ participants: userId })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .populate("participants", "name username avatarUrl")
      .populate("lastMessage");

    const items = conversations.map((c) => {
      const participants = c.participants as unknown as PopulatedParticipant[];
      const other = participants.find((p) => p._id.toString() !== userId);

      return {
        id: c._id,
        participant: other
          ? {
              id: other._id,
              name: other.name,
              username: other.username,
              avatarUrl: other.avatarUrl,
              isOnline: isOnline(other._id.toString()),
            }
          : null,
        lastMessage: c.lastMessage,
        unreadCount: c.unreadCounts.get(userId) ?? 0,
        updatedAt: c.lastMessageAt ?? c.updatedAt,
      };
    });

    res.json({ items });
  } catch (err) {
    next(err);
  }
}

export async function createOrGetConversation(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const otherUser = await User.findOne({ username: req.body.username });
    if (!otherUser) throw new ApiError(404, "User not found");
    if (otherUser.id.toString() === req.user.id) throw new ApiError(400, "You can't message yourself");

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, otherUser._id], $size: 2 },
    });

    if (!conversation) {
      conversation = await Conversation.create({ participants: [req.user.id, otherUser._id] });
    }

    res.status(200).json({ id: conversation._id });
  } catch (err) {
    next(err);
  }
}

export async function listMessages(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation || !conversation.participants.some((p: any) => p.toString() === req.user!.id)) {
      throw new ApiError(404, "Conversation not found");
    }

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 30);
    const q = typeof req.query.q === "string" ? req.query.q : undefined;

    const filter: Record<string, unknown> = { conversation: conversation._id };
    if (q) filter.$text = { $search: q };

    const [items, total] = await Promise.all([
      Message.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Message.countDocuments(filter),
    ]);

    res.json({ items: items.reverse(), page, totalPages: Math.max(1, Math.ceil(total / limit)), total });
  } catch (err) {
    next(err);
  }
}

/** REST fallback for sending — the primary path is the `message:send` socket event. */
export async function sendMessageRest(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const { message } = await createMessage({
      conversationId: req.params.id,
      senderId: req.user.id,
      type: req.body.type,
      content: req.body.content,
      attachmentUrl: req.body.attachmentUrl,
    });

    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
}
