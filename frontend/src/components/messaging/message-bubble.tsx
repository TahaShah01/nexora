import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";
import { memo } from "react";

import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/message";

function MessageBubbleImpl({ message, isMine }: { message: ChatMessage; isMine: boolean }) {
  return (
    <div className={cn("flex", isMine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-card px-3.5 py-2.5 text-sm",
          isMine ? "bg-primary text-ink" : "bg-elevated text-text-primary"
        )}
      >
        {message.type === "text" && <p className="whitespace-pre-wrap">{message.content}</p>}

        {message.type === "image" && message.attachmentUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote Cloudinary URLs in a chat bubble; optimization isn't worth the extra config here
          <a href={message.attachmentUrl} target="_blank" rel="noreferrer">
            <img src={message.attachmentUrl} alt="Attachment" className="max-h-64 rounded-input" />
          </a>
        )}

        {message.type === "file" && message.attachmentUrl && (
          <a href={message.attachmentUrl} target="_blank" rel="noreferrer" className="underline">
            Download file
          </a>
        )}

        {message.type === "voice" && message.attachmentUrl && (
          <audio controls src={message.attachmentUrl} className="max-w-full" />
        )}

        <div className={cn("mt-1 flex items-center gap-1", isMine ? "justify-end text-ink/70" : "justify-end text-text-muted")}>
          <p className="text-[10px]">{format(new Date(message.createdAt), "p")}</p>
          {isMine && (
            <span className="shrink-0" title={message.readBy && message.readBy.length > 0 ? "Read" : "Delivered"}>
              {message.readBy && message.readBy.length > 0 ? (
                <CheckCheck className="h-3 w-3 text-surface" />
              ) : (
                <CheckCheck className="h-3 w-3 opacity-60" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export const MessageBubble = memo(MessageBubbleImpl);
