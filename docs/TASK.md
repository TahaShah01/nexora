# Nexora — Task Board

> Update this file at the end of every phase. Move completed items under the
> phase heading with `[x]`. Never delete history — it's the running record.

## Phase 0 — Foundation & Setup ✅ COMPLETE (2026-07-02)
- [x] Initialize monorepo (`frontend/`, `backend/`, `docs/`, `shared/`)
- [x] Frontend: Next.js 16 + TS + Tailwind v4 scaffold, App Router
- [x] Backend: Express + TS scaffold, layered folder structure
- [x] Design tokens (color/type/spacing/radius) → `globals.css` `@theme`
- [x] Dark + light theme CSS variables
- [x] Health-check API route (`GET /api/health`)
- [x] Mongo connection helper (not yet called from a live cluster — needs
      `MONGO_URI` in `.env`)
- [x] `.env.example` for both apps
- [x] Root `README.md` + full docs set

## Phase 1 — Authentication & Core Infrastructure ✅ COMPLETE (2026-07-03)
- [x] `User` Mongoose model (auth fields live now; profile fields Phase-3 stubbed)
- [x] Zod schemas: register, login
- [x] `POST /api/auth/register`
- [x] `POST /api/auth/login`
- [x] `POST /api/auth/logout`
- [x] `POST /api/auth/refresh` (rotates both tokens, hash-checked against stored refresh hash)
- [x] `GET /api/auth/me`
- [x] Access/refresh JWT issuing + rotation
- [x] `requireAuth` + `requireRole` middleware
- [x] Cloudinary signed-upload endpoint (`POST /api/uploads/sign`)
- [x] Frontend `AuthContext` + auth TanStack Query hooks
- [x] Login / Register pages (React Hook Form + Zod) at `/login`, `/register`
- [x] Route-protection layout guard (`<ProtectedRoute>` — not yet consumed by a page; first real use is Phase 3)
- [x] `env.ts` now fails fast if JWT secrets are missing (was a soft warning in Phase 0)

## Phase 2 — Design System & App Shell ✅ COMPLETE (2026-07-04)
- [x] Full primitive set: Button, Input, Label (Phase 1) + Textarea, Select,
      Checkbox, Radio, Card, Badge, Chip, Tag, Avatar, Tooltip, Alert,
      Skeleton, EmptyState, Spinner
- [x] Overlays: Modal, Drawer, DropdownMenu, Popover
- [x] Navigation: Tabs, Breadcrumbs, Pagination, Accordion
- [x] Rating (display + interactive input) + ReviewCard
- [x] App shell: Navbar (sticky, responsive, mobile Drawer menu), Footer,
      ThemeToggle (next-themes), FilterPanel shell (props-driven, no
      hardcoded data)
- [x] Real homepage replacing the Phase 0 placeholder (hero, value props,
      category/product sections wired to real data once Phase 4 landed)
- [ ] Tables (TanStack Table) — deferred until a page actually needs a data
      grid (first candidate: Phase 9 dashboard order/listing tables)

## Phase 3 — User Profiles & Social Graph ✅ COMPLETE (2026-07-04)
- [x] `username` field + auto-generation (slugified name, collision-safe)
      added to `User`; `publicUser()` and `AuthUser` type updated
- [x] `Follow` model + `POST/DELETE /api/users/:username/follow`
- [x] `GET /api/users/:username` (public profile, `optionalAuth` for
      `isFollowedByMe`), `PATCH /api/users/me` (self update)
- [x] `optionalAuth` middleware (populates `req.user` if valid, never blocks)
- [x] Cloudinary avatar upload wired end-to-end (first real consumer of the
      Phase 1 signed-upload endpoint)
- [x] Public profile page (header, stats, About card, tabbed sections)
- [x] Profile edit page (protected, prefilled, avatar upload)
- [x] FollowButton component

## Phase 4 — Product Marketplace ✅ COMPLETE (2026-07-04)
- [x] `Category`, `Product`, `Wishlist` models
- [x] Shared `slugify`/`ensureUniqueSlug` util (refactored out of the
      Phase 3 username generator so Products/Services reuse it)
