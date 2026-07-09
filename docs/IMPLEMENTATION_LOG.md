# Nexora — Implementation Log

## 2026-07-09 — Phase 10: Final Polish, Trust Score & Demo Data (IMPLEMENTATION)

**What was built**
- Overhauled `backend/src/scripts/seed.ts` to clear and regenerate realistic demo data according to the production requirements.
- Configured 5 specific, explicit users (John Smith, Emily Chen, etc.) and explicit Admin credentials (`admin@nexora.local`).
- Developed the `recomputeTrustScore` logic combining profile completeness, verifications, ratings, and transactional activity to generate a realistic Trust Score out of 100.
- Wired Trust Score recalculations into the seed script and displayed it natively on user profiles (with a Shield icon).
- Finished the Admin Panel by integrating Verification Request modifications directly into the Admin Users table.
- Checked off all Phase 10 requirements.

**Next step**
- The project is fully complete and ready for demonstration!

---

## 2026-07-09 — Phase 9: Real-time Messaging (IMPLEMENTATION)

**What was built**
- Audited the entire Real-time Messaging module. Found an incredibly robust baseline that included typing indicators, real-time online presence, voice recording/playback, Cloudinary file uploads, and Socket.io event dispatch.
- Upgraded `use-conversation-messages.ts`: Added the missing `message:read` socket listener to dynamically update the cached messages when the recipient reads them, ensuring read receipts sync in real-time.
- Upgraded `MessageBubble` Component: Added visual read receipts rendering! Shows a `CheckCheck` icon if the message has been read by the recipient, and a `Check` icon if it was sent but is still unread.

## 2026-07-09 — Phase 8: Bookings & Orders Management (Dashboard)

**What was built**
- Dashboard Layout: Verified the fully functioning layout (`dashboard/layout.tsx`) featuring a sticky `DashboardSidebar` for desktop and scrollable `DashboardMobileNav` for mobile with real-time unread badges.
- Dashboard Overview: Verified the `dashboard/page.tsx` displaying `Recharts`-powered analytics (Revenue AreaChart for Sellers, Bookings BarChart for Providers) and summary statistic cards.
- Orders Management: Upgraded `dashboard/orders/page.tsx`. Replaced the raw HTML `<Select>` with an accessible `DropdownMenu`. Sellers can now transition orders cleanly ("Confirm", "Mark as Shipped", "Mark as Delivered", "Cancel"). Buyers can cancel pending orders. Included the Invoice download action in the menu.
- Bookings Management: Upgraded `dashboard/bookings/page.tsx`. Replaced the raw HTML `<Select>` with the `DropdownMenu`. Providers can transition bookings cleanly ("Accept", "Decline", "Mark as Completed"). Both buyers and providers can cancel bookings when pending or accepted. Included the Invoice download action in the menu.
- Both pages correctly split data into dual Tabs (Purchases/Sales for orders, Made/Received for bookings) filtering off the authenticated user ID.

## 2026-07-09 — Phase 7: Reviews & Rating System Enhancement

**What was built**
- Backend: Added `deleteReview` endpoint (`DELETE /reviews/:id`) that calls `recomputeRating`.
- Backend: Modified `listReviews` to include a `$group` aggregation that computes and returns the `breakdown` histogram (count of 1★, 2★, 3★, 4★, 5★ reviews).
- Frontend Types & API: Updated `ReviewListResponse` with `breakdown: Record<number, number>`. Added `deleteReview` API method.
- `useReviews` Hook: Added `useDeleteReview` mutation that correctly invalidates review lists, the target product/service, and the profile cache to refresh aggregate stats.
- `ReviewCard` Component: Completely overhauled UX. Added the author's avatar linked to their profile, a "Verified Purchase" badge, better date formatting, and a `Trash2` hover button for the review's author to delete it.
- `ReviewForm` Component: Upgraded the modal with an interactive star rating that displays text labels ("Poor" to "Excellent"). Added a real-time character counter (max 500), minimum length validation (10 chars), and visual error states for the textarea. Resets state cleanly on success.
- `ReviewBreakdown` Component: Built a new visual histogram UI component that displays the average rating, total count, and visual progress bars for each star level.
- Details Pages: Integrated `ReviewBreakdown` and passed delete handlers into `ReviewCard` across `products/[slug]/page.tsx`, `services/[slug]/page.tsx`, and `profile/[username]/page.tsx`.

## 2026-07-09 — Phase 6: Notifications Enhancement

**What was built**
- Backend Additions: Added `deleteNotification` (DELETE `/notifications/:id`) and `deleteAllNotifications` (DELETE `/notifications/all`) endpoints to `notification.controller.ts` and `notification.routes.ts`.
- Frontend API Layer: Extended `notifications.api.ts` with `deleteNotification()` and `deleteAllNotifications()` functions.
- `useNotifications` Hook: Added `deleteOne` and `deleteAll` mutations. Increased fetch limit from 20 to 50.
- Notifications Page (`/dashboard/notifications`): Completely redesigned with:
  - Per-type icons (MessageCircle for messages, ShoppingBag for orders, Star for reviews, UserPlus for follows, Heart for favorites).
  - Unread indicator dot on the left of each unread item.
  - Per-item delete button (appears on hover).
  - "Clear all" button to wipe all notifications at once.
  - "Mark all read" button when unread count > 0.
  - Better empty state copy.
- `NotificationBell` Dropdown: Upgraded with:
  - Per-type icons and color coding.
  - Unread dot per item.
  - Per-item delete button.
  - "View all" footer link.
  - Unread count badge.

## 2026-07-09 — Phase 5: Global Search

