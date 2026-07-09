"use client";

import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Package,
  Search,
  Settings,
  Shield,
  User as UserIcon,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { DropdownItem, DropdownMenu } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadMessageCount } from "@/hooks/use-conversations";
import { globalSearch, type SearchResult } from "@/lib/api/search.api";
import { cn } from "@/lib/utils";

import { NotificationBell } from "./notification-bell";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function useDebounce<T>(value: T, delay: number): T {
  const [d, setD] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setD(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return d;
}

function NavSearch({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [suggestions, setSuggestions] = useState<SearchResult | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions(null);
      return;
    }
    globalSearch(debouncedQuery)
      .then(setSuggestions)
      .catch(() => setSuggestions(null));
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hasResults =
    suggestions &&
    ((suggestions.products?.length ?? 0) +
      (suggestions.services?.length ?? 0) +
      (suggestions.users?.length ?? 0)) > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setOpen(false);
    onNavigate?.();
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search products, services or people..."
            aria-label="Search"
            className="h-10 w-full rounded-input border border-border bg-background pl-9 pr-8 text-sm text-text-primary placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setSuggestions(null); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete dropdown */}
      {open && hasResults && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-[420px] overflow-y-auto rounded-card border border-border bg-card shadow-lg">
          {suggestions!.products && suggestions!.products.length > 0 && (
            <div>
              <p className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1">
                <Package className="h-3 w-3" /> Products
              </p>
              {suggestions!.products.slice(0, 3).map((p) => (
                <Link
                  key={p._id}
                  href={`/products/${p.slug}`}
                  onClick={() => { setOpen(false); setQuery(""); onNavigate?.(); }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-elevated transition-colors"
                >
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-surface border border-border">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-4 w-4 text-text-muted" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary line-clamp-1">{p.title}</p>
                    <p className="text-xs text-primary">${p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {suggestions!.services && suggestions!.services.length > 0 && (
            <div>
              <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1">
                <Wrench className="h-3 w-3" /> Services
              </p>
              {suggestions!.services.slice(0, 3).map((s) => (
                <Link
                  key={s._id}
                  href={`/services/${s.slug}`}
                  onClick={() => { setOpen(false); setQuery(""); onNavigate?.(); }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-elevated transition-colors"
                >
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-surface border border-border">
                    {s.images?.[0] ? (
                      <img src={s.images[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Wrench className="h-4 w-4 text-text-muted" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary line-clamp-1">{s.title}</p>
                    <p className="text-xs text-primary">From ${s.startingPrice}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {suggestions!.users && suggestions!.users.length > 0 && (
            <div>
              <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1">
                <UserIcon className="h-3 w-3" /> People
              </p>
              {suggestions!.users.slice(0, 3).map((u) => (
                <Link
                  key={u._id}
                  href={`/profile/${u.username}`}
                  onClick={() => { setOpen(false); setQuery(""); onNavigate?.(); }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-elevated transition-colors"
                >
                  <Avatar src={u.avatarUrl} name={u.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">{u.name}</p>
                    <p className="text-xs text-text-muted">@{u.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={() => { setOpen(false); setQuery(""); onNavigate?.(); }}
            className="block border-t border-border px-3 py-2.5 text-sm font-medium text-primary hover:bg-elevated transition-colors text-center"
          >
            See all results for &ldquo;{query}&rdquo;
          </Link>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const unreadCount = useUnreadMessageCount();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            className="rounded-btn p-2 text-text-secondary hover:bg-elevated md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-btn bg-primary text-sm font-bold text-ink">
              N
            </span>
            <span className="text-lg font-semibold text-text-primary">Nexora</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-btn px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href ? "text-primary" : "text-text-secondary hover:text-text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden max-w-sm flex-1 md:block">
            <NavSearch />
          </div>

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            {user && (
              <>
                <Link
                  href="/dashboard/messages"
                  aria-label="Messages"
                  className="relative flex h-9 w-9 items-center justify-center rounded-btn text-text-secondary hover:bg-elevated hover:text-text-primary"
                >
                  <MessageCircle className="h-[18px] w-[18px]" />
                  {unreadCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-badge bg-danger px-1 text-[9px] font-semibold text-ink">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
                <NotificationBell />
              </>
            )}

            <ThemeToggle />

            {!isLoading && !user && (
              <div className="ml-1 hidden items-center gap-2 sm:flex">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}

            {user && (
              <DropdownMenu
                trigger={
                  <button
                    type="button"
                    aria-label="Account menu"
                    className="flex items-center gap-1.5 rounded-btn p-1 hover:bg-elevated"
                  >
                    <Avatar src={user.avatarUrl} name={user.name} size="sm" />
                    <ChevronDown className="h-4 w-4 text-text-muted" />
                  </button>
                }
              >
                <DropdownItem onClick={() => router.push(`/profile/${user.username}`)}>
                  <UserIcon className="h-4 w-4" /> View profile
                </DropdownItem>
                <DropdownItem onClick={() => router.push("/dashboard")}>
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </DropdownItem>
                <DropdownItem onClick={() => router.push("/profile/edit")}>Edit profile</DropdownItem>
                {user.role === "admin" && (
                  <>
                    <div className="my-1 border-t border-border" />
                    <DropdownItem onClick={() => router.push("/admin")}>
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-primary font-medium">Admin Panel</span>
                    </DropdownItem>
                  </>
                )}
                <div className="my-1 border-t border-border" />
                <DropdownItem danger onClick={handleLogout}>
                  <LogOut className="h-4 w-4" /> Log out
                </DropdownItem>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} title="Menu" side="left">
        <div className="mb-4">
          <NavSearch onNavigate={() => setMobileOpen(false)} />
        </div>

        <nav className="flex flex-col gap-1" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-btn px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-elevated hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="my-4 border-t border-border" />

        {user ? (
          <button
            type="button"
            onClick={() => { handleLogout(); setMobileOpen(false); }}
            className="flex items-center gap-2 rounded-btn px-3 py-2.5 text-sm font-medium text-danger hover:bg-elevated"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full">Log in</Button>
            </Link>
            <Link href="/register" onClick={() => setMobileOpen(false)}>
              <Button className="w-full">Sign up</Button>
            </Link>
          </div>
        )}
      </Drawer>
    </>
  );
}
