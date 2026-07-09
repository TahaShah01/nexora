"use client";

import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useStartConversation } from "@/hooks/use-conversations";

export function MessageButton({
  username,
  label = "Message",
  variant = "outline",
  size = "sm",
}: {
  username: string;
  label?: string;
} & Pick<ButtonProps, "variant" | "size">) {
  const { user } = useAuth();
  const router = useRouter();
  const startConversation = useStartConversation();

  function handleClick() {
    if (!user) {
      router.push("/login");
      return;
    }
    startConversation.mutate(username, {
      onSuccess: (id) => router.push(`/dashboard/messages?c=${id}`),
    });
  }

  if (user?.username === username) return null;

  return (
    <Button
      variant={variant}
      size={size}
      type="button"
      onClick={handleClick}
      isLoading={startConversation.isPending}
    >
      <MessageCircle className="h-4 w-4" /> {label}
    </Button>
  );
}
