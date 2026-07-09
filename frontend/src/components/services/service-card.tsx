import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Service, ServiceProvider } from "@/types/service";

function asProvider(provider: Service["provider"]): ServiceProvider | null {
  return typeof provider === "object" ? provider : null;
}

function ServiceCardImpl({ service }: { service: Service }) {
  const provider = asProvider(service.provider);
  const fastestDelivery = service.packages.length
    ? Math.min(...service.packages.map((p) => p.deliveryDays))
    : null;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group block overflow-hidden rounded-card border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-elevated">
        {service.images[0] && (
          <Image
            src={service.images[0]}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="truncate text-sm font-medium text-text-primary">{service.title}</h3>

        {provider && (
          <div className="mt-3 flex items-center gap-1.5">
            <Avatar src={provider.avatarUrl} name={provider.name} size="sm" />
            <span className="truncate text-xs text-text-secondary">{provider.name}</span>
            {provider.verificationStatus === "verified" && (
              <Badge variant="primary" className="ml-auto shrink-0">
                Top Rated
              </Badge>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            {service.ratingAvg.toFixed(1)} ({service.ratingCount})
          </span>
          {fastestDelivery && (
            <span>
              {fastestDelivery} Day{fastestDelivery > 1 ? "s" : ""} Delivery
            </span>
          )}
        </div>

        <div className="mt-3 border-t border-border pt-3 text-sm">
          <span className="text-text-muted">Starting at </span>
          <span className="font-semibold text-text-primary">${service.startingPrice.toFixed(0)}</span>
        </div>
      </div>
    </Link>
  );
}

export const ServiceCard = memo(ServiceCardImpl);
