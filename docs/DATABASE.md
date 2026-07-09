# Nexora — Database Schema Catalogue (MongoDB / Mongoose)

Status: `User`, `Follow`, `Category`, `Product`, `Wishlist` (Phases 1/3/4),
`ServiceCategory`, `Service`, `Availability`, `Booking` (Phase 5),
`Order`, `Review` (Phase 6), `Conversation`, `Message` (Phase 7),
`Notification` (Phase 8) ✅ implemented. Everything below that is still
⬜ planned. This document is the contract every model implementation must
follow so the API/frontend docs stay consistent with what actually gets
built.

## User ✅ (Phase 1, extended Phase 3)
```
email, username, passwordHash, role: buyer|seller|provider|admin,
name, avatarUrl, coverImageUrl, bio, location, contact { phone, email },
skills: string[], socialLinks: { platform, url }[],
portfolioImages: string[], trustScore: number, badges: string[],
verificationStatus: unverified|pending|verified, accountStatus: active|suspended|deleted,
responseTimeMinutes: number, completionRate: number,
followerCount, followingCount, joinedAt, lastSeenAt, ratingAvg, ratingCount,
refreshTokenHash, refreshTokenExpiresAt, timestamps
```

## Follow ✅ (Phase 3)
`follower: User, following: User, timestamps` — unique compound index on
(follower, following).

## Category ✅ (Phase 4) / ServiceCategory ✅ (Phase 5)
`name, slug, icon, parent: Category|null, order`

## Product ✅ (Phase 4)
```
seller: User, title, slug, description, category: Category, price, compareAtPrice,
condition: new|like_new|used|refurbished, images: string[],
location, stock, ratingAvg, ratingCount, status: active|draft|sold,
timestamps
```

## Wishlist ✅ (Phase 4)
`user: User, product: Product, timestamps` — unique compound index.

## Service ✅ (Phase 5)
```
provider: User, title, slug, description, category: ServiceCategory,
packages: [{ name, price, deliveryDays, features: string[] }],
startingPrice: number (denormalized min(packages.price), recomputed on save),
images: string[], location, ratingAvg, ratingCount, status: active|draft,
timestamps
```

## Availability ✅ (Phase 5)
`provider: User (unique), recurringSlots: [{ dayOfWeek, startTime, endTime }],
blockedDates: Date[]` — one document per provider (shared across all their
services), not one per service.

## Booking ✅ (Phase 5/6)
```
service: Service, package (embedded snapshot at booking time — a later price
change on the service doesn't retroactively change a pending booking),
buyer: User, provider: User,
status: pending|accepted|declined|completed|cancelled,
scheduledDate, notes, timestamps
```

## Order ✅ (Phase 6)
```
buyer: User, seller: User, product: Product,
productSnapshot: { title, price, image } (snapshot at purchase time),
quantity: number, total: number,
status: pending|confirmed|shipped|delivered|cancelled|refunded,
shippingAddress, timestamps
```
Deliberately one product per order ("Buy Now"), not a multi-item cart —
see `IMPLEMENTATION_LOG.md` Phase 6 for why.

## Review ✅ (Phase 6)
```
author: User, targetType: product|service|user, targetId,
order: Order|null, booking: Booking|null,
rating: 1-5, comment, timestamps
```
On create: `recomputeRating()` re-aggregates `ratingAvg`/`ratingCount` on
whichever collection `targetType` points to (`Product`, `Service`, or
`User`) from all of that target's reviews. Creation is eligibility-checked
against the referenced order/booking (see `review.controller.ts`) and a
unique index blocks duplicate reviews of the same target from the same
transaction.

## Conversation ✅ (Phase 7)
`participants: User[] (exactly 2 — 1:1 only, no group chats in the SRS),
lastMessage: Message, lastMessageAt: Date,
unreadCounts: Map<userId, count>, timestamps`

## Message ✅ (Phase 7)
```
conversation: Conversation, sender: User,
type: text|image|file|voice, content, attachmentUrl,
readBy: User[], timestamps (createdAt only, no updatedAt — messages aren't edited)
```
Text-indexed on `content` for the in-conversation search feature.

## Notification ✅ (Phase 8)
```
recipient: User, type: message|order|review|favorite|system|payment|follow,
title, body, targetUrl, isRead: boolean, timestamps (createdAt only)
```
`system`/`payment` exist in the enum but have no live trigger yet — see
`IMPLEMENTATION_LOG.md` Phase 8.

## Activity — deliberately not a model (Phase 9)
The dashboard's Activity feed (`GET /dashboard/activity`) is computed on
each request by merging and sorting recent documents from `Order`,
`Booking`, `Review`, and `Follow` — there's no `Activity` collection. This
avoids duplicating data that already lives elsewhere and keeps it always
consistent with the source records. See `IMPLEMENTATION_LOG.md` Phase 9.

## ActivityLog ✅ (Phase 2)
*(Immutable audit trails for admin actions)*
`actor: User, action: string, targetModel, targetId, previousValue, newValue, ipAddress, userAgent, createdAt`

## Report ✅ (Phase 2)
*(Content moderation queue)*
`reporter: User, targetType: product|service|user|review|message, targetId, reason, description, status: pending|resolved|dismissed, adminNotes, resolvedBy: User, resolvedAt, timestamps`

## Indexing notes (applied as each model ships)
- Text index on `Product.title/description` and `Service.title/description`
  for search.
- Compound index `(category, price)` on `Product` for filter performance.
- `(recipient, isRead, createdAt)` on `Notification` for the unread-badge
  query.
- `(conversation, createdAt)` on `Message` for pagination.
