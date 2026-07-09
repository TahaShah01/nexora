"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Package, Search, Star, Users, Wrench } from "lucide-react";

import { globalSearch, type SearchResult } from "@/lib/api/search.api";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

const TABS = [
  { key: "all", label: "All" },
  { key: "product", label: "Products" },
  { key: "service", label: "Services" },
  { key: "user", label: "People" },
] as const;

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debouncedValue;
}

function ResultCount({ n }: { n: number }) {
  return <span className="ml-1.5 text-xs text-text-muted">({n})</span>;
}

import { Suspense } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") ?? "";
  const type = (searchParams.get("type") ?? "all") as typeof TABS[number]["key"];

  const [query, setQuery] = useState(q);
  const debouncedQuery = useDebounce(query, 300);

  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync URL → input on mount / back/forward nav
  useEffect(() => { setQuery(q); }, [q]);

  // Load recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("nexora_recent_searches") ?? "[]");
      setRecentSearches(Array.isArray(stored) ? stored.slice(0, 5) : []);
    } catch { /* ignore */ }
  }, []);

  function saveRecentSearch(term: string) {
    try {
      const prev: string[] = JSON.parse(localStorage.getItem("nexora_recent_searches") ?? "[]");
      const updated = [term, ...prev.filter((s) => s !== term)].slice(0, 5);
      localStorage.setItem("nexora_recent_searches", JSON.stringify(updated));
      setRecentSearches(updated);
    } catch { /* ignore */ }
  }

  function clearRecentSearches() {
    localStorage.removeItem("nexora_recent_searches");
    setRecentSearches([]);
  }

  // Fetch when debounced query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    globalSearch(debouncedQuery, type === "all" ? undefined : type)
      .then((r) => { setResults(r); saveRecentSearch(debouncedQuery); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [debouncedQuery, type]);

  // Push URL update when user submits form
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const params = new URLSearchParams({ q: query });
    if (type !== "all") params.set("type", type);
    router.push(`/search?${params.toString()}`);
  }

  function setTab(key: typeof TABS[number]["key"]) {
    const params = new URLSearchParams({ q: debouncedQuery });
    if (key !== "all") params.set("type", key);
    router.replace(`/search?${params.toString()}`);
  }

  const totalResults = results
    ? (results.products?.length ?? 0) + (results.services?.length ?? 0) + (results.users?.length ?? 0)
    : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Search Header */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, services, or people..."
            className="h-14 w-full rounded-card border border-border bg-card pl-12 pr-4 text-lg text-text-primary shadow-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </form>

      {/* Recent searches (empty query) */}
      {!debouncedQuery && recentSearches.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-text-muted uppercase tracking-wide">Recent Searches</h2>
            <button
              onClick={clearRecentSearches}
              className="text-xs text-danger hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="rounded-badge border border-border bg-surface px-3 py-1 text-sm text-text-secondary hover:border-primary hover:text-primary transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      {debouncedQuery.length >= 2 && (
        <div className="mb-6 flex gap-2 border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                type === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              {tab.label}
              {results && tab.key === "all" && <ResultCount n={totalResults} />}
              {results && tab.key === "product" && <ResultCount n={results.products?.length ?? 0} />}
              {results && tab.key === "service" && <ResultCount n={results.services?.length ?? 0} />}
              {results && tab.key === "user" && <ResultCount n={results.users?.length ?? 0} />}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-card" />
          ))}
        </div>
      )}

      {/* No query */}
      {!loading && !debouncedQuery && recentSearches.length === 0 && (
        <EmptyState icon={Search} title="What are you looking for?" description="Type at least 2 characters to start searching." />
      )}

      {/* No results */}
      {!loading && debouncedQuery.length >= 2 && results && totalResults === 0 && (
        <EmptyState icon={Search} title={`No results for "${debouncedQuery}"`} description="Try different keywords or check the spelling." />
      )}

      {/* Results */}
      {!loading && results && (
        <div className="space-y-10">
          {/* Products */}
          {results.products && results.products.length > 0 && (type === "all" || type === "product") && (
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
                <Package className="h-5 w-5 text-primary" /> Products
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {results.products.map((p) => (
                  <Link
                    key={p._id}
                    href={`/products/${p.slug}`}
                    className="flex items-center gap-4 rounded-card border border-border bg-card p-4 hover:border-primary/40 transition-colors group"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface border border-border">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-text-muted" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-text-primary group-hover:text-primary line-clamp-1">{p.title}</p>
                      <p className="text-sm text-primary font-semibold">${p.price}</p>
                      {p.ratingAvg > 0 && (
                        <div className="flex items-center gap-1 text-xs text-warning">
                          <Star className="h-3 w-3 fill-warning" /> {p.ratingAvg.toFixed(1)}
                        </div>
                      )}
                    </div>
                    {p.condition && <Badge variant="default">{p.condition}</Badge>}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Services */}
          {results.services && results.services.length > 0 && (type === "all" || type === "service") && (
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
                <Wrench className="h-5 w-5 text-primary" /> Services
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {results.services.map((s) => {
                  const provider = typeof s.provider === "object" ? s.provider : null;
                  return (
                    <Link
                      key={s._id}
                      href={`/services/${s.slug}`}
                      className="flex items-center gap-4 rounded-card border border-border bg-card p-4 hover:border-primary/40 transition-colors group"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface border border-border">
                        {s.images?.[0] ? (
                          <img src={s.images[0]} alt={s.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Wrench className="h-6 w-6 text-text-muted" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-text-primary group-hover:text-primary line-clamp-1">{s.title}</p>
                        <p className="text-sm text-primary font-semibold">From ${s.startingPrice}</p>
                        {provider && <p className="text-xs text-text-muted">{provider.name}</p>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Users */}
          {results.users && results.users.length > 0 && (type === "all" || type === "user") && (
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
                <Users className="h-5 w-5 text-primary" /> People
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {results.users.map((u) => (
                  <Link
                    key={u._id}
                    href={`/profile/${u.username}`}
                    className="flex items-center gap-4 rounded-card border border-border bg-card p-4 hover:border-primary/40 transition-colors group"
                  >
                    <Avatar src={u.avatarUrl} name={u.name} size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-text-primary group-hover:text-primary">{u.name}</p>
                      <p className="text-sm text-text-muted">@{u.username}</p>
                      {u.skills && u.skills.length > 0 && (
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{u.skills.slice(0, 3).join(" · ")}</p>
                      )}
                    </div>
                    {u.ratingCount > 0 && (
                      <div className="flex items-center gap-1 text-xs text-warning shrink-0">
                        <Star className="h-3 w-3 fill-warning" /> {u.ratingAvg?.toFixed(1)}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8"><Skeleton className="h-14 w-full rounded-card" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
