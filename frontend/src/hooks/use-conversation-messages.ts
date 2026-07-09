"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { fetchMessages } from "@/lib/api/conversations.api";
import { getSocket } from "@/lib/socket";
import type { ChatMessage, MessageType } from "@/types/message";

export function useConversationMessages(conversationId: string | null, searchQuery?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [typingUserId, setTypingUserId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["messages", conversationId, searchQuery ?? ""],
    queryFn: () => fetchMessages(conversationId as string, searchQuery),
    enabled: !!conversationId && !!user,
  });

  useEffect(() => {
    if (!conversationId || !user) return;
    const socket = getSocket();

    socket.emit("conversation:join", conversationId);
    socket.emit("message:read", { conversationId });

    function onNew(message: ChatMessage & { conversationId: string }) {
      if (message.conversationId !== conversationId) return;
      queryClient.setQueryData<ChatMessage[]>(["messages", conversationId, searchQuery ?? ""], (prev) =>
        prev ? [...prev, message] : [message]
      );
      if (user && message.sender !== user.id) socket.emit("message:read", { conversationId });
    }

    function onTyping(payload: { conversationId: string; userId: string; isTyping: boolean }) {
      if (payload.conversationId !== conversationId || payload.userId === user?.id) return;
      setTypingUserId(payload.isTyping ? payload.userId : null);
    }

    function onRead(payload: { conversationId: string; readBy: string }) {
      if (payload.conversationId !== conversationId || payload.readBy === user?.id) return;
      queryClient.setQueryData<ChatMessage[]>(["messages", conversationId, searchQuery ?? ""], (prev) => {
        if (!prev) return prev;
        return prev.map((m) => {
          if (m.sender === user?.id && !m.readBy.includes(payload.readBy)) {
            return { ...m, readBy: [...m.readBy, payload.readBy] };
          }
          return m;
        });
      });
    }

    socket.on("message:new", onNew);
    socket.on("message:typing", onTyping);
    socket.on("message:read", onRead);
    return () => {
      socket.off("message:new", onNew);
      socket.off("message:typing", onTyping);
      socket.off("message:read", onRead);
    };
  }, [conversationId, user, queryClient, searchQuery]);

  function sendMessage(payload: { type: MessageType; content?: string; attachmentUrl?: string }) {
    if (!conversationId) return;
    getSocket().emit("message:send", { conversationId, ...payload });
  }

  function setTyping(isTyping: boolean) {
    if (!conversationId) return;
    getSocket().emit("message:typing", { conversationId, isTyping });
  }

  return { ...query, typingUserId, sendMessage, setTyping };
}
