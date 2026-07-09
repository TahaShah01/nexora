import type { UserRole, VerificationStatus } from "./auth";

export interface SocialLink {
  platform: string;
  url: string;
}

export interface PublicProfile {
  id: string;
  _id?: string;
  username: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  location?: string;
  contact?: { phone?: string; email?: string };
  skills: string[];
  socialLinks: SocialLink[];
  portfolioImages: string[];
  trustScore: number;
  badges: string[];
  ratingAvg: number;
  ratingCount: number;
  verificationStatus: VerificationStatus;
  responseTimeMinutes?: number;
  completionRate?: number;
  followerCount: number;
  followingCount: number;
  joinedAt: string;
  isFollowedByMe: boolean;
}