**What was built**
- Backend Search API: Created `search.controller.ts` with a single `GET /api/search?q=&type=` endpoint. Runs three parallel regex queries across `Product.title/description`, `Service.title/description`, and `User.name/username/bio`. Supports `?type=product|service|user` narrowing. Returns grouped `{ products, services, users }`. Registered as a public route in `app.ts`.
- Frontend API Layer: Created `search.api.ts` with `globalSearch(q, type?)` function.
- `/search` Page: Created `app/(main)/search/page.tsx` — a fully functional search results page with:
  - Live debounced fetching (300ms) as the URL `?q=` param changes.
  - Tab filter chips for All / Products / Services / People with live result counts.
  - Grouped results sections with thumbnail images, prices, ratings, and routing to detail pages.
  - Recent search history persisted to `localStorage` with clear capability.
  - Skeleton loaders and empty states.
- Navbar Upgrade: Replaced the old form (routed to `/products?q=`) with an upgraded `NavSearch` component featuring:
  - Live autocomplete dropdown (debounced 300ms, min 2 chars) showing up to 3 suggestions per category.
  - "See all results" footer link routing to `/search?q=...`.
  - Clear button to reset the query.
  - Works in both desktop nav and mobile drawer.

## 2026-07-09 — Phase 4: Marketplace Feed & Discovery

**What was built**
- Backend Feed API: Created `feed.controller.ts` with three Mongoose aggregations: latest active products, top-rated services, and top-rated active providers. Registered as `GET /api/feed` (public route) in `feed.routes.ts` and mounted in `app.ts`.
- Frontend API Layer: Created `feed.api.ts` with `fetchFeed()` and the `FeedData` type interface.
- Homepage Redesign: Replaced the Phase 2 shell with a fully live `page.tsx` that fetches from `GET /api/feed`. Three sections render dynamically: **Latest Products** (grid), **Featured Services** (grid), and **Top Rated Providers** (provider card grid). Shows skeleton loaders while loading and empty states when no data is available.
- `HeroSection` Component: Created `components/home/hero-section.tsx` — a vibrant hero with a gradient background, large headline, and a functional search bar that routes to `/products?q=...` or `/services?q=...`. Includes quick-search popular links.
- `ProviderCard` Component: Created `components/home/provider-card.tsx` — displays provider avatar, name, rating with stars, and top 3 skills as tags. Links directly to the provider's public profile.

## 2026-07-09 — Phase 3: Public Profile Upgrade

**What was built**
- Database/API Enhancements: Enhanced `getUserProfile()` in `user.controller.ts` to aggressively fetch and populate a user's active products, services, and received reviews to reduce client network waterfalls. Updated the frontend API client (`users.api.ts`) with new return signatures.
- Frontend Edit Mode: Upgraded `profile/edit/page.tsx` with dynamic form inputs and validation for `coverImageUrl`, `portfolioImages` (gallery upload array), `skills` (comma-separated), and `socialLinks` (mapped object). Connected the Cloudinary `/api/uploads` route for these new image types.
- Frontend Public Mode: Transformed the basic profile page (`profile/[username]/page.tsx`) into a professional freelancer portfolio. 
  - Restructured tabs to show Portfolio, Products, Services, and Reviews conditionally, directly rendering the pre-fetched listings from the API payload rather than invoking separate query hooks.
  - Added `PortfolioGallery` component: an interactive masonry-style layout with a modal lightbox.
  - Enhanced `ProfileHeader` component to include the user's cover image, verification badges, and added the `Response Time` stat.

## 2026-07-09 — Phase 2: Admin Module

**What was built**
- Database Models: Added `accountStatus` to `User.model.ts`. Created `ActivityLog.model.ts` for immutable audit trails and `Report.model.ts` for content moderation.
- Backend Admin API: Created `admin.controller.ts` and `admin.routes.ts` providing protected endpoints for dashboard statistics, user management (suspend, role changes), listing moderation, category CRUD, reports moderation, and activity log retrieval.
- Activity Logging Service: Built `activity.service.ts` to seamlessly write audit logs for every state-mutating admin action.
- Frontend Admin Shell: Developed `app/(admin)/layout.tsx` alongside `admin-nav.tsx` for a dedicated administration dashboard separate from the main user portal.
- Frontend Admin Interfaces: Implemented functional pages for Dashboard insights, User management, Listing moderation, Category CRUD, Reports moderation, and an Activity Log viewer. All pages handle fetching, updating, and error states elegantly using the new API client integrations.

## 2026-07-09 — Phase 1: Platform Infrastructure Upgrade

**What was built**
- Enhanced Backend Validation: Upgraded `auth.validators.ts` to strictly enforce SRS password complexity requirements (uppercase, lowercase, number, special char).
- Hardened Backend Error Handler: Updated `errorHandler.ts` to gracefully intercept Mongoose `ValidationError`, `CastError`, and MongoDB Duplicate Key exceptions (code 11000) and return standardized 400 Bad Request responses.
- Frontend Auth Sync: Synced the frontend Zod schema in `auth.schema.ts` with the new robust password rules so client-side feedback aligns with the backend constraints.
- Loading State Polish: Introduced explicit `<Skeleton>` loading states wrapped in `<Suspense>` via `loading.tsx` for core routes (`/dashboard` and `/profile/[username]`) to prevent layout shifts.

## 2026-07-02 — Phase 0: Foundation & Setup

**What was built**
- Monorepo scaffold: `frontend/` (Next.js 16, App Router, TypeScript,
  Tailwind v4) and `backend/` (Express, TypeScript, layered architecture),
  fully independent — separate `package.json`, separate `.env`.
- Design tokens (color/typography/spacing/radius) transcribed exactly from
  the SRS into `frontend/src/app/globals.css` using Tailwind v4's CSS-first
  `@theme` block, with a `.dark`/`.light` variable split so the theme toggle
  (built in Phase 2) has real values to switch between.
- Backend base: `server.ts`, `app.ts`, `config/db.ts` (Mongoose connection
  helper), `config/env.ts` (env validation), `GET /api/health`, error-handling
  middleware stub.
- Full documentation set: this log, `IMPLEMENTATION_PLAN.md`, `TASK.md`,
  `DATABASE.md`, `API.md`, `ROUTES.md`, `DESIGN_SYSTEM.md`, root `README.md`.

