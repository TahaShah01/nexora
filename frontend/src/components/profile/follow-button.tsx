"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useFollowMutation } from "@/hooks/use-follow";
import type { PublicProfile } from "@/types/user";

export function FollowButton({ profile }: { profile: PublicProfile }) {
  const { user } = useAuth();
  const { follow, unfollow } = useFollowMutation(profile.username);

  if (!user || user.username === profile.username) return null;

  const isPending = follow.isPending || unfollow.isPending;

  return (
    <Button
      variant={profile.isFollowedByMe ? "outline" : "primary"}
      isLoading={isPending}
      onClick={() => (profile.isFollowedByMe ? unfollow.mutate() : follow.mutate())}
    >
      {profile.isFollowedByMe ? "Following" : "Follow"}
    </Button>
  );
}
