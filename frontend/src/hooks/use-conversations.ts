"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { createOrGetConversation, fetchConversations } from "@/lib/api/conversations.api";
import { getSocket } from "@/lib/socket";

export function useConversations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["conversations"] });
    socket.on("message:new", invalidate);
    socket.on("message:read", invalidate);
    return () => {
      socket.off("message:new", invalidate);
      socket.off("message:read", invalidate);
    };
  }, [user, queryClient]);

  return query;
}

/** Total unread across every conversation — feeds the Navbar's Messages badge. */
export function useUnreadMessageCount(): number {
  const { data } = useConversations();
  return data?.reduce((sum, c) => sum + c.unreadCount, 0) ?? 0;
}

export function useStartConversation() {
  return useMutation({ mutationFn: (username: string) => createOrGetConversation(username) });
}
