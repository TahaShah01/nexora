"use client";

import { PackageSearch, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { FilterPanel } from "@/components/layout/filter-panel";
import { ProductCard } from "@/components/marketplace/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useCategories } from "@/hooks/use-categories";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useInfiniteScrollTrigger } from "@/hooks/use-infinite-scroll-trigger";
import { useInfiniteProducts } from "@/hooks/use-products";
import { cn } from "@/lib/utils";
import type { ProductCondition, ProductSort } from "@/types/product";

const CONDITIONS: { value: ProductCondition; label: string }[] = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "used", label: "Used" },
  { value: "refurbished", label: "Refurbished" },
];

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categories = [] } = useCategories();

  const category = searchParams.get("category") ?? undefined;
  const sort = (searchParams.get("sort") as ProductSort) || "newest";
  const q = searchParams.get("q") ?? undefined;
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const condition = (searchParams.get("condition") as ProductCondition) || undefined;
  const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;

  // Debounced search: typing updates local state instantly (so the input
  // feels responsive), but the URL param — and therefore the API call —
  // only updates 400ms after the user stops typing.
  const [searchInput, setSearchInput] = useState(q ?? "");
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  useEffect(() => {
    if (debouncedSearch === (q ?? "")) return;
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) params.set("q", debouncedSearch);
    else params.delete("q");
    router.push(`/products?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally excludes searchParams/router to avoid re-firing on every navigation
  }, [debouncedSearch]);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts({ category, sort, q, minPrice, maxPrice, condition, minRating, limit: 12 });

  const sentinelRef = useInfiniteScrollTrigger(() => fetchNextPage(), Boolean(hasNextPage) && !isFetchingNextPage);

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);
  const total = data?.pages[0]?.total ?? 0;

  function updateParams(next: Record<string, string | number | undefined | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") params.delete(key);
      else params.set(key, String(value));
    });
    router.push(`/products?${params.toString()}`);
  }

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ id: c.slug, label: c.name })),
    [categories]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 rounded-card border border-border bg-card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-text-primary">Products Marketplace</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Buy and sell amazing products from trusted sellers in your community.
        </p>
        <div className="relative mt-4 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="h-10 w-full rounded-input border border-border bg-surface pl-9 pr-3 text-sm text-text-primary placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <FilterPanel
          categories={categoryOptions}
          selectedCategoryId={category ?? null}
          onCategoryChange={(id) => updateParams({ category: id })}
          priceRange={{ min: minPrice, max: maxPrice }}
          onPriceRangeChange={(range) => updateParams({ minPrice: range.min, maxPrice: range.max })}
          minRating={minRating}
          onMinRatingChange={(r) => updateParams({ minRating: r })}
          onClearAll={() => router.push("/products")}
        >
          <div>
            <h4 className="mb-3 text-sm font-medium text-text-secondary">Condition</h4>
            <div className="space-y-1.5">
              {CONDITIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => updateParams({ condition: condition === c.value ? undefined : c.value })}
                  className={cn(
                    "block w-full rounded-btn px-2.5 py-1.5 text-left text-sm transition-colors",
                    condition === c.value ? "bg-primary/15 text-primary" : "text-text-secondary hover:bg-elevated"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </FilterPanel>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-text-secondary">{total} products found</p>
            <Select value={sort} onChange={(e) => updateParams({ sort: e.target.value })} className="w-auto">
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-card" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {/* Sentinel: fetches the next page when scrolled into view. Falls
                  back to a manual "Load more" click if IntersectionObserver
                  somehow doesn't fire (e.g. reduced-motion / assistive tech). */}
              <div ref={sentinelRef} className="mt-8 flex justify-center">
                {isFetchingNextPage ? (
                  <Spinner />
                ) : hasNextPage ? (
                  <button
                    type="button"
                    onClick={() => fetchNextPage()}
                    className="text-sm font-medium text-primary hover:text-primary-hover"
                  >
                    Load more
                  </button>
                ) : (
                  <p className="text-sm text-text-muted">You've reached the end.</p>
                )}
              </div>
            </>
          ) : (
            <EmptyState
              icon={PackageSearch}
              title="No products found"
              description="Try adjusting your filters, or check back soon as new listings are added."
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6" />}>
      <ProductsContent />
    </Suspense>
  );
}