**Assumptions / decisions made (flagging per project rules)**
1. Framer Motion is now published as the `motion` package
   (`import from "motion/react"`) — the SRS says "Framer Motion" by name;
   used the current package since the old name is deprecated upstream.
2. Tailwind v4 uses CSS-first configuration (no `tailwind.config.ts` needed
   for tokens) — tokens live in `globals.css` via `@theme` instead, which is
   the current idiomatic approach for v4.
3. No shared npm workspace between frontend/backend — "separate folders with
   their respective technologies and node modules" was read literally as two
   fully independent projects, not a monorepo tool (Turborepo/Nx). Shared
   TypeScript types are duplicated by convention under `shared/types` as a
   reference, not symlinked/imported, to keep the two apps decoupled.
4. `node_modules` are intentionally **not** included in the delivered zip —
   they're regenerated by `npm install` and would otherwise bloat the
   download to hundreds of MB for no benefit. `package.json` in both apps is
   fully pinned so `npm install` reproduces the exact scaffold.
5. Wallet dashboard section (SRS says "if applicable") — left as an open
   question in `TASK.md`, to confirm scope before Phase 9.
6. No test suites written, per explicit instruction — engineering time spent
   entirely on implementation code.

**Not implemented yet**
Everything in Phases 1–10 of `IMPLEMENTATION_PLAN.md` — i.e. auth, design
system components, profiles, both marketplaces, orders/bookings/reviews,
messaging, notifications, dashboards/analytics, and the performance/
accessibility pass. See root `README.md` §5 for the full checklist.

**Next step**
Phase 1 — Authentication & Core Infrastructure. Waiting for approval to
proceed.

---

## 2026-07-03 — Phase 1: Authentication & Core Infrastructure

**What was built**
- `User` model with the full field contract from `DATABASE.md` — auth fields
  (`email`, `passwordHash`, `role`) live and enforced today; Phase-3 profile
  fields (`bio`, `skills`, `trustScore`, etc.) exist on the schema now so it
  doesn't reshape later, but stay empty until the profile edit flow ships.
- Full auth flow: register, login, logout, refresh, me. Access tokens (15m)
  and refresh tokens (7d) as HTTP-only, `SameSite=Lax` cookies; refresh
  tokens are rotated on every use and only a SHA-256 hash is stored on the
  user document (never the raw token).
- `requireAuth` / `requireRole(...roles)` middleware, and a generic Zod
  `validate()` middleware that writes parsed/defaulted values back onto
  `req` (so e.g. `role` defaulting to `"buyer"` on register actually reaches
  the controller).
- Cloudinary signed-upload endpoint (`POST /api/uploads/sign`) — clients
  will upload directly to Cloudinary using this signature starting Phase 3,
  so raw files never transit our API.
- Frontend: `AuthContext` (TanStack Query-backed — `me` query + login/
  register/logout mutations), `axios` client with `withCredentials: true`,
  `/login` and `/register` pages (React Hook Form + Zod), and a
  `ProtectedRoute` guard component ready for Phase 3/9 to consume.
- Forward-borrowed three Phase-2 primitives (Button, Input, Label) since the
  auth forms needed *something* — kept deliberately minimal so Phase 2
  extends rather than rewrites them.

**Assumptions / decisions made**
1. Tightened `config/env.ts`: `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET` now
   throw at boot if unset, per the Phase-0 log's own note that this would
   happen once auth became a hard dependency. `MONGO_URI` keeps its
   localhost dev fallback.
2. Password reset / email verification were not itemized in the SRS and
   require an email provider that isn't in the specified stack — left out
   of Phase 1, flagged in `TASK.md` for confirmation rather than assumed.
3. `ProtectedRoute` is built but intentionally unused by any page yet —
   there's no authenticated-only page until Phase 3 (profile edit). Building
   the guard now (vs. later) keeps auth infrastructure in one phase.
4. Refresh-token rotation invalidates the previous refresh token on every
   use (single active session per rotation chain) rather than allowing
   multiple concurrent refresh tokens per user — simpler and more secure by
   default; can be revisited if multi-device sessions are required.

**Not implemented yet**
Design system components beyond the 3 forward-borrowed primitives, app
shell/navigation, profiles, both marketplaces, orders/bookings/reviews,
messaging, notifications, dashboards/analytics, performance/accessibility
pass. See root `README.md` §5.

**Next step**
Phase 2 — Design System & App Shell. Waiting for approval to proceed.

---

## 2026-07-04 — Phase 2: Design System & App Shell

**What was built**
- Full component primitive set beyond the 3 forward-borrowed in Phase 1:
  Textarea, Select, Checkbox, Radio, Card (+ sub-parts), Badge, Chip, Tag,
  Avatar, Tooltip, Alert, Skeleton, EmptyState, Spinner, Modal, Drawer,
  DropdownMenu, Popover, Tabs, Breadcrumbs, Pagination, Accordion, Rating,
  ReviewCard. All built on the Phase 0 tokens (`bg-card`, `rounded-btn`,
  etc.) — no component hardcodes a color or radius value directly.
- App shell: `Navbar` (sticky, desktop inline nav + search, mobile Drawer
  menu, auth-aware profile dropdown), `Footer`, `ThemeToggle` (next-themes,
  class strategy set up in Phase 0), `FilterPanel` (structural shell only —
  takes categories/price/rating as props, no data baked in; not mounted on
  any page yet since Products/Services didn't exist until this phase's
  successor).
- Restructured routing: introduced a `(main)` route group with its own
  layout (Navbar + Footer) so `(auth)` pages can stay full-bleed without
  double-wrapping. Moved the homepage into `(main)/page.tsx` and rebuilt it
  for real (hero, value props, and an honest `EmptyState` for the
  marketplace sections that had no data yet at this point in the plan).

