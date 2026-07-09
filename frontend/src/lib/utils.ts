import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names safely (handles conditional classes + resolves
 * conflicting utility collisions). Used by every component in the design
 * system — do not duplicate this helper elsewhere.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
