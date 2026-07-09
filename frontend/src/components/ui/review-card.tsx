import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ShieldCheck, Trash2 } from "lucide-react";
import { Avatar } from "./avatar";
import { Rating } from "./rating";
import { useAuth } from "@/contexts/AuthContext";

export interface ReviewCardProps {
  id?: string;
  authorId?: string;
  authorName: string;
  authorUsername?: string;
  authorAvatarUrl?: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

export function ReviewCard({
  id,
  authorId,
  authorName,
  authorUsername,
  authorAvatarUrl,
  rating,
  comment,
  createdAt,
  onDelete,
  isDeleting,
}: ReviewCardProps) {
  const { user } = useAuth();
  const isAuthor = user?.id === authorId;

  return (
    <div className="group flex gap-4 border-b border-border py-5 last:border-0 relative">
      {authorUsername ? (
        <Link href={`/profile/${authorUsername}`} className="shrink-0">
          <Avatar src={authorAvatarUrl} name={authorName} size="md" className="hover:opacity-80 transition-opacity" />
        </Link>
      ) : (
        <Avatar src={authorAvatarUrl} name={authorName} size="md" className="shrink-0" />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              {authorUsername ? (
                <Link href={`/profile/${authorUsername}`} className="text-sm font-semibold text-text-primary hover:text-primary hover:underline line-clamp-1">
                  {authorName}
                </Link>
              ) : (
                <p className="text-sm font-semibold text-text-primary line-clamp-1">{authorName}</p>
              )}
              <span className="flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm shrink-0">
                <ShieldCheck className="h-3 w-3" /> Verified Purchase
              </span>
            </div>
            <Rating value={rating} size="sm" className="mt-1" />
          </div>
          <span className="text-xs text-text-muted shrink-0 mt-0.5">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="mt-2.5 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{comment}</p>
      </div>

      {isAuthor && onDelete && id && (
        <button
          type="button"
          onClick={() => onDelete(id)}
          disabled={isDeleting}
          className="absolute right-0 top-5 p-1.5 text-text-muted opacity-0 hover:text-danger hover:bg-danger/10 rounded transition-all group-hover:opacity-100 disabled:opacity-50"
          title="Delete your review"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
