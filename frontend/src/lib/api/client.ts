import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
  withCredentials: true, // required so the HTTP-only auth cookies are sent
});

/** Extract a readable message from a backend error response (see errorHandler.ts). */
export function getErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as { error?: string } | undefined)?.error ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
