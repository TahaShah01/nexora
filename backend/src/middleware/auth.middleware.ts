import type { NextFunction, Request, Response } from "express";
import { ApiError } from "./errorHandler";
import { verifyAccessToken } from "../utils/jwt";
import type { UserRole } from "../models/User.model";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: string; role: UserRole };
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;
  if (!token) return next(new ApiError(401, "Not authenticated"));
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return next(new ApiError(401, "Session expired"));
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ApiError(401, "Not authenticated"));
    if (!roles.includes(req.user.role)) return next(new ApiError(403, "Forbidden"));
    next();
  };
}

/** Populates req.user if a valid access token is present, but never rejects anonymous requests. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;
  if (!token) return next();
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
  } catch {
    // Invalid/expired token on an optional route — treat as anonymous rather than failing.
  }
  next();
}
