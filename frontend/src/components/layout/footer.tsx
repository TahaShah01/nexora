"use client";

import { Github, Instagram, Linkedin, Send, Twitter } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const COLUMNS = [
  {
    heading: "Marketplace",
    links: [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Services", href: "/services" },
      { label: "Categories", href: "/categories" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Center", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export function Footer() {
  function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.info("Newsletter signups aren't live yet — check back soon.");
  }

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-btn bg-primary text-sm font-bold text-ink">
              N
            </span>
            <span className="text-lg font-semibold text-text-primary">Nexora</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-text-secondary">
            Nexora is your trusted community marketplace for products and services.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <h4 className="text-sm font-semibold text-text-primary">{col.heading}</h4>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="text-sm font-semibold text-text-primary">Stay Connected</h4>
          <p className="mt-3 text-sm text-text-secondary">Get updates on new features and launches.</p>
          <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email"
              aria-label="Email address"
              className="h-10 flex-1 rounded-input border border-border bg-background px-3 text-sm text-text-primary placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-input bg-primary text-white hover:bg-primary-hover"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-4 flex gap-3 text-text-muted">
            <Twitter className="h-4 w-4 hover:text-primary" />
            <Instagram className="h-4 w-4 hover:text-primary" />
            <Linkedin className="h-4 w-4 hover:text-primary" />
            <Github className="h-4 w-4 hover:text-primary" />
          </div>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-text-muted">
        © {new Date().getFullYear()} Nexora. All rights reserved.
      </div>
    </footer>
  );
}
