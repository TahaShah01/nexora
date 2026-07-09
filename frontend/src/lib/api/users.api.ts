import type { PublicProfile } from "@/types/user";
import { apiClient } from "./client";

export async function fetchProfile(username: string): Promise<{ user: PublicProfile; products: any[]; services: any[]; reviews: any[] }> {
  const { data } = await apiClient.get<{ user: PublicProfile; products: any[]; services: any[]; reviews: any[] }>(`/users/${username}`);
  return data;
}

export async function updateProfile(payload: Record<string, unknown>): Promise<PublicProfile> {
  const { data } = await apiClient.patch<{ user: PublicProfile }>("/users/me", payload);
  return data.user;
}

export async function followUser(username: string): Promise<void> {
  await apiClient.post(`/users/${username}/follow`);
}

export async function unfollowUser(username: string): Promise<void> {
  await apiClient.delete(`/users/${username}/follow`);
}