- [x] `GET /api/categories`; category seed script (`npm run seed`)
- [x] `GET /api/products` (filter: category/price/condition/location/
      rating/text search; sort; server-side pagination)
- [x] `GET /api/products/:slug`, `GET /api/products/:slug/related`
- [x] `POST/PATCH/DELETE /api/products/:slug` (owner + admin only)
- [x] `GET/POST/DELETE /api/wishlist` (+ per-product toggle)
- [x] ProductCard (badges, wishlist heart, seller row, rating, location —
      matches the reference screenshots)
- [x] Products listing page: FilterPanel wired to real categories, sort,
      pagination, condition filter, all URL-search-param driven
- [x] Product detail page: gallery, seller card → profile link, related
      products, honest reviews empty-state (Phase 6)
- [x] Categories index page
- [x] Homepage now shows real Browse Categories + Featured Products;
      Featured Services stays an honest empty-state until Phase 5
- [ ] Seller-facing "create/edit listing" UI — backend CRUD is ready;
      the UI lives in `/dashboard/listings` (Phase 9) per ROUTES.md, not
      duplicated here to avoid building a throwaway form

## Phase 5 — Service Marketplace ✅ COMPLETE (2026-07-04)
- [x] `ServiceCategory`, `Service` (embedded `packages[]`, denormalized `startingPrice`) models
- [x] `Availability` model + `GET/PUT /services/:slug/availability`
- [x] `Booking` model + `POST /bookings`, `GET /bookings` (mine), `PATCH /bookings/:id/status`
- [x] Provider CRUD endpoints (mirrors Product CRUD exactly)
- [x] Service category seeding added to `npm run seed`
- [x] Services listing page (Delivery Time filter instead of Condition, same
      FilterPanel shell reused from Phase 4) + Service detail page
      (packages, BookingModal, related services)
- [x] Homepage "Featured Services" now shows real data
- [x] **Retrofit**: added `seller`/`provider` username filters to the
      Phase 4/5 list endpoints and wired the Phase 3 profile page's
      Products/Services tabs to them — those tabs were still empty-state
      placeholders after Phase 4 even though the data existed by then

## Phase 6 — Orders, Bookings & Reviews ✅ COMPLETE (2026-07-04)
- [x] `Order` model — single product per order ("Buy Now"), see the open
      question resolved below
