import { ApiError } from "../middleware/errorHandler";

export function slugify(input: string, maxLen = 60): string {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, maxLen);
  return slug || "item";
}

/** Generic unique-slug generator, shared by usernames, products, and (later) services. */
export async function ensureUniqueSlug(
  exists: (candidate: string) => Promise<boolean>,
  base: string,
  maxLen = 60
): Promise<string> {
  const root = slugify(base, maxLen);
  let candidate = root;
  let attempts = 0;

  while (await exists(candidate)) {
    attempts += 1;
    if (attempts > 10) throw new ApiError(500, "Could not generate a unique slug");
    candidate = `${root}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  return candidate;
}
