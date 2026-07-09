export type UserRole = "buyer" | "seller" | "provider" | "admin";
export type VerificationStatus = "unverified" | "pending" | "verified";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  verificationStatus: VerificationStatus;
}
