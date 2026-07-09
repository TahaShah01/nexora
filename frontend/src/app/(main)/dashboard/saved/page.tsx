"use client";

import { Heart } from "lucide-react";

import { ProductCard } from "@/components/marketplace/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlist } from "@/hooks/use-wishlist";

export default function SavedItemsPage() {
  const { data: products = [], isLoading } = useWishlist();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-text-primary">Saved Items</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-card" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Nothing saved yet"
          description="Tap the heart icon on any product to save it here for later."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={{ ...product, isWishlisted: true }} />
          ))}
        </div>
      )}
    </div>
  );
}