**Assumptions / decisions made**
1. The SRS describes "Top Utility Bar" and "Main Navigation" as two
   conceptually separate bars, but all three reference screenshots show them
   merged into one sticky row. Built it as one `Navbar` component to match
   the screenshots, which the SRS treats as the source of truth for visual
   design.
2. Tooltip/Popover/DropdownMenu are hand-rolled (CSS + `useState`/
   `useEffect`), not built on a headless-UI library — keeps the dependency
   list exactly what the SRS specified, at the cost of some positioning
   sophistication (no auto-flip/collision detection). Acceptable for a v1;
   revisit if a specific interaction breaks against a viewport edge.
3. `FilterPanel` built but deliberately left unmounted anywhere — same
   "build the infrastructure, wire it up when the data exists" pattern as
   `ProtectedRoute` in Phase 1.

**Not implemented yet**
Tables (TanStack Table) — no page needed a data grid yet. Messaging/Service/
Order/Notification cards — their respective phases. See root `README.md` §5.

---

## 2026-07-04 — Phase 3: User Profiles & Social Graph

**What was built**
- Added `username` to `User` (auto-generated from `name` at registration via
  a new `generateUniqueUsername` util — collision-safe, retries with a
  random numeric suffix). Threaded through `publicUser()`, the frontend
  `AuthUser` type, and the Navbar's profile links.
- `Follow` model + follow/unfollow endpoints with atomic
  `followerCount`/`followingCount` increments on both sides.
- `optionalAuth` middleware — the first endpoint that behaves differently
  for authenticated vs. anonymous callers (`isFollowedByMe` on the public
  profile response) without hard-requiring a session.
- Cloudinary avatar upload wired end-to-end on the frontend for the first
  time: `uploadImageToCloudinary()` calls the Phase-1 `/uploads/sign`
  endpoint, then posts directly to Cloudinary — confirms that piece of
  Phase 1 infrastructure actually works as designed.
- Public profile page (`ProfileHeader`, `ProfileAboutCard`, tabs for
  Products/Services/Reviews/Activity — all four tabs are `EmptyState`
  today since none of Orders/Services/Reviews exist yet) and a protected
  profile edit page.

