import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../middleware/errorHandler";
import { Follow } from "../models/Follow.model";
import { type IUser, User } from "../models/User.model";
import { Product } from "../models/Product.model";
import { Service } from "../models/Service.model";
import { Review } from "../models/Review.model";
import { createNotification } from "../services/notification.service";

function publicProfile(user: IUser, isFollowedByMe: boolean) {
  return {
    id: user._id,
    username: user.username,
    name: user.name,
    role: user.role,
    avatarUrl: user.avatarUrl,
    coverImageUrl: user.coverImageUrl,
    bio: user.bio,
    location: user.location,
    contact: user.contact,
    skills: user.skills,
    socialLinks: user.socialLinks,
    portfolioImages: user.portfolioImages,
    trustScore: user.trustScore,
    badges: user.badges,
    ratingAvg: user.ratingAvg,
    ratingCount: user.ratingCount,
    verificationStatus: user.verificationStatus,
    responseTimeMinutes: user.responseTimeMinutes,
    completionRate: user.completionRate,
    followerCount: user.followerCount,
    followingCount: user.followingCount,
    joinedAt: user.createdAt,
    isFollowedByMe,
  };
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) throw new ApiError(404, "User not found");

    let isFollowedByMe = false;
    if (req.user) {
      isFollowedByMe = Boolean(await Follow.exists({ follower: req.user.id, following: user._id }));
    }

    const [products, services, reviews] = await Promise.all([
      Product.find({ seller: user._id, status: "active" }).select("-description").limit(10),
      Service.find({ provider: user._id, status: "active" }).select("-description").limit(10),
      Review.find({ targetType: "user", targetId: user._id })
        .populate("author", "name avatarUrl username")
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    res.json({
      user: publicProfile(user, isFollowedByMe),
      products,
      services,
      reviews,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    if (!user) throw new ApiError(404, "User not found");
    res.json({ user: publicProfile(user, false) });
  } catch (err) {
    next(err);
  }
}

export async function followUser(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
    const target = await User.findOne({ username: req.params.username });
    if (!target) throw new ApiError(404, "User not found");
    if (target.id.toString() === req.user.id) throw new ApiError(400, "You can't follow yourself");

    const existing = await Follow.findOne({ follower: req.user.id, following: target._id });
    if (existing) {
      res.status(200).json({ following: true });
      return;
    }

    await Follow.create({ follower: req.user.id, following: target._id });
    await Promise.all([
      User.findByIdAndUpdate(req.user.id, { $inc: { followingCount: 1 } }),
      User.findByIdAndUpdate(target._id, { $inc: { followerCount: 1 } }),
    ]);

    const follower = await User.findById(req.user.id).select("name username");
    if (follower) {
      await createNotification({
        recipient: target.id.toString(),
        type: "follow",
        title: "New follower",
        body: `${follower.name} started following you`,
        targetUrl: `/profile/${follower.username}`,
      });
    }

    res.status(201).json({ following: true });
  } catch (err) {
    next(err);
  }
}

export async function unfollowUser(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
    const target = await User.findOne({ username: req.params.username });
    if (!target) throw new ApiError(404, "User not found");

    const deleted = await Follow.findOneAndDelete({ follower: req.user.id, following: target._id });
    if (deleted) {
      await Promise.all([
        User.findByIdAndUpdate(req.user.id, { $inc: { followingCount: -1 } }),
        User.findByIdAndUpdate(target._id, { $inc: { followerCount: -1 } }),
      ]);
    }

    res.status(200).json({ following: false });
  } catch (err) {
    next(err);
  }
}
