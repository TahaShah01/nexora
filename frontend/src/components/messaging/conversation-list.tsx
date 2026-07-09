import { formatDistanceToNowStrict } from "date-fns";

import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ConversationSummary } from "@/types/message";

function previewText(conv: ConversationSummary): string {
  if (!conv.lastMessage) return "No messages yet";
  if (conv.lastMessage.type === "text") return conv.lastMessage.content ?? "";
  if (conv.lastMessage.type === "voice") return "Sent a voice note";
  return conv.lastMessage.type === "image" ? "Sent an image" : "Sent a file";
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
}: {
  conversations: ConversationSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  if (conversations.length === 0) {
    return <p className="p-4 text-sm text-text-muted">No conversations yet.</p>;
  }

  return (
    <div className="divide-y divide-border overflow-y-auto">
      {conversations.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(c.id)}
          className={cn(
            "flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-elevated",
            activeId === c.id && "bg-elevated"
          )}
        >
          <Avatar
            src={c.participant?.avatarUrl}
            name={c.participant?.name ?? "Nexora user"}
            size="md"
            online={c.participant?.isOnline}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-medium text-text-primary">
                {c.participant?.name ?? "Unknown user"}
              </p>
              {c.lastMessage && (
                <span className="shrink-0 text-[11px] text-text-muted">
                  {formatDistanceToNowStrict(new Date(c.updatedAt))}
                </span>
              )}
            </div>
            <p className="truncate text-xs text-text-muted">{previewText(c)}</p>
          </div>
          {c.unreadCount > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-badge bg-primary px-1 text-[10px] font-semibold text-ink">
              {c.unreadCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
