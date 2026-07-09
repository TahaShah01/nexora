import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZES = { sm: "h-8 w-8 text-xs", md: "h-11 w-11 text-sm", lg: "h-16 w-16 text-lg", xl: "h-24 w-24 text-2xl" };

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: keyof typeof SIZES;
  className?: string;
  online?: boolean;
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function Avatar({ src, name, size = "md", className, online }: AvatarProps) {
  return (
    <span className={cn("relative inline-block shrink-0", SIZES[size], className)}>
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="96px"
          unoptimized={src.endsWith(".svg") || src.includes("dicebear.com")}
          className="rounded-full border border-border object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center rounded-full border border-border bg-primary/15 font-semibold text-primary">
          {initials(name)}
        </span>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
      )}
    </span>
  );
}
