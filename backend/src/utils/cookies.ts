import type { Response } from "express";
import { env } from "../config/env";

const isProd = env.nodeEnv === "production";

// maxAge values mirror JWT_ACCESS_EXPIRES_IN / JWT_REFRESH_EXPIRES_IN in
// .env.example (15m / 7d). Keep them in sync if those env vars change.
const ACCESS_MAX_AGE_MS = 15 * 60 * 1000;
const REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const baseCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/",
};

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie("accessToken", accessToken, { ...baseCookieOptions, maxAge: ACCESS_MAX_AGE_MS });
  res.cookie("refreshToken", refreshToken, { ...baseCookieOptions, maxAge: REFRESH_MAX_AGE_MS });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
}
