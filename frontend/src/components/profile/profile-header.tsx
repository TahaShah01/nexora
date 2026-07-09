"use client";

import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, MapPin, Shield } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageButton } from "@/components/shared/message-button";
import type { PublicProfile } from "@/types/user";

import { FollowButton } from "./follow-button";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-input border border-border bg-surface p-3 text-center">
      <p className="text-lg font-semibold text-text-primary">{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  );
}

export function ProfileHeader({ profile }: { profile: PublicProfile }) {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-card">
      <div
        className="h-40 w-full bg-elevated sm:h-56"
        style={
          profile.coverImageUrl
            ? { backgroundImage: `url(${profile.coverImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
            : undefined
        }
      />
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <span className="-mt-16 rounded-full border-4 border-card">
              <Avatar src={profile.avatarUrl} name={profile.name} size="xl" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-semibold text-text-primary">{profile.name}</h1>
                {profile.verificationStatus === "verified" && (
                  <CheckCircle2 className="h-4 w-4 text-primary" aria-label="Verified" />
                )}
                {profile.trustScore > 0 && (
                  <span className="flex items-center gap-1 rounded-badge bg-elevated px-2 py-0.5 text-xs font-medium text-text-secondary border border-border">
                    <Shield className="h-3 w-3 text-primary" />
                    {profile.trustScore}
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary">@{profile.username}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <MessageButton username={profile.username} />
            <FollowButton profile={profile} />
          </div>
        </div>

        {profile.bio && <p className="mt-4 max-w-2xl text-sm text-text-secondary">{profile.bio}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-text-muted">
          {profile.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {profile.location}
            </span>
          )}
          <span>Member since {formatDistanceToNow(new Date(profile.joinedAt), { addSuffix: true })}</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          <Stat label="Rating" value={profile.ratingCount > 0 ? `${profile.ratingAvg.toFixed(1)} ★` : "—"} />
          <Stat label="Trust Score" value={profile.trustScore} />
          <Stat label="Followers" value={profile.followerCount} />
          <Stat label="Following" value={profile.followingCount} />
          <Stat
            label="Completion Rate"
            value={profile.completionRate != null ? `${profile.completionRate}%` : "—"}
          />
          <Stat
            label="Response Time"
            value={profile.responseTimeMinutes != null ? `${profile.responseTimeMinutes}m` : "—"}
          />
        </div>

        {profile.badges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.badges.map((badge) => (
              <Badge key={badge} variant="primary">
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
