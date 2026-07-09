import type { Types } from "mongoose";
import { ActivityLog, type ActivityAction } from "../models/ActivityLog.model";

interface LogActivityParams {
  actor: Types.ObjectId | string;
  action: ActivityAction;
  targetModel?: "User" | "Product" | "Service" | "Order" | "Booking" | "Review" | "Category" | "ServiceCategory" | "Report";
  targetId?: Types.ObjectId | string;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
}

export async function logActivity({
  actor,
  action,
  targetModel,
  targetId,
  previousValue,
  newValue,
  ipAddress,
  userAgent,
}: LogActivityParams) {
  try {
    await ActivityLog.create({
      actor,
      action,
      targetModel,
      targetId,
      previousValue,
      newValue,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    // We log but do not throw, as we don't want a failed audit log to break the main transaction
    console.error("Failed to write activity log:", error);
  }
}
