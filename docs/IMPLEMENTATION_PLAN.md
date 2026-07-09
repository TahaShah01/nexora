# Nexora — Implementation Plan

> ✅ **All phases below are complete.** This document is kept as the
> historical plan/architecture record — see `IMPLEMENTATION_LOG.md` for
> what actually got built (and any deviations) phase by phase, and root
> `README.md` §5 for the current, fully-reviewed requirements checklist.

Methodology: Architecture → Implementation Plan → Development → Verification →
Documentation → **Stop and wait for approval** before the next phase, exactly
as mandated by the project brief. No phase starts before the previous one is
approved.

Every requirement in the original SRS is assigned to exactly one phase below.
Nothing is invented that isn't in the SRS; where the SRS was ambiguous, the
assumption is written in `IMPLEMENTATION_LOG.md`.

---

## Phase 0 — Foundation & Setup ✅ (this delivery)

**Architecture decisions**
- Two independent projects (`frontend/`, `backend/`) — no shared runtime,
  only a shared *convention* for types (duplicated, since a real npm
  workspace/shared package adds build complexity the SRS didn't ask for).
- Tailwind v4's CSS-first `@theme` directive is the source of truth for every
  design token (color, type, spacing, radius) — avoids config drift between
  a `tailwind.config.ts` and raw CSS variables.
- Backend uses a classic layered structure: `routes → controllers → services
  → models`, with `middleware/` for cross-cutting concerns (auth, error
  handling, rate limiting) and `validators/` for Zod schemas.
- Auth strategy locked in now (even though implemented in Phase 1) because it
  affects folder layout: short-lived access JWT in memory / cookie, long-lived
  refresh JWT in an HTTP-only cookie, rotation on refresh, role claim in the
  access token for RBAC middleware.

**Deliverables (done)**
- Monorepo scaffold, both apps boot to a health-check/placeholder page.
- Design tokens (colors, type scale, spacing, radius) implemented in
  `frontend/src/app/globals.css`.
- Full documentation set (this file + 6 others).

---

## Phase 1 — Authentication & Core Infrastructure

- `User` model: email, password hash, role enum (`buyer`, `seller`,
  `provider`, `admin`), profile fields stub, timestamps.
- Endpoints: register, login, logout, refresh, get current user.
- JWT access (15m) + refresh (7d, rotated + stored hashed), HTTP-only,
  `SameSite=Lax`, `Secure` in production.
- RBAC middleware (`requireAuth`, `requireRole(...roles)`).
- Frontend: `AuthContext` + TanStack Query hooks (`useLogin`, `useRegister`,
  `useCurrentUser`), route protection via a layout guard, login/register
  pages using React Hook Form + Zod.
- Cloudinary signed-upload endpoint (needed by avatar upload in Phase 3, set
  up now since it's pure infrastructure).

## Phase 2 — Design System & App Shell

- Primitive components: Button, Input, Textarea, Select, Checkbox, Radio,
  Card, Badge, Chip, Tag, Avatar, Tooltip, Alert, Skeleton, Empty State,
  Loader/Spinner.
- Overlay components: Modal, Drawer, Dropdown, Popover.
- Navigation components: Tabs, Breadcrumbs, Pagination, Accordion.
- Feedback: Toast wiring via Sonner.
- Rating component (display + input) and Review card.
- App shell: sticky top utility bar (logo, global search, messages icon,
  notifications icon, profile menu, theme toggle), main nav, footer, left
  filter panel shell (rendered only on marketplace routes), theme toggle
  wired to `next-themes` using the dark/light token sets from Phase 0.

## Phase 3 — User Profiles & Social Graph

- Extend `User` model: cover image, bio, location, contact, skills[],
  social links, portfolio images[], trust score, badges[], verification
  status, response time, completion rate.
- `Follow` model (follower/following edges) + follow/unfollow endpoints.
- Public profile page (tabs: Overview, Products, Services, Reviews,
  Bookings/Orders, Activity) and profile edit page.
- Profile card component (used in listings, search, dashboards).

## Phase 4 — Product Marketplace

- `Category`, `Product` models. Seller CRUD endpoints + image upload via
  Cloudinary.
- Product listing page: left filter panel (category, price range, condition,
  location, rating, availability), sort, grid/list toggle, server-side
  pagination.
- Product detail page: gallery, seller card, related products, reviews.
- Wishlist model + endpoints + UI.
- Global product search (debounced) feeding into the listing page.

## Phase 5 — Service Marketplace

- `ServiceCategory`, `Service`, `Package` (pricing tiers) models.
- Provider CRUD endpoints.
- Availability calendar model (recurring + blocked slots) and booking-request
  flow (inquiry → provider accepts/declines → confirmed booking).
- Service listing/detail pages mirroring the product marketplace UX so both
  feel like one system, not two.

## Phase 6 — Orders, Bookings & Reviews

- `Order` model (product purchases) and `Booking` model (service bookings)
  with a shared status machine where it makes sense
  (`pending → confirmed → in_progress → completed → cancelled/refunded`).
- `Review` model (linked to order/booking, product/service, and the
  reviewed user) + rating aggregation on the target document.
- Buyer-facing order/booking history, seller/provider-facing order/booking
  management table (TanStack Table).

## Phase 7 — Real-Time Messaging

- Socket.io server with authenticated sockets (JWT handshake), namespaced
  for messaging.
- `Conversation`, `Message` models. Text, image, file, and voice-note
  attachments (uploaded to Cloudinary, URL referenced in the message).
- Typing indicators, read receipts, online-status presence, unread counters,
  conversation list, in-conversation search.

## Phase 8 — Notifications

- `Notification` model with `type` enum (message, order, review, favorite,
  system, payment, follow) and a `targetUrl` for click-through navigation.
- Socket.io notifications namespace for real-time push; REST endpoints for
  history + mark-as-read; unread badge wired into the top utility bar.
- Event emitters triggered from order/booking/review/follow/message
  controllers so notifications are a byproduct of existing actions, not a
  bolt-on.

## Phase 9 — Dashboards & Analytics

- Role-aware dashboard shell reached only via the profile dropdown (never the
  landing page), with sections: Analytics, Orders/Bookings, Listings,
  Messages, Notifications, Saved Items, Settings, Activity, Calendar, Reviews,
  Wallet (if the SRS's "if applicable" is confirmed in scope during this
  phase).
- Analytics endpoints (aggregation pipelines) + Recharts visualizations:
  revenue over time, orders by status, top listings, response-time trend.
- PDF export (pdf-lib) for order receipts/invoices from the dashboard.

## Phase 10 — Performance, Accessibility & Polish

- Infinite scroll + server-side pagination audit across all listing views.
- Image optimization pass (Next.js `<Image>`, Cloudinary transforms),
  code-splitting audit, memoization pass on expensive list renders.
- Optimistic updates for follow/wishlist/like-style interactions.
- Accessibility pass: keyboard nav, ARIA labels, focus rings, contrast check
  against both palettes, `prefers-reduced-motion` handling for all Motion
  animations.
- Full responsive pass: desktop → laptop → tablet → mobile.

---

## Cross-Phase Rules
- No hardcoded data anywhere past Phase 1 — every list/table renders from an
  API response.
- Every new component is added once to the design system, never redefined
  ad hoc in a page.
- Every phase ends with `TASK.md` and `IMPLEMENTATION_LOG.md` updated and the
  root `README.md` checklist flipped from ⬜ to ✅, then **stop and wait**.
- No automated test suites are written per the project brief — engineering
  time goes into implementation, not test scaffolding.
