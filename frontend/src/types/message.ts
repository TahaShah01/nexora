export type MessageType = "text" | "image" | "file" | "voice";

export interface ChatMessage {
  _id: string;
  conversation: string;
  sender: string;
  type: MessageType;
  content?: string;
  attachmentUrl?: string;
  readBy: string[];
  createdAt: string;
}

export interface ConversationParticipant {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  isOnline: boolean;
}

export interface ConversationSummary {
  id: string;
  participant: ConversationParticipant | null;
  lastMessage: ChatMessage | null;
  unreadCount: number;
  updatedAt: string;
}
