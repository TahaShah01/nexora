"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";
import {
  deleteAllNotifications,
  deleteNotification,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/notifications.api";
import { getSocket } from "@/lib/socket";

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(1, 50),
    enabled: !!user,
  });

  // Real-time: invalidate on new notification
  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });
    socket.on("notification:new", invalidate);
    return () => { socket.off("notification:new", invalidate); };
  }, [user, queryClient]);

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllRead = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const deleteOne = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const deleteAll = useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return { ...query, markRead, markAllRead, deleteOne, deleteAll };
}
