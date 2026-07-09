import { Types } from "mongoose";

import { Booking } from "../models/Booking.model";
import { Order } from "../models/Order.model";
import { User } from "../models/User.model";

/**
 * Recomputes the unified Trust Score (0-100) for a user.
 * It considers:
 * - Profile completeness (Avatar, Bio, Skills)
 * - Verification status
 * - Average ratings
 * - Completed orders (as seller)
 * - Completed bookings (as provider)
 */
export async function recomputeTrustScore(userId: Types.ObjectId | string) {
  const user = await User.findById(userId);
  if (!user) return;

  let score = 0;

  // 1. Profile Completeness (Max 20)
  if (user.avatarUrl) score += 5;
  if (user.bio && user.bio.length > 10) score += 5;
  if (user.skills && user.skills.length > 0) score += 5;
  if (user.location) score += 5;

  // 2. Verification Status (Max 30)
  if (user.verificationStatus === "verified") {
    score += 30;
  } else if (user.verificationStatus === "pending") {
    score += 10;
  }

  // 3. Ratings (Max 30)
  // Maps 0-5 stars to 0-30 points (e.g., 5 stars = 30 points, 4 stars = 24 points)
  const ratingAvg = user.ratingAvg ?? 0;
  score += Math.round((ratingAvg / 5) * 30);

  // 4. Completed Transactions Activity (Max 20)
  const [completedOrders, completedBookings] = await Promise.all([
    Order.countDocuments({ seller: userId, status: "delivered" }),
    Booking.countDocuments({ provider: userId, status: "completed" }),
  ]);

  const totalTransactions = completedOrders + completedBookings;
  
  if (totalTransactions > 50) {
    score += 20;
  } else if (totalTransactions > 10) {
    score += 15;
  } else if (totalTransactions > 0) {
    score += 5;
  }

  // Final bounds check
  const finalScore = Math.min(100, Math.max(0, score));

  // Update user
  await User.findByIdAndUpdate(userId, { trustScore: finalScore });
}
