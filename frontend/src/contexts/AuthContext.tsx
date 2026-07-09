"use client";

import { createContext, useContext, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchCurrentUser, loginRequest, logoutRequest, registerRequest } from "@/lib/api/auth.api";
import { getErrorMessage } from "@/lib/api/client";
import type { LoginFormValues, RegisterFormValues } from "@/lib/validators/auth.schema";
import type { AuthUser } from "@/types/auth";

const AUTH_QUERY_KEY = ["auth", "me"] as const;

interface AuthContextValue {
  user: AuthUser | null | undefined;
  isLoading: boolean;
  login: (values: LoginFormValues) => Promise<AuthUser>;
  register: (values: RegisterFormValues) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (authUser) => queryClient.setQueryData(AUTH_QUERY_KEY, authUser),
    onError: (err) => toast.error(getErrorMessage(err, "Invalid email or password")),
  });

  const registerMutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (authUser) => queryClient.setQueryData(AUTH_QUERY_KEY, authUser),
    onError: (err) => toast.error(getErrorMessage(err, "Registration failed")),
  });

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => queryClient.setQueryData(AUTH_QUERY_KEY, null),
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: async (values) => {
        return await loginMutation.mutateAsync(values);
      },
      register: async (values) => {
        await registerMutation.mutateAsync(values);
      },
      logout: async () => {
        await logoutMutation.mutateAsync();
      },
    }),
    [user, isLoading, loginMutation, registerMutation, logoutMutation]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
