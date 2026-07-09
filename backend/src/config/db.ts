import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(env.mongoUri);
    console.log("[db] MongoDB connected");
  } catch (err) {
    console.error("[db] MongoDB connection failed:", err);
    // Phase 0: don't crash the process so the scaffold is runnable without a
    // live cluster. Revisit (process.exit(1)) once Phase 1 makes the DB a
    // hard dependency.
  }
}
