import { User } from "../models/User.model";
import { ensureUniqueSlug } from "./slug";

/** Derives a URL-safe, unique username from a display name at registration time. */
export async function generateUniqueUsername(name: string): Promise<string> {
  return ensureUniqueSlug((candidate) => User.exists({ username: candidate }).then(Boolean), name, 30);
}
