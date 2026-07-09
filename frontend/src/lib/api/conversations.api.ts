import type { ChatMessage, ConversationSummary } from "@/types/message";
import { apiClient } from "./client";

export async function fetchConversations(): Promise<ConversationSummary[]> {
  const { data } = await apiClient.get<{ items: ConversationSummary[] }>("/conversations");
  return data.items;
}

export async function createOrGetConversation(username: string): Promise<string> {
  const { data } = await apiClient.post<{ id: string }>("/conversations", { username });
  return data.id;
}

export async function fetchMessages(conversationId: string, q?: string): Promise<ChatMessage[]> {
  const { data } = await apiClient.get<{ items: ChatMessage[] }>(`/conversations/${conversationId}/messages`, {
    params: q ? { q } : undefined,
  });
  return data.items;
}
