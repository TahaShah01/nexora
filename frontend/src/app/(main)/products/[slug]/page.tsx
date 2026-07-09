"use client";

import { Heart, MapPin, ShoppingCart, Star } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { ProductCard } from "@/components/marketplace/product-card";
import { MessageButton } from "@/components/shared/message-button";
import { ReviewForm } from "@/components/shared/review-form";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ReviewBreakdown } from "@/components/ui/review-breakdown";
import { ReviewCard } from "@/components/ui/review-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useMyOrderForProduct } from "@/hooks/use-orders";
import { useProduct, useRelatedProducts } from "@/hooks/use-product";
import { useDeleteReview, useReviews } from "@/hooks/use-reviews";
import { useWishlistMutation } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import type { ProductSeller } from "@/types/product";

// Most product-page visitors browse without buying — defer this bundle
// until the Buy Now button is actually clicked.
const BuyNowModal = dynamic(() => import("@/components/marketplace/buy-now-modal").then((m) => m.BuyNowModal), {
  ssr: false,
});

const CONDITION_LABELS: Record<string, string> = {
  new: "New",
  like_new: "Like New",
  used: "Used",
  refurbished: "Refurbished",
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { data: product, isLoading } = useProduct(slug);
  const { data: related = [] } = useRelatedProducts(slug);
  const { toggle, isPending } = useWishlistMutation(product?.id ?? "", slug);
  const { data: myOrder } = useMyOrderForProduct(slug, !!user);
  const { data: reviewsData } = useReviews("product", product?.id ?? "");
  const deleteReview = useDeleteReview("product", product?.id ?? "");
  const [activeImage, setActiveImage] = useState(0);
  const [buyNowOpen, setBuyNowOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Skeleton className="h-96 w-full rounded-card" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <EmptyState title="Product not found" description="This listing doesn't exist or has been removed." />
      </div>
    );
  }

  const seller = typeof product.seller === "object" ? (product.seller as ProductSeller) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-card border border-border bg-elevated">
            {product.images[activeImage] && (
              <Image src={product.images[activeImage]} alt={product.title} fill className="object-cover" />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative h-16 w-16 overflow-hidden rounded-input border",
                    i === activeImage ? "border-primary" : "border-border"
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge variant={product.condition === "new" ? "success" : "default"}>
                {CONDITION_LABELS[product.condition]}
              </Badge>
              <h1 className="mt-2 text-2xl font-semibold text-text-primary">{product.title}</h1>
            </div>
            <button
              type="button"
              disabled={isPending}
              onClick={() => toggle(product.isWishlisted)}
              aria-label="Toggle wishlist"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-text-secondary hover:text-danger"
            >
              <Heart className={cn("h-5 w-5", product.isWishlisted && "fill-danger text-danger")} />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-3xl font-bold text-text-primary">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-text-muted line-through">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              {product.ratingAvg.toFixed(1)} ({product.ratingCount} reviews)
            </span>
            {product.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {product.location}
              </span>
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-text-secondary">{product.description}</p>

          {seller?.id !== user?.id && (
            <Button size="lg" className="mt-5 w-full" onClick={() => setBuyNowOpen(true)}>
              <ShoppingCart className="h-4 w-4" /> Buy Now
            </Button>
          )}

          {seller && (
            <div className="mt-6 flex items-center justify-between rounded-card border border-border bg-card p-4">
              <Link href={`/profile/${seller.username}`} className="flex items-center gap-3 hover:opacity-90">
                <Avatar src={seller.avatarUrl} name={seller.name} size="md" />
                <div>
                  <p className="text-sm font-medium text-text-primary">{seller.name}</p>
                  <p className="text-xs text-text-muted">
                    {seller.verificationStatus === "verified" ? "Verified Seller" : "Seller"}
                  </p>
                </div>
              </Link>
              <MessageButton username={seller.username} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-text-primary">
            Reviews {product.ratingCount > 0 && <span className="text-text-muted">({product.ratingCount})</span>}
          </h2>
          {myOrder && (
            <div className="flex gap-2">
              <ReviewForm
                targetType="product"
                targetId={product.id}
                orderId={myOrder._id}
                triggerLabel="Write a Review"
              />
              {seller && (
                <ReviewForm
                  targetType="user"
                  targetId={seller.id ?? (seller as any)._id}
                  orderId={myOrder._id}
                  triggerLabel="Rate the Seller"
                />
              )}
            </div>
          )}
        </div>

        {reviewsData && reviewsData.items.length > 0 ? (
          <div className="rounded-card border border-border bg-card p-6">
            <ReviewBreakdown 
              ratingAvg={product.ratingAvg} 
              ratingCount={product.ratingCount} 
              breakdown={reviewsData.breakdown || {}} 
              className="mb-8"
            />
            
            <div className="flex flex-col">
              {reviewsData.items.map((review) => {
                const author = typeof review.author === "object" ? review.author : null;
                return (
                  <ReviewCard
                    key={review._id}
                    id={review._id}
                    authorId={author?._id}
                    authorName={author?.name ?? "Nexora user"}
                    authorUsername={author?.username}
                    authorAvatarUrl={author?.avatarUrl}
                    rating={review.rating}
                    comment={review.comment}
                    createdAt={review.createdAt}
                    onDelete={(id) => deleteReview.mutate(id)}
                    isDeleting={deleteReview.isPending}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Star}
            title="No reviews yet"
            description={
              myOrder
                ? "You've bought this — be the first to leave a review."
                : "Reviews will appear here once buyers leave feedback."
            }
          />
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <BuyNowModal product={product} open={buyNowOpen} onClose={() => setBuyNowOpen(false)} />
    </div>
  );
}
