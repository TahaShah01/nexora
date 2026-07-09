import crypto from "crypto";
import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../middleware/errorHandler";
import { type IUser, User } from "../models/User.model";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";
import { generateUniqueUsername } from "../utils/username";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function publicUser(user: IUser) {
  return {
    id: user._id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    avatarUrl: user.avatarUrl,
    verificationStatus: user.verificationStatus,
  };
}

async function issueSession(res: Response, user: IUser) {
  const accessToken = signAccessToken({ sub: user.id.toString(), role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id.toString() });

  user.refreshTokenHash = hashToken(refreshToken);
  user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) throw new ApiError(409, "An account with this email already exists");

    const passwordHash = await hashPassword(password);
    const username = await generateUniqueUsername(name);
    const user: IUser = await User.create({ name, email, passwordHash, role, username });

    await issueSession(res, user);
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user: IUser | null = await User.findOne({ email }).select("+passwordHash");
    if (!user) throw new ApiError(401, "Invalid email or password");

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) throw new ApiError(401, "Invalid email or password");

    await issueSession(res, user);
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        $unset: { refreshTokenHash: 1, refreshTokenExpiresAt: 1 },
      });
    }
    clearAuthCookies(res);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) throw new ApiError(401, "Not authenticated");

    const payload = verifyRefreshToken(token);
    const user: IUser | null = await User.findById(payload.sub).select(
      "+refreshTokenHash +refreshTokenExpiresAt"
    );
    if (!user || !user.refreshTokenHash) throw new ApiError(401, "Session expired");

    const matches = user.refreshTokenHash === hashToken(token);
    const notExpired = !!user.refreshTokenExpiresAt && user.refreshTokenExpiresAt > new Date();
    if (!matches || !notExpired) throw new ApiError(401, "Session expired");

    await issueSession(res, user); // rotation: new access + refresh pair issued
    res.json({ user: publicUser(user) });
  } catch (err) {
    clearAuthCookies(res);
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
    const user: IUser | null = await User.findById(req.user.id);
    if (!user) throw new ApiError(401, "Not authenticated");
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const user: IUser | null = await User.findById(req.user.id).select("+passwordHash");
    if (!user) throw new ApiError(404, "User not found");

    const valid = await comparePassword(req.body.currentPassword, user.passwordHash);
    if (!valid) throw new ApiError(401, "Current password is incorrect");

    user.passwordHash = await hashPassword(req.body.newPassword);
    await user.save();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
