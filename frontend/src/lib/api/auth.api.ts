import type { AuthUser } from "@/types/auth";
import type { LoginFormValues, RegisterFormValues } from "@/lib/validators/auth.schema";
import { apiClient } from "./client";

export async function registerRequest(payload: RegisterFormValues): Promise<AuthUser> {
  const { data } = await apiClient.post<{ user: AuthUser }>("/auth/register", payload);
  return data.user;
}

export async function loginRequest(payload: LoginFormValues): Promise<AuthUser> {
  const { data } = await apiClient.post<{ user: AuthUser }>("/auth/login", payload);
  return data.user;
}

export async function logoutRequest(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function changePasswordRequest(payload: { currentPassword: string; newPassword: string }): Promise<void> {
  await apiClient.patch("/auth/change-password", payload);
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data } = await apiClient.get<{ user: AuthUser }>("/auth/me");
    return data.user;
  } catch {
    return null; // not authenticated is a normal state, not an error
  }
}
