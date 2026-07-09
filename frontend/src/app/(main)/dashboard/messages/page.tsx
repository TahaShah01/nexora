"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { ConversationList } from "@/components/messaging/conversation-list";
import { MessageComposer } from "@/components/messaging/message-composer";
import { MessageThread } from "@/components/messaging/message-thread";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/contexts/AuthContext";
import { useConversationMessages } from "@/hooks/use-conversation-messages";
import { useConversations } from "@/hooks/use-conversations";
import { cn } from "@/lib/utils";

function MessagesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [activeId, setActiveId] = useState<string | null>(searchParams.get("c"));
  const [searchQuery, setSearchQuery] = useState("");

  const { data: conversations = [], isLoading: conversationsLoading } = useConversations();
  const { data: messages = [], isLoading: messagesLoading, typingUserId, sendMessage, setTyping } =
    useConversationMessages(activeId, searchQuery || undefined);

  const activeConversation = conversations.find((c) => c.id === activeId);

  return (
    <div className="flex h-[75vh] overflow-hidden rounded-card border border-border bg-card">
      <aside className={cn("w-full max-w-xs border-r border-border sm:block", activeId ? "hidden sm:block" : "block")}>
        <div className="border-b border-border p-4">
          <h1 className="text-lg font-semibold text-text-primary">Messages</h1>
        </div>
        {conversationsLoading ? (
          <p className="p-4 text-sm text-text-muted">Loading conversations...</p>
        ) : (
          <ConversationList conversations={conversations} activeId={activeId} onSelect={setActiveId} />
        )}
      </aside>

      <section className={`flex flex-1 flex-col ${activeId ? "flex" : "hidden sm:flex"}`}>
        {activeConversation ? (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-border p-4">
              <div>
                <p className="text-sm font-medium text-text-primary">{activeConversation.participant?.name}</p>
                <p className="text-xs text-text-muted">
                  {activeConversation.participant?.isOnline ? "Online" : "Offline"}
                </p>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in conversation"
                  className="h-8 w-44 rounded-input border border-border bg-surface pl-8 pr-2 text-xs text-text-primary placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <MessageThread
              messages={messages}
              isLoading={messagesLoading}
              currentUserId={user?.id ?? ""}
              isTyping={typingUserId === activeConversation.participant?.id}
              typingName={activeConversation.participant?.name}
            />

            <MessageComposer onSend={sendMessage} onTyping={setTyping} />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8">
            <EmptyState title="Select a conversation" description="Choose a conversation from the list to start chatting." />
          </div>
        )}
      </section>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="h-[75vh]" />}>
      <MessagesContent />
    </Suspense>
  );
}
