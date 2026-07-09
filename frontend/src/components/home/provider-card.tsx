import Link from "next/link";
import { Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { PublicProfile } from "@/types/user";

export function ProviderCard({ provider }: { provider: PublicProfile }) {
  return (
    <Link href={`/profile/${provider.username}`}>
      <div className="group flex flex-col items-center justify-center p-6 bg-card border border-border rounded-card hover:border-primary/30 transition-colors text-center h-full">
        <Avatar src={provider.avatarUrl} name={provider.name} size="xl" className="mb-4" />
        <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
          {provider.name}
        </h3>
        <p className="text-sm text-text-muted mb-2">@{provider.username}</p>
        
        {provider.ratingCount > 0 ? (
          <div className="flex items-center gap-1 text-sm font-medium text-warning mb-3">
            <Star className="h-4 w-4 fill-warning" />
            <span>{provider.ratingAvg.toFixed(1)}</span>
            <span className="text-text-muted">({provider.ratingCount})</span>
          </div>
        ) : (
          <div className="text-sm text-text-muted mb-3">No ratings yet</div>
        )}

        {provider.skills && provider.skills.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-1">
            {provider.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="text-xs bg-surface text-text-secondary px-2 py-1 rounded-md border border-border">
                {skill}
              </span>
            ))}
            {provider.skills.length > 3 && (
              <span className="text-xs text-text-muted px-1 py-1">+{provider.skills.length - 3}</span>
            )}
          </div>
        ) : (
          <p className="text-xs text-text-muted line-clamp-2">
            {provider.bio || "Top rated professional ready to help."}
          </p>
        )}
      </div>
    </Link>
  );
}
