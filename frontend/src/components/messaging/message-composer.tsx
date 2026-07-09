"use client";

import { Image as ImageIcon, Mic, Paperclip, Send, Square } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { uploadToCloudinary } from "@/lib/api/uploads.api";
import type { MessageType } from "@/types/message";

export function MessageComposer({
  onSend,
  onTyping,
}: {
  onSend: (payload: { type: MessageType; content?: string; attachmentUrl?: string }) => void;
  onTyping: (isTyping: boolean) => void;
}) {
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isRecording, start, stop } = useVoiceRecorder();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend({ type: "text", content: text.trim() });
    setText("");
    onTyping(false);
  }

  async function handleAttachment(file: File, type: "image" | "file") {
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, "nexora/messages", type === "image" ? "image" : "auto");
      onSend({ type, attachmentUrl: url });
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleVoiceToggle() {
    if (isRecording) {
      const file = await stop();
      setUploading(true);
      try {
        const url = await uploadToCloudinary(file, "nexora/messages", "auto");
        onSend({ type: "voice", attachmentUrl: url });
      } catch {
        toast.error("Upload failed");
      } finally {
        setUploading(false);
      }
      return;
    }
    try {
      await start();
    } catch {
      toast.error("Microphone access denied");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleAttachment(e.target.files[0], "image")}
      />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleAttachment(e.target.files[0], "file")}
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => imageInputRef.current?.click()}
        aria-label="Attach image"
        className="text-text-muted hover:text-primary disabled:opacity-50"
      >
        <ImageIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        aria-label="Attach file"
        className="text-text-muted hover:text-primary disabled:opacity-50"
      >
        <Paperclip className="h-5 w-5" />
      </button>
      <button
        type="button"
        disabled={uploading}
        onClick={handleVoiceToggle}
        aria-label={isRecording ? "Stop recording" : "Record voice message"}
        className={isRecording ? "text-danger" : "text-text-muted hover:text-primary disabled:opacity-50"}
      >
        {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </button>

      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onTyping(e.target.value.length > 0);
        }}
        onBlur={() => onTyping(false)}
        placeholder={isRecording ? "Recording..." : "Type a message..."}
        disabled={uploading || isRecording}
        className="h-10 flex-1 rounded-input border border-border bg-surface px-3 text-sm text-text-primary placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
      />

      <Button type="submit" size="sm" disabled={!text.trim() || uploading}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
