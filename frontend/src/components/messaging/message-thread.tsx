"use client";

import { useEffect, useRef } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import type { ChatMessage } from "@/types/message";

import { MessageBubble } from "./message-bubble";

export function MessageThread({
  messages,
  isLoading,
  currentUserId,
  isTyping,
  typingName,
}: {
  messages: ChatMessage[];
  isLoading: boolean;
  currentUserId: string;
  isTyping: boolean;
  typingName?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll only within the container, not the full page
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages.length, isTyping]);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className={`h-12 w-1/2 rounded-card ${i % 2 ? "ml-auto" : ""}`} />
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-sm text-text-muted">
        No messages yet — say hello.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 space-y-2 overflow-y-auto p-4">
      {messages.map((m) => (
        <MessageBubble key={m._id} message={m} isMine={m.sender === currentUserId} />
      ))}
      {isTyping && (
        <p className="text-xs italic text-text-muted">{typingName ?? "They"} are typing...</p>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
