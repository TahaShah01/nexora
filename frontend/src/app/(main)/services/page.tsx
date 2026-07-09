"use client";

import { ClipboardX, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { FilterPanel } from "@/components/layout/filter-panel";
import { ServiceCard } from "@/components/services/service-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useInfiniteScrollTrigger } from "@/hooks/use-infinite-scroll-trigger";
import { useServiceCategories } from "@/hooks/use-service-categories";
import { useInfiniteServices } from "@/hooks/use-services";
import { cn } from "@/lib/utils";
import type { ServiceSort } from "@/types/service";

const DELIVERY_OPTIONS: { value: number | undefined; label: string }[] = [
  { value: undefined, label: "Any Time" },
  { value: 1, label: "Up to 24 hours" },
  { value: 3, label: "Up to 3 days" },
  { value: 7, label: "Up to 7 days" },
];

function ServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categories = [] } = useServiceCategories();

  const category = searchParams.get("category") ?? undefined;
  const sort = (searchParams.get("sort") as ServiceSort) || "newest";
  const q = searchParams.get("q") ?? undefined;
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;
  const maxDeliveryDays = searchParams.get("maxDeliveryDays")
    ? Number(searchParams.get("maxDeliveryDays"))
    : undefined;

  const [searchInput, setSearchInput] = useState(q ?? "");
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  useEffect(() => {
    if (debouncedSearch === (q ?? "")) return;
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) params.set("q", debouncedSearch);
    else params.delete("q");
    router.push(`/services?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally excludes searchParams/router to avoid re-firing on every navigation
  }, [debouncedSearch]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteServices({
    category,
    sort,
    q,
    minPrice,
    maxPrice,
    minRating,
    maxDeliveryDays,
    limit: 12,
  });

  const sentinelRef = useInfiniteScrollTrigger(() => fetchNextPage(), Boolean(hasNextPage) && !isFetchingNextPage);

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);
  const total = data?.pages[0]?.total ?? 0;

  function updateParams(next: Record<string, string | number | undefined | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") params.delete(key);
      else params.set(key, String(value));
    });
    router.push(`/services?${params.toString()}`);
  }

  const categoryOptions = useMemo(() => categories.map((c) => ({ id: c.slug, label: c.name })), [categories]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 rounded-card border border-border bg-card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-text-primary">Services Marketplace</h1>
        <p className="mt-1 text-sm text-text-secondary">Find professional services from skilled and trusted providers.</p>
        <div className="relative mt-4 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search services..."
            aria-label="Search services"
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
          onClearAll={() => router.push("/services")}
        >
          <div>
            <h4 className="mb-3 text-sm font-medium text-text-secondary">Delivery Time</h4>
            <div className="space-y-1.5">
              {DELIVERY_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => updateParams({ maxDeliveryDays: opt.value })}
                  className={cn(
                    "block w-full rounded-btn px-2.5 py-1.5 text-left text-sm transition-colors",
                    maxDeliveryDays === opt.value || (!maxDeliveryDays && opt.value === undefined)
                      ? "bg-primary/15 text-primary"
                      : "text-text-secondary hover:bg-elevated"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </FilterPanel>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-text-secondary">{total} services found</p>
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
                {items.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
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
              icon={ClipboardX}
              title="No services found"
              description="Try adjusting your filters, or check back soon as new providers join."
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6" />}>
      <ServicesContent />
    </Suspense>
  );
}
