import { Schema, model, models, type Document } from "mongoose";

export type UserRole = "buyer" | "seller" | "provider" | "admin";
export type VerificationStatus = "unverified" | "pending" | "verified";
export type AccountStatus = "active" | "suspended" | "deleted";

export interface IUser extends Document {
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  name: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  location?: string;
  contact?: { phone?: string; email?: string };
  skills: string[];
  socialLinks: { platform: string; url: string }[];
  portfolioImages: string[];
  trustScore: number;
  badges: string[];
  ratingAvg: number;
  ratingCount: number;
  verificationStatus: VerificationStatus;
  accountStatus: AccountStatus;
  responseTimeMinutes?: number;
  completionRate?: number;
  followerCount: number;
  followingCount: number;
  lastSeenAt?: Date;
  refreshTokenHash?: string;
  refreshTokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Only auth-relevant + Phase-3-stub fields are populated on write today.
// Profile fields (bio, skills, portfolio, trustScore, badges…) are defined
// now so the schema doesn't change shape later, but stay empty until
// Phase 3 (User Profiles) builds the edit flow.
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["buyer", "seller", "provider", "admin"], default: "buyer" },
    name: { type: String, required: true, trim: true },
    avatarUrl: String,
    coverImageUrl: String,
    bio: String,
    location: String,
    contact: {
      phone: String,
      email: String,
    },
    skills: { type: [String], default: [] },
    socialLinks: {
      type: [{ platform: String, url: String, _id: false }],
      default: [],
    },
    portfolioImages: { type: [String], default: [] },
    trustScore: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified"],
      default: "unverified",
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },
    responseTimeMinutes: Number,
    completionRate: Number,
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    lastSeenAt: Date,
    refreshTokenHash: { type: String, select: false },
    refreshTokenExpiresAt: { type: Date, select: false },
  },
  { timestamps: true }
);

// `models.User ||` guards against OverwriteModelError under ts-node-dev hot reload.
export const User = models.User || model<IUser>("User", userSchema);
