"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Flame, Sparkles, Star } from "lucide-react";

import { ProductCard } from "@/components/marketplace/product-card";
import { ServiceCard } from "@/components/services/service-card";
import { HeroSection } from "@/components/home/hero-section";
import { ProviderCard } from "@/components/home/provider-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchFeed, type FeedData } from "@/lib/api/feed.api";
import { getErrorMessage } from "@/lib/api/client";
import { Alert } from "@/components/ui/alert";

export default function HomePage() {
  const [feedData, setFeedData] = useState<FeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeed()
      .then(setFeedData)
      .catch((err) => setError(getErrorMessage(err, "Couldn't load feed data")))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-16 pb-20">
      <HeroSection />

      {/* Latest Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-text-primary">Latest Products</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[300px] w-full rounded-card" />
            ))}
          </div>
        ) : feedData && feedData.latestProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {feedData.latestProducts.map((product) => (
              <ProductCard key={(product as any)._id} product={product as any} />
            ))}
          </div>
        ) : (
          <EmptyState title="No products yet" description="Check back later for new arrivals." />
        )}
      </section>

      {/* Featured Services */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-text-primary">Featured Services</h2>
          </div>
          <Link href="/services" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[300px] w-full rounded-card" />
            ))}
          </div>
        ) : feedData && feedData.featuredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3">
            {feedData.featuredServices.map((service) => (
              <ServiceCard key={(service as any)._id} service={service as any} />
            ))}
          </div>
        ) : (
          <EmptyState title="No services yet" description="Check back later for featured services." />
        )}
      </section>

      {/* Top Rated Providers */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-text-primary">Top Rated Providers</h2>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[220px] w-full rounded-card" />
            ))}
          </div>
        ) : feedData && feedData.topProviders.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {feedData.topProviders.map((provider) => (
              <ProviderCard key={(provider as any)._id || provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <EmptyState title="No providers yet" description="No top-rated providers available." />
        )}
      </section>

      {/* CTA Band */}
      <section className="flex flex-col items-center justify-between gap-4 rounded-card border border-border bg-card p-8 text-center sm:flex-row sm:text-left">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Want to start selling or offering services?</h2>
          <p className="mt-1 text-sm text-text-secondary">Join Nexora and reach a community of buyers and clients.</p>
        </div>
        <Link href="/register">
          <Button size="lg">Get Started</Button>
        </Link>
      </section>
    </div>
  );
}