**Assumptions / decisions made**
1. `API.md`'s Phase-0 draft had profile endpoints as `/users/:id`; switched
   to `/users/:username` for the public GET (cleaner URLs, matches
   `ROUTES.md`'s `/profile/[username]`) and added a separate
   `PATCH /users/me` for self-updates rather than `/users/:id`. Documented
   here rather than silently deviating from the original plan.
2. Social links are stored as a generic `{ platform, url }[]` on the model,
   but the edit form exposes exactly 5 fixed fields (website, linkedin,
   github, twitter, instagram) to match the icon set shown in the reference
   screenshot's "Connect with me" section, rather than a free-form repeater.

**Not implemented yet**
The Products/Services/Reviews tabs on a profile show real structure but
empty data — that's correct until Phases 4 (done)/5/6 exist. A "this
seller's own listings" endpoint for the Products tab specifically is
deferred to Phase 9 (dashboard) since it's really the same query the seller
dashboard needs.

---

## 2026-07-04 — Phase 4: Product Marketplace

**What was built**
- `Category`, `Product`, `Wishlist` models. Refactored slug generation out
  of the Phase-3 username util into a shared `slugify`/`ensureUniqueSlug`
  helper so Products (and Services, next) don't duplicate that logic.
- Full product API: list with filters (category, price range, condition,
  location substring, min rating, full-text `q` search via a Mongo text
  index) + sort (newest/price/rating) + server-side pagination; get-by-slug;
  related-products (same category); owner-scoped update/delete.
- Idempotent category seed script (`npm run seed`) — populates the 9
  categories shown in the reference screenshots (Electronics, Fashion, Home
  & Living, Beauty, Sports, Automotive, Books, Toys & Games, Others). This
  is seed data for the database, not hardcoded UI data — the frontend still
  only ever reads categories from `GET /api/categories`.
- Wishlist API + a heart-toggle button embedded directly in `ProductCard`
  and the product detail page (optimistic-feeling via query invalidation,
  not true optimistic UI yet — that's a Phase 10 pass).
- Frontend: `ProductCard` (badges for NEW/discount %, wishlist heart,
  seller row, rating, location — matches the screenshots), Products listing
  page (FilterPanel now actually mounted and wired to real categories +
  URL search params), Product detail page (gallery, seller card linking to
  the Phase-3 profile page, related products, an honest reviews
  empty-state), and a Categories index page.
- Updated the Phase-2 homepage: Browse Categories and Featured Products now
  render real API data; Featured Services stays an honest `EmptyState`
  until Phase 5 exists — nothing on the homepage is hardcoded.

**Assumptions / decisions made**
1. "Availability" was listed in the SRS's product filter set, but there's no
   booking/reservation concept for physical products (that's a Services
   concept) — a `stock` field exists on the model instead, and the
   Availability filter is not implemented for Products. Flagged rather than
   inventing a fake availability toggle.
2. Personalized "recommendations" (SRS mentions this alongside related
   products) are deferred — there's no order/view-history data yet to base
   a recommendation on. "Related products" (same category) is implemented
   as the honest subset of that requirement available today.
3. The seller-facing create/edit-listing *UI* is intentionally not built in
   this phase even though the backend CRUD is complete — per
   `ROUTES.md`/`IMPLEMENTATION_PLAN.md` that UI lives at
   `/dashboard/listings` in Phase 9. Building a throwaway form now that gets
   replaced in Phase 9 would violate the "no wasted work" spirit of the
   phased approach.

**Not implemented yet**
Service Marketplace (Phase 5), Orders/Bookings/Reviews (Phase 6),
Messaging (Phase 7), Notifications (Phase 8), Dashboards/Analytics
(Phase 9), Performance/Accessibility pass (Phase 10). See root `README.md`
§5 for the full requirement-level checklist.

**Next step**
Phase 5 — Service Marketplace. Waiting for approval to proceed.

---

## 2026-07-04 — Phase 5: Service Marketplace

**What was built**
- `ServiceCategory`, `Service` (embedded `packages[]` + a denormalized
  `startingPrice` recomputed on every save via a pre-save hook — needed
  because a service has no single "the" price, but sort/filter-by-price
  needs one comparable number), `Availability`, `Booking` models.
- Full service API mirroring the product API almost exactly: list with
  filters (category, price via `startingPrice`, location, min rating, a
  `maxDeliveryDays` filter using `$elemMatch` against the packages array to
  match the screenshot's "Delivery Time" filter, full-text `q` search) +
  sort + pagination; get-by-slug; related-services; owner-scoped
  update/delete.
- Availability API nested under the service route
  (`GET/PUT /services/:slug/availability`) — resolves to the *provider's*
  single `Availability` document (one per provider, not per service, since
  a provider's calendar is shared across all their services).
- Booking API: `POST /bookings` snapshots the chosen package onto the
  booking (so a later price change on the service doesn't retroactively
  change a pending booking), `PATCH /bookings/:id/status` enforces who can
  do what (only the provider can accept/decline/complete; either party can
  cancel).
- Service category seeding folded into the existing `npm run seed` script
  (Design & Creative, Web Development, Writing & Translation, Digital
  Marketing, Video & Animation, Music & Audio, Programming & Tech,
  Business, Lifestyle, Other — matching the reference screenshot).
- Frontend: `ServiceCard`, `BookingModal` (package radio-select + optional
  date/notes, calls the booking API), Services listing page (same
  `FilterPanel` shell from Phase 4, swapping the Condition filter for
  Delivery Time), Service detail page (packages grid, provider card,
  related services, honest reviews empty-state). Homepage's Featured
  Services section went from empty-state to real data.
- **Retrofit while here**: added `seller`/`provider` username filters to
  the Phase 4/5 list endpoints (resolves the username to an ObjectId
  server-side, returns an empty result set rather than a 404 if the
  username doesn't exist) and wired the Phase 3 profile page's
  Products/Services tabs to them. Those tabs were left as empty-states in
  Phase 3/4 because the "list a specific seller's products" capability
  didn't exist yet; it does now, so the gap is closed rather than deferred
  again to Phase 9.

**Assumptions / decisions made**
1. Portfolio images for providers reuse the `User.portfolioImages` field
   from Phase 3 rather than a new Service-level gallery — the SRS lists
   "Portfolio" once, under both Profiles and Services, and one field
   serves both without duplication.
2. Booking status transitions are enforced narrowly (provider-only for
   accept/decline/complete, either party for cancel) rather than a full
   state-machine library — five states with these rules don't need one.

**Not implemented yet**
Orders (product purchases — separate from Bookings), Reviews, Messaging,
Notifications, Dashboards/Analytics, Performance/Accessibility pass. See
root `README.md` §5.

**Open question for Taha** (also in TASK.md): the SRS doesn't specify a
shopping cart for products. Phase 6 will build `Order` as one order per
"Buy Now" click rather than a multi-item cart, since that's what's
actually written in the SRS. Flag now if a cart is actually wanted —
it changes Phase 6's scope materially.

**Next step**
Phase 6 — Orders, Bookings & Reviews. Proceeding per the "verify, then
continue" instruction — see the top of this entry's checks in TASK.md.

---

## 2026-07-04 — Phase 6: Orders, Bookings & Reviews

**What was built**
- `Order` model — deliberately one product per order ("Buy Now" semantics),
  per the assumption flagged at the end of Phase 5 and left unchallenged.
  Snapshots the product's title/price/image at purchase time so later
  edits to the product don't rewrite history.
- `Review` model supporting three target types — `product`, `service`,
  **and `user`** (the last one is what the reference screenshot's
  "Average Ratings 4.8 (128 Reviews)" profile widget actually needs — a
  review of the seller/provider as a person, not of a specific listing).
  Added `ratingAvg`/`ratingCount` to `User` to hold that aggregate.
- A single shared `recomputeRating()` util re-aggregates a target's rating
  from its reviews via a Mongo `$avg`/`$sum` pipeline — used identically
  whether the target is a Product, Service, or User, so there's one rating
  algorithm in the whole codebase, not three copies.
- Review creation is eligibility-checked server-side: a review must
  reference a real `order` or `booking` where the reviewer was the buyer,
  the transaction wasn't cancelled/declined, and the target actually
  matches that transaction (can't review a random product using someone
  else's order). A unique index also blocks duplicate reviews of the same
  target from the same order/booking.
- Two small "eligibility lookup" endpoints (`GET /orders/my-order`,
  `GET /bookings/my-booking`) let the frontend ask "did I buy/book this?"
  without needing a full order-history page to exist yet — that page is
  Phase 9's `/dashboard/orders`.
- PDF invoice generation via `pdf-lib` (`GET /orders/:id/invoice`) — a real
  Phase-0-specified dependency getting its first actual use.
- Frontend: `BuyNowModal` (address → order → invoice link),
  reusable `ReviewForm` (drives product reviews, service reviews, and
  "Rate the Seller"/"Rate the Provider" from the same component by varying
  `targetType`/`targetId`). Wired real reviews into the Product detail
  page, Service detail page, and — going back to close a gap — the Phase 3
  profile page's Reviews tab, which had been an empty-state placeholder
  since it was built. `ReviewCard` (built in Phase 2, unused until now)
  gets its first real data.
- `ProfileHeader` gained a Rating stat next to Trust Score.

**Assumptions / decisions made**
1. **Order = one product per order, no cart.** The SRS's Product
   Marketplace section lists Wishlist, Reviews, Ratings, and Orders as
   separate bullet points with no mention of a cart. Building a cart would
   be a materially larger, uninstructed scope addition, so `Order` maps
   1:1 to a single "Buy Now" click. Documented as an open question in
   `TASK.md`; proceeding since a real SRS requirement (Orders) needs
   *something* built and the simpler, spec-accurate interpretation is the
   right default absent a correction.
2. Reviews of a person (`targetType: "user"`) reuse the exact same
   `Review` document shape and the same `recomputeRating()` function as
   product/service reviews — no separate "feedback" concept was invented.
3. Deliberately did **not** add Orders/Bookings as profile-page tabs even
   though one reference screenshot shows them there — the SRS's own
   Navigation Structure section assigns Orders/Bookings to the Dashboard
   (private, self-only data), while Products/Services/Reviews are public
   and correctly belong on both the profile and the dashboard. Following
   the SRS's text over one screenshot's specific tab set where they
   disagree, per the project's own conflict-resolution rule.
4. Review eligibility is intentionally not gated on `"delivered"`/
   `"completed"` status — it's gated on "not cancelled/declined" instead.
   Requiring `"delivered"` would make reviews impossible to test until
   Phase 9 builds the seller-side status-update UI; the looser gate is
   still a real gate (you must have a real order/booking) and gets
   tightened trivially later if wanted.

**Not implemented yet**
Messaging, Notifications, Dashboards/Analytics, Performance/Accessibility
pass. See root `README.md` §5.

**Next step**
Phase 7 — Real-Time Messaging.

---

## 2026-07-04 — Phase 7: Real-Time Messaging

**What was built**
- Socket.io server authenticated off the same `accessToken` HTTP-only
  cookie the REST API uses (parsed from `socket.handshake.headers.cookie`)
  — no separate token scheme for sockets. Each connected socket joins a
  `user:<id>` room; since the SRS only calls for 1:1 messaging (no group
  chats), per-user rooms are sufficient and simpler than per-conversation
  rooms plus membership tracking.
- `Conversation` (participants, lastMessage, per-user `unreadCounts` map)
  and `Message` (type: text/image/file/voice, `readBy[]`, text-indexed
  `content` for search) models.
- `message.service.ts` centralizes "what happens when a message is sent"
  (persist, update conversation lastMessage/unreadCounts) so the Socket.io
  handler and the REST fallback endpoint call the exact same function
  instead of maintaining two copies of that logic.
- Typing indicators and read receipts as plain socket events
  (`message:typing`, `message:read`); online presence as an in-memory
  `Map<userId, Set<socketId>>` — correct for a single Node process, and
  explicitly flagged in `TASK.md` as a limitation if this ever runs
  multi-instance (would need a Redis-backed Socket.io adapter, which isn't
  in the SRS's specified stack).
- REST endpoints for everything that needs to work before any socket
  message exists: list conversations (with computed unread count and live
  presence lookup), get-or-create a 1:1 conversation by username, paginated
  message history with an optional `q` full-text search param.
- Frontend: a lazy Socket.io client singleton (`lib/socket.ts`);
  `useConversations`/`useConversationMessages` hooks that fetch via
  TanStack Query and layer live socket events on top (new message appends
  to the cached array; `message:new`/`message:read` invalidate the
  conversation list so unread counts and previews stay current);
  `ConversationList`, `MessageBubble`, `MessageThread`, `MessageComposer`
  components; a full messaging workspace at `/dashboard/messages`.
- Voice messages: recorded client-side with the browser's `MediaRecorder`
  API (`useVoiceRecorder`), uploaded to Cloudinary as `resource_type=auto`
  (which also now backs image/file attachments — generalized the Phase 3
  avatar-upload helper into `uploadToCloudinary(file, folder, resourceType)`
  rather than writing a second upload function).
- Closed a real gap: every "Message" button built in earlier phases
  (product seller card, service provider card, profile header) was inert
  — clicking it did nothing. Built one `MessageButton` component
  (create-or-get conversation, then navigate) and swapped it in everywhere,
  rather than duplicating that logic per page.
- The Navbar's Messages icon (built Phase 2, never wired to data) now shows
  a real unread-count badge, same pattern the Notifications bell will use
  in Phase 8.

**Assumptions / decisions made**
1. 1:1 conversations only — the SRS's Messaging section doesn't mention
   group chats, so `Conversation.participants` isn't designed for >2
   people even though nothing technically stops a future extension.
2. REST `POST /conversations/:id/messages` exists as a documented fallback
   but the frontend always uses the socket path — REST is there for
   resilience/completeness against the original `API.md` draft, not
   because the UI needs it today.
3. Presence is best-effort and process-local, not a durable "last seen"
   audit trail — `User.lastSeenAt` (schema field from Phase 1) isn't
   currently updated on disconnect; could be added cheaply if wanted, but
   nothing in the SRS asked for a persisted last-seen timestamp
   specifically, only "online status" which the presence map already covers.

**Not implemented yet**
Notifications, Dashboards/Analytics, Performance/Accessibility pass. See
root `README.md` §5.

**Next step**
Phase 8 — Notifications.

---

## 2026-07-04 — Phase 8: Notifications

**What was built**
- `Notification` model matching the SRS's exact category list
  (message/order/review/favorite/system/payment/follow), with `targetUrl`
  for click-through navigation.
- One `createNotification()` service function that every trigger calls —
  persists the record and pushes it live over the Phase 7 `user:<id>`
  socket room. A small `sockets/io-instance.ts` module holds a reference
  to the `io` server (set once in `server.ts`) so services created before
  the server boots can still emit without an import cycle back into
  `server.ts`.
- Real triggers wired into every controller that has a genuine
  corresponding action — not a generic "fire on everything" approach:
  - New follower → `user.controller.followUser`
  - New review (product/service/**user** target) → `review.controller.createReview`
  - New order + order status change → `order.controller`
  - New booking request + booking status change → `booking.controller`
  - New message → `message.service.createMessage`
  - New wishlist favorite → `wishlist.controller.addToWishlist`
  Each notifies the *other* party, never the person who took the action
  (e.g. a buyer cancelling their own order notifies the seller, not the
  buyer themselves — checked explicitly in `order.controller` and
  `booking.controller`).
- `GET /notifications` returns items + `unreadCount` in a single response
  (avoids a second round-trip just for the badge number).
- Frontend: `useNotifications` (TanStack Query + a socket listener that
  invalidates on `notification:new`), `NotificationBell` (dropdown on the
  Navbar — the bell icon built in Phase 2 finally has real data), and a
  full `/dashboard/notifications` history page.

**Assumptions / decisions made**
1. Booking notifications use the `"order"` type rather than adding a
   separate `"booking"` category — the SRS's own notification category
   list doesn't include "booking" as distinct from "order," so bookings
   are treated as the service-side equivalent of an order for
   notification purposes. Documented rather than silently invented.
2. `"system"` and `"payment"` notification types exist in the schema (so
   the category enum matches the SRS exactly) but have no live trigger —
   there's no system-generated event (e.g. scheduled maintenance) or
   payment gateway in the app to originate them from. Building an unused
   category is fine; building a fake trigger just to populate it would
   have been inventing functionality, which the project's own rules say
   not to do.
3. Kept the dropdown (Navbar) and the full page (`/dashboard/notifications`)
   as two separate, small components rather than one shared "notification
   list" abstraction — the dropdown needs to be compact and dismiss-on-click,
   the full page needs to be scannable; forcing one component to do both
   would have made both worse.

**Not implemented yet**
Dashboards/Analytics, Performance/Accessibility pass. See root `README.md` §5.

**Next step**
Phase 9 — Dashboards & Analytics.

---

## 2026-07-04 — Phase 9: Dashboards & Analytics

**What was built**
- Dashboard shell: one `(main)/dashboard/layout.tsx` now wraps every
  `/dashboard/*` route in a single `ProtectedRoute` plus navigation
  (desktop sidebar / mobile horizontal tabs, role-aware — "Listings" only
  shows for seller/provider/admin). The Phase 7 Messages page and Phase 8
  Notifications page were refactored to drop their own now-redundant
  `ProtectedRoute` wrappers and resized to fit inside this shell instead of
  standing alone full-viewport.
- `GET /dashboard/analytics`: real Mongo aggregation pipelines (no mock
  data) — revenue by day (last 30 days), orders/bookings grouped by
  status, top 5 products/services by revenue. One endpoint serves every
  role; the frontend conditionally renders the seller section (role is
  seller/admin) and provider section (role is provider/admin), so a buyer
  simply doesn't see empty revenue charts rather than the backend faking
  a role check.
- `GET /dashboard/activity`: a merged, sorted timeline built from existing
  Orders/Bookings/Reviews/Follows collections — deliberately **not** a new
  stored `Activity` model, since that would duplicate data that already
  exists elsewhere and require keeping two copies in sync.
- **The big one**: `/dashboard/listings` finally gives the Product/Service
  CRUD backend (ready since Phases 4/5) a real UI — `ProductFormModal` and
  `ServiceFormModal` (the latter with a dynamic, add/remove pricing-package
  editor), both with Cloudinary image upload, wired into a `DataTable`
  built on TanStack Table (first real use of that Phase-0-specified
  dependency) with edit/delete actions.
- `/dashboard/orders` and `/dashboard/bookings`: tabbed (purchases/sales,
  made/received) `DataTable`s; the seller/provider side gets a live status
  dropdown (`PATCH .../status`, built Phase 6), the invoice download link
  (pdf-lib, built Phase 6) is now reachable from a permanent page instead
  of only right after a Buy Now click.
- `/dashboard/saved` (wishlist, reuses `ProductCard` unchanged),
  `/dashboard/reviews` (received via `GET /reviews?targetType=user`, given
  via the new `GET /reviews/mine`), `/dashboard/activity`,
  `/dashboard/calendar`, `/dashboard/settings` (account summary + a new
  `PATCH /auth/change-password` endpoint + logout).
- Navbar's profile dropdown now includes a real "Dashboard" link.

**Assumptions / decisions made**
1. **Wallet: skipped, not built.** This was flagged as an open question at
   the end of Phases 6, 8, and again at the top of Phase 9's own planning
   — three separate opportunities to correct course, none taken. There is
   no payment gateway, currency balance, or transaction-ledger concept
   anywhere in the app; building a "Wallet" page would mean either faking
   a balance (inventing functionality, against the project's own rules)
   or shipping an empty shell with no purpose. Skipping it is the
   defensible default; it's a small, additive page to add later if a real
   payment integration is scoped.
2. **Calendar as a list, not a grid.** The SRS names "Calendar" as one
   dashboard section with no further specification. A full month-grid,
   drag-to-reschedule calendar widget is a substantial standalone
   component; a date-sorted list of upcoming bookings delivers the actual
   need (see what's coming up) without that detour. This is the same
   "adapt the UI while preserving the underlying functionality" principle
   used earlier for the Filter Panel and other shell components.
3. `/dashboard/activity` computes its feed live from existing collections
   on every request rather than maintaining a denormalized activity log.
   Simpler, always-consistent, and fast enough at this scale (capped at
   10 documents per source collection, 20 total after merge/sort); would
   need revisiting only at a scale where these lookups became a real cost.
4. Analytics intentionally is not gated by role at the API layer — one
   authenticated user can only ever aggregate over documents where they
   are the `seller`/`provider`/`buyer`, so there's no cross-account data
   exposure risk in serving one unified endpoint regardless of role.

**Not implemented yet**
Performance/Accessibility pass (Phase 10 — the final planned phase).

**Next step**
Phase 10 — Performance, Accessibility & Polish.

---

## 2026-07-05 — Phase 10: Performance, Accessibility & Polish (final phase)

**What was built**
- **Infinite scroll**: Products and Services listing pages moved from
  click-through `Pagination` to `useInfiniteQuery` + an `IntersectionObserver`
  sentinel, with a manual "Load more" button as a fallback for anyone whose
  observer doesn't fire (and for keyboard/assistive-tech users who'd rather
  click than scroll-trigger). The `Pagination` component itself wasn't
  deleted — it's still a real, working design-system component, just not
  currently consumed by these two pages.
- **Real optimistic updates**: rebuilt `useWishlistMutation` and
  `useFollowMutation` around `onMutate`/`onError` instead of "mutate then
  invalidate." The wishlist version is the more interesting one — it
  patches `isWishlisted` across every cache shape that might hold the
  product (the single-product cache, plain paginated list responses, *and*
  the new infinite-query `{ pages: [...] }` shape), because a product can
  legitimately be visible in more than one of those at once.
- **Code-splitting**: `ProductFormModal`, `ServiceFormModal`, `BuyNowModal`,
  and `BookingModal` are now `next/dynamic(..., { ssr: false })`. All four
  carry meaningful logic (Cloudinary upload, dynamic package editing, order/
  booking creation) that the majority of visitors to a product/service page
  never trigger.
- **Memoization**: `ProductCard`, `ServiceCard`, `MessageBubble` wrapped in
  `React.memo` — all three render inside loops of potentially unbounded
  size (infinite-scrolled grids, chat threads), and their props are stable
  object references across unrelated parent re-renders, so memoization is a
  genuine win here rather than premature optimization.
- **Debounced search — closing a real gap**: `IMPLEMENTATION_PLAN.md`
  scoped "Global product search (debounced)" to Phase 4, but Phase 4 only
  ever built the Navbar's submit-on-Enter search bar. This phase's audit
  caught the gap and built a real `useDebouncedValue` hook (400ms) wired
  into a visible search input on both the Products and Services listing
  pages — typing updates local state instantly, but the URL param (and
  therefore the API call) only updates after typing pauses.
- **Fixed a dead link**: the Navbar search submitted to `/search?q=`, a
  page that was never built (it's `⬜` in `ROUTES.md` — full cross-entity
  search across products/services/people would need new backend work,
  out of scope for a polish phase). Changed it to `/products?q=`, which
  works today, rather than leaving a 404 in a shipped product.
- **Accessibility — a real audit, not a checklist tick**:
  - Built a shared `useFocusTrap` hook (cycles Tab/Shift+Tab within the
    container, moves focus in on open) and wired it into `Modal` and
    `Drawer` — previously, a keyboard user tabbing through an open modal
    could tab straight into the page behind it.
  - `Popover` was missing Escape-to-close (Modal/Drawer/DropdownMenu all
    had it already) — added for consistency.
  - **Computed actual WCAG contrast ratios** for every text/background
    pairing in the app rather than assuming the palette was compliant
    because it looked fine. Found three real failures: white text on the
    primary-accent button/badges (3.56:1), on danger badges (3.82:1), and
    on success badges (2.75:1) — all below the 4.5:1 AA threshold for
    normal-size text. Fixed by adding a new fixed `--color-ink` token
    (`#181716`, independent of the light/dark theme so it can't
    accidentally flip to a light color) and applying it everywhere text
    sits on a solid accent/semantic background — buttons, badges, chat
    bubbles, the logo mark, unread-count pills, pagination's active page.
    Full before/after numbers are in `DESIGN_SYSTEM.md`'s new Contrast
    Audit section, including the one pairing (`Button` `secondary`
    variant) that couldn't be cleanly fixed without deviating from the
    SRS-specified palette — flagged rather than hidden, and confirmed
    unused anywhere in the app today.
  - Confirmed the Phase 0 `prefers-reduced-motion` CSS rule (disables
    animation/transition duration globally) still covers every transition
    added in the nine phases since — nothing new bypasses it.

**Assumptions / decisions made**
1. Infinite scroll replaces pagination on Products/Services rather than
   the two coexisting on the same page — the SRS lists both under
   "Performance" as techniques, not as two required simultaneous UI
   patterns on one page. `Pagination` stays in the design system for
   wherever page-jumping genuinely matters more (e.g. a future admin view).
2. Global cross-entity search (`/search`, products + services + people in
   one result set) stays `⬜` — building it properly needs a new backend
   endpoint aggregating across three collections, which is new-feature
   work, not the audit-and-fix work this phase is scoped for. The
   dead-link fix (redirect to the working Products search) removes the
   immediate user-facing problem without pretending the fuller feature
   exists.
3. Chose to *not* touch the SRS-specified brand colors themselves to fix
   the one residual contrast gap (`secondary` button variant) — inventing
   a new shade to hit 4.5:1 would mean deviating from a client-specified
   palette on my own authority. Documented instead, consistent with how
   every other ambiguous call in this project got handled.

**Not implemented — final, complete list, all deliberate**
- CI/lint/format tooling (never requested; hand-consistent formatting throughout)
- Forgot-password / email verification flow (needs an email provider outside the SRS stack)
- Wallet dashboard section (no payment gateway anywhere in the app)
- Full cross-entity `/search` page (see above)
- `Button` `secondary` variant's contrast (4.44:1, unused, palette-constrained)

**This was the last planned phase.** All 10 phases in `IMPLEMENTATION_PLAN.md`
are complete. See root `README.md` §5 for the fully reviewed, end-to-end
requirements checklist.

---

## 2026-07-08 — Phase 11: Static Content Expansion

**What was built**
- **About Page** (`/about`): A premium, minimally designed page explaining the platform's mission, values, and features using the existing design language. Contains mock platform statistics and a timeline of how Nexora works.
- **Contact Page** (`/contact`): A comprehensive contact page including contact information cards, an FAQ accordion, an office location placeholder, and a fully functional client-side validated contact form.
- **Form Validation**: Created `frontend/src/lib/validators/contact.schema.ts` using Zod for robust client-side validation of the contact form.

**Components Reused**
- `Button`, `Input`, `Textarea`, `Select`, `Label`, `Accordion` from the existing `ui` component library.
- Used `@theme` spacing, radius, and color tokens consistently.

**Future Improvements**
- Connect the contact form to a backend email provider to actually send emails.
- Replace mock platform statistics on the About page with real aggregations from the backend once at scale.
