# Nexora — API Catalogue

Base URL: `http://localhost:5000/api` (dev). All request/response bodies are
JSON. Auth via HTTP-only cookies (`accessToken`, `refreshToken`); no bearer
tokens in headers by default. Status column: ⬜ planned · ✅ implemented.

| Status | Method | Path | Auth | Description |
|---|---|---|---|---|
| ✅ | GET | `/health` | none | Liveness check |
| ✅ | POST | `/auth/register` | none | Create account |
| ✅ | POST | `/auth/login` | none | Login, sets cookies |
| ✅ | POST | `/auth/logout` | session | Clears cookies |
| ✅ | POST | `/auth/refresh` | refresh cookie | Rotates access + refresh token |
| ✅ | GET | `/auth/me` | session | Current user |
| ✅ | PATCH | `/auth/change-password` | session | Change password (requires current password) |
| ✅ | POST | `/uploads/sign` | session | Cloudinary signed upload params |
| ✅ | GET | `/users/:username` | `optionalAuth` | Public profile (`isFollowedByMe` if signed in) |
| ✅ | PATCH | `/users/me` | session | Update own profile (was `/users/:id` in the Phase-0 draft — see IMPLEMENTATION_LOG.md) |
| ✅ | POST/DELETE | `/users/:username/follow` | session | Follow / unfollow |
| ✅ | GET | `/categories` | none | Product categories (seed with `npm run seed`) |
| ⬜ | GET | `/service-categories` | none | Service categories tree |
| ✅ | GET | `/products` | none | List + filter (category/price/condition/location/rating/`q`) + sort + paginate |
| ✅ | POST | `/products` | role: seller/admin | Create |
| ✅ | GET | `/products/:slug` | `optionalAuth` | Read (+ `isWishlisted` if signed in) |
| ✅ | PATCH/DELETE | `/products/:slug` | owner or admin | Update / delete |
| ✅ | GET | `/products/:slug/related` | none | Related products (same category) |
| ✅ | GET | `/products?seller=` | none | Filter by seller username (added Phase 5, powers profile Products tab) |
| ✅ | GET | `/wishlist` | session | List mine |
| ✅ | POST/DELETE | `/wishlist/:productId` | session | Add / remove |
| ✅ | GET | `/service-categories` | none | Service categories (seed with `npm run seed`) |
| ✅ | GET | `/services` | none | List + filter (category/price/location/rating/`maxDeliveryDays`/`q`/`provider`) + sort + paginate |
| ✅ | POST | `/services` | role: provider/admin | Create |
| ✅ | GET | `/services/:slug` | none | Read |
| ✅ | PATCH/DELETE | `/services/:slug` | owner or admin | Update / delete |
| ✅ | GET | `/services/:slug/related` | none | Related services (same category) |
| ✅ | GET | `/services/:slug/availability` | none | Provider's availability calendar |
| ✅ | PUT | `/services/:slug/availability` | owner | Update own availability |
| ✅ | POST | `/bookings` | session | Create booking request (snapshots the chosen package) |
| ✅ | GET | `/bookings` | session | List mine (buyer or provider view) |
| ✅ | PATCH | `/bookings/:id/status` | session, role-checked | Accept/decline/complete (provider only) / cancel (either party) |
| ✅ | POST | `/orders` | session | Place order ("Buy Now" — one product per order) |
| ✅ | GET | `/orders` | session | List mine (buyer or seller view) |
| ✅ | GET | `/orders/my-order?product=` | session | Does the caller have an eligible order for this product? |
| ✅ | PATCH | `/orders/:id/status` | seller (cancel: either party) | Update status |
| ✅ | GET | `/orders/:id/invoice` | buyer or seller | PDF invoice (pdf-lib) |
| ✅ | POST | `/reviews` | session, eligibility-checked | Create review (product/service/**user** target) |
| ✅ | GET | `/reviews?targetType=&targetId=` | none | List for a target, paginated |
| ✅ | GET | `/reviews/mine` | session | Reviews I've authored |
| ✅ | GET | `/bookings/my-booking?service=` | session | Does the caller have an eligible booking for this service? |
| ✅ | GET | `/conversations` | session | List mine (with live presence + unread count) |
| ✅ | POST | `/conversations` | session | Get-or-create by `{ username }` |
| ✅ | GET | `/conversations/:id/messages` | session | Paginated history, optional `?q=` full-text search |
| ✅ | POST | `/conversations/:id/messages` | session | REST fallback (primary path is the `message:send` socket event) |
| ✅ | GET | `/notifications` | session | List mine + unreadCount, paginated |
| ✅ | PATCH | `/notifications/:id/read` | session | Mark one read |
| ✅ | PATCH | `/notifications/read-all` | session | Mark all read |
| ✅ | GET | `/dashboard/analytics` | session | Role-agnostic aggregates for Recharts (frontend hides irrelevant sections per role) |
| ✅ | GET | `/dashboard/activity` | session | Merged timeline from Orders/Bookings/Reviews/Follows (computed, not stored) |
| ⬜ | GET | `/search?q=` | none | Cross-entity search (products/services/people) |

## Socket.io Events ✅ (Phase 7)
Handshake authenticates off the same `accessToken` cookie as the REST API;
each socket joins a `user:<id>` room.
- `message:send` (client → server, ack-based) / `message:new` (server → both participants)
- `conversation:join` (client joins a `conversation-typing:<id>` room for scoped typing broadcasts)
- `message:typing` (bidirectional — relayed to the other participant only)
- `message:read` (client → server; server relays to the other participant so read receipts update live)

## Socket.io Events ✅ (Phase 8)
- `notification:new` (server → recipient's `user:<id>` room, no new namespace)