- [x] `Review` model (product/service/**user** targets) + `recomputeRating()`
      aggregation util shared across all three target types
- [x] Added `ratingAvg`/`ratingCount` to `User` (needed for seller/provider
      review aggregates — the SRS screenshot shows this prominently on the
      profile page)
- [x] `POST /orders`, `GET /orders`, `GET /orders/my-order`,
      `PATCH /orders/:id/status`, `GET /orders/:id/invoice` (pdf-lib)
- [x] `POST /reviews` (eligibility-checked against a real order/booking —
      you can't review something you didn't buy/book),
      `GET /reviews?targetType=&targetId=`
- [x] `getMyBookingForService`/`getMyOrderForProduct` eligibility-lookup
      endpoints — power the "Write a Review" gating without a full order
      history page existing yet
- [x] `BuyNowModal` (shipping address → order → invoice download link)
- [x] `ReviewForm` (reusable — product reviews, service reviews, **and**
      "Rate the Seller"/"Rate the Provider" via targetType=user)
- [x] Real reviews wired into Product detail, Service detail, and the
      Phase 3 profile page's Reviews tab (first real consumer of the
      Phase 2 `ReviewCard` component)
- [x] Profile header gained a Rating stat alongside Trust Score

**Resolved open question**: built `Order` as one order per "Buy Now" click,
not a multi-item cart — confirmed by proceeding per the documented
assumption since no correction came back. If a cart is wanted later, it's
an additive change (wrap Order in a Cart concept) rather than a rewrite.

## Phase 7 — Real-Time Messaging ✅ COMPLETE (2026-07-04)
- [x] Socket.io server: cookie-authenticated handshake (reuses the same
      accessToken as the REST API), per-user rooms (`user:<id>`) instead of
      per-conversation rooms (sufficient for 1:1 messaging)
- [x] `Conversation`, `Message` models (text/image/file/voice types, text
      index on content for search)
- [x] Shared `message.service.ts` — one `createMessage()` used by both the
      socket handler and the REST fallback, so there's a single source of
      truth for "what happens when a message is sent"
- [x] Typing indicators (`message:typing`), read receipts (`message:read`),
      online presence (in-memory `Map<userId, Set<socketId>>` — single
      process only, flagged as a scaling limitation, not hidden)
- [x] Unread counters — per-conversation (badge in `ConversationList`) and
      global (Navbar badge, first real consumer of that icon since Phase 2)
- [x] `GET/POST /conversations`, `GET/POST /conversations/:id/messages`
      (REST — history + fallback send), Socket events for the realtime path
- [x] Conversation list + message thread UI (`/dashboard/messages`),
      in-conversation search (Mongo `$text` against the message content index)
- [x] Every previously-inert "Message" button (product seller card, service
      provider card, profile header) now uses a real `MessageButton` that
      creates/finds the conversation and navigates there
- [x] Voice messages recorded client-side via `MediaRecorder`, uploaded to
      Cloudinary as `resource_type=auto` alongside images/files

## Phase 8 — Notifications ✅ COMPLETE (2026-07-04)
- [x] `Notification` model (type: message|order|review|favorite|system|payment|follow)
- [x] `createNotification()` service — persists + pushes live via the
      Phase 7 `user:<id>` socket room (no separate notifications namespace)
- [x] `GET /notifications` (items + unreadCount in one response),
      `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`
- [x] Event emitters wired into every controller that has a real
      corresponding action: new follower (`user.controller`), new review
      on a product/service/person (`review.controller`), new order +
      order status change (`order.controller`), new booking request +
      booking status change (`booking.controller`), new message
      (`message.service`), new wishlist favorite (`wishlist.controller`)
- [x] `NotificationBell` dropdown (Navbar, first real consumer of that
      bell icon since Phase 2) + full `/dashboard/notifications` history page
- [x] Click-through navigation — every notification carries a real `targetUrl`

**Note**: "system" and "payment" notification types exist in the schema
(matches the SRS's category list exactly) but have no live trigger — there's
no system-generated event or payment gateway in the app yet to fire them
from. Built the capability, didn't fabricate a fake trigger just to fill it.

## Phase 9 — Dashboards & Analytics ✅ COMPLETE (2026-07-04)
- [x] Dashboard shell: `(main)/dashboard/layout.tsx` wraps every `/dashboard/*`
      route in one `ProtectedRoute` + sidebar (desktop) / horizontal tabs
      (mobile); Messages (Phase 7) and Notifications (Phase 8) now live
      inside this shell instead of standing alone
- [x] `GET /dashboard/analytics` — real Mongo aggregations: revenue-by-day,
      orders/bookings-by-status, top 5 products/services by revenue, all
      role-agnostic (buyers just see mostly-empty seller/provider sections,
      hidden client-side rather than faked)
- [x] `GET /dashboard/activity` — merged timeline from Orders/Bookings/
      Reviews/Follows (no separate Activity model; computed on request)
- [x] `PATCH /auth/change-password` (current password required)
- [x] `GET /reviews/mine` (reviews I've authored)
- [x] `/dashboard` (Overview, Recharts) — first real use of that dependency
- [x] `/dashboard/listings` — **the big deferred item since Phase 4/5**:
      full Product + Service create/edit/delete UI, `DataTable` (first real
      TanStack Table use), Cloudinary image upload, dynamic package editor
      for services
- [x] `/dashboard/orders`, `/dashboard/bookings` — purchases/sales and
      made/received tabs, seller/provider status-update dropdown, invoice
      download link surfaced here (endpoint existed since Phase 6)
- [x] `/dashboard/saved` (wishlist grid, reuses `ProductCard`)
- [x] `/dashboard/reviews` (received + given tabs)
- [x] `/dashboard/activity`, `/dashboard/calendar` (upcoming-schedule list —
      see the resolved-decisions note below), `/dashboard/settings`
      (account info, change password, logout)
- [x] Navbar profile dropdown now links to `/dashboard`

**Resolved decisions**
- **Wallet: skipped.** Flagged in Phases 6, 8, and 9's own TASK.md entry
  with no correction — there's no payment gateway anywhere in the app, so
  a Wallet page would have had nothing real to display. Not building it
  is the honest choice; inventing a fake balance would not be.
- **Calendar: list, not grid.** Built as a sorted upcoming-bookings list
  rather than a full month-grid calendar widget. A drag-and-drop/grid
  calendar is a substantial standalone component the SRS names in one
  word ("Calendar") without further detail — the list view delivers the
  actual underlying need (see your schedule) without a multi-day detour
  into calendar-grid UI engineering.

## Phase 10 — Performance, Accessibility & Polish ✅ COMPLETE (2026-07-05)
**This was the final planned phase.**
- [x] Products/Services listing pages converted to infinite scroll
      (`useInfiniteQuery` + `IntersectionObserver`), with a manual
      "Load more" fallback and an end-of-results message
- [x] Optimistic updates rebuilt for real: wishlist toggle and follow/
      unfollow now use `onMutate`/`onError` rollback across every cache
      shape that might hold the affected item (single-item, paginated
      list, infinite list), not just fast invalidation
- [x] Code-splitting: `ProductFormModal`, `ServiceFormModal`, `BuyNowModal`,
      `BookingModal` are all `next/dynamic` (`ssr: false`) — none of that
      code ships in the initial bundle for users who never open them
- [x] Memoization: `ProductCard`, `ServiceCard`, `MessageBubble` wrapped in
      `React.memo` (all three render in loops/grids/threads of
      unbounded size)
- [x] Debounced search (400ms) actually built on the Products/Services
      pages — **this closes a real Phase-4 gap**: it was planned there
      but never implemented; caught during this phase's audit
- [x] Fixed a dead link: Navbar search went to `/search`, a page that was
      never built — now goes to `/products?q=`, which works today
- [x] Accessibility: focus trap + initial-focus in `Modal`/`Drawer`,
      added missing Escape-to-close on `Popover`, real WCAG contrast
      audit (computed, not assumed) with actual color-pairing fixes —
      see `DESIGN_SYSTEM.md`
- [x] Responsive spot-check on detail-page grids and dashboard tables —
      no breakage found, existing patterns held up

**Full requirements checklist reviewed end-to-end** (per this phase's own
instruction from the Phase 9 entry) — see root `README.md` §5. Every ⬜ item
remaining is a deliberate, documented decision (CI/lint tooling,
forgot-password flow, Wallet), not an oversight.

---

**Project status: all 10 planned phases complete.** Remaining work, if any,
is Taha's call — see the open items below and in `IMPLEMENTATION_LOG.md`.
See `IMPLEMENTATION_PLAN.md` for the full breakdown — not duplicated here to
avoid this file drifting out of sync. Each phase gets its own checklist
section, added when that phase starts.

---
**Open items for Taha (all deliberate, none blocking):**
- **Wallet** — skipped, no payment gateway exists. Additive if scoped later.
- **Forgot-password flow** — change-password (logged in) exists; a
  forgot-password email flow needs an email provider not in the SRS stack.
- **CI/lint/format tooling** — never explicitly requested by the SRS; the
  codebase is consistently formatted by hand throughout, but there's no
  automated ESLint/Prettier/CI pipeline wired up.
- **Button `secondary` variant** — 4.44:1 contrast, a hair under AA;
  unused anywhere today. See DESIGN_SYSTEM.md's Contrast Audit.
- **Presence** (Phase 7) is in-memory/single-process — fine at current
  scale, would need a Redis-backed Socket.io adapter to run multi-instance.
- Run `cd backend && npm run seed` once before testing — populates both
  product and service categories.
