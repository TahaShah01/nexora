"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/api/client";
import { followUser, unfollowUser } from "@/lib/api/users.api";
import type { PublicProfile } from "@/types/user";

export function useFollowMutation(username: string) {
  const queryClient = useQueryClient();

  function patchFollowState(followed: boolean, followerDelta: number) {
    queryClient.setQueryData<PublicProfile>(["profile", username], (old) =>
      old ? { ...old, isFollowedByMe: followed, followerCount: old.followerCount + followerDelta } : old
    );
  }

  const follow = useMutation({
    mutationFn: () => followUser(username),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["profile", username] });
      patchFollowState(true, 1);
    },
    onError: (err) => {
      patchFollowState(false, -1);
      toast.error(getErrorMessage(err, "Couldn't follow this user"));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["profile", username] }),
  });

  const unfollow = useMutation({
    mutationFn: () => unfollowUser(username),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["profile", username] });
      patchFollowState(false, -1);
    },
    onError: (err) => {
      patchFollowState(true, 1);
      toast.error(getErrorMessage(err, "Couldn't unfollow this user"));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["profile", username] }),
  });

  return { follow, unfollow };
}
