"use client";

import * as Icons from "lucide-react";
import { Store } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";

type IconComponent = React.ComponentType<{ className?: string }>;
const iconMap = Icons as unknown as Record<string, IconComponent>;

function CategoryIcon({ name }: { name?: string }) {
  const Icon = (name && iconMap[name]) || Store;
  return <Icon className="h-6 w-6" />;
}

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-text-primary">Browse Categories</h1>
      <p className="mt-1 text-sm text-text-secondary">Find products by category.</p>

      {isLoading ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-card" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No categories yet" description="Categories will appear here once they're added." />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 rounded-card border border-border bg-card p-5 text-center transition-colors hover:border-primary"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-btn bg-primary/15 text-primary">
                <CategoryIcon name={cat.icon} />
              </span>
              <span className="text-sm font-medium text-text-primary">{cat.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
