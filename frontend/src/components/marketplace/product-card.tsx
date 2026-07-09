"use client";

import { Heart, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import { Avatar } from "@/components/ui/avatar";
import { useWishlistMutation } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import type { Product, ProductSeller } from "@/types/product";

function asSeller(seller: Product["seller"]): ProductSeller | null {
  return typeof seller === "object" ? seller : null;
}

const RECENT_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

function ProductCardImpl({ product }: { product: Product }) {
  const { toggle, isPending } = useWishlistMutation(product.id, product.slug);
  const seller = asSeller(product.seller);

  const discountPct =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const isNew = product.condition === "new" && Date.now() - new Date(product.createdAt).getTime() < RECENT_MS;

  return (
    <div className="group overflow-hidden rounded-card border border-border bg-card transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] bg-elevated">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        )}

        {discountPct ? (
          <span className="absolute left-2 top-2 rounded-badge bg-danger px-2 py-0.5 text-xs font-semibold text-ink">
            -{discountPct}%
          </span>
        ) : isNew ? (
          <span className="absolute left-2 top-2 rounded-badge bg-success px-2 py-0.5 text-xs font-semibold text-ink">
            NEW
          </span>
        ) : null}

        <button
          type="button"
          aria-label={product.isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          disabled={isPending}
          onClick={(e) => {
            e.preventDefault();
            toggle(product.isWishlisted);
          }}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-text-secondary shadow-sm hover:text-danger"
        >
          <Heart className={cn("h-4 w-4", product.isWishlisted && "fill-danger text-danger")} />
        </button>
      </div>

      <Link href={`/products/${product.slug}`} className="block p-4">
        <h3 className="truncate text-sm font-medium text-text-primary">{product.title}</h3>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-semibold text-text-primary">${product.price.toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-text-muted line-through">${product.compareAtPrice.toFixed(2)}</span>
          )}
        </div>

        {seller && (
          <div className="mt-3 flex items-center gap-1.5">
            <Avatar src={seller.avatarUrl} name={seller.name} size="sm" />
            <span className="truncate text-xs text-text-secondary">{seller.name}</span>
          </div>
        )}

        <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            {product.ratingAvg.toFixed(1)} ({product.ratingCount})
          </span>
          {product.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {product.location}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}

export const ProductCard = memo(ProductCardImpl);
