# Nexora — Frontend Route Map (Next.js App Router)

Status: ⬜ planned · ✅ implemented. Routes live under `frontend/src/app`.

## Public
| Status | Route | Notes |
|---|---|---|
| ✅ | `/` | Real homepage (Phase 2 shell + Phase 4 live Products/Categories data) |
| ✅ | `/products` | Product marketplace + left filter panel |
| ✅ | `/products/[slug]` | Product detail |
| ✅ | `/services` | Service marketplace + left filter panel (Delivery Time instead of Condition) |
| ✅ | `/services/[slug]` | Service detail (packages, BookingModal, related services) |
| ✅ | `/categories` | Category directory |
| ✅ | `/profile/[username]` | Public profile |
| ✅ | `/about` | Static |
| ✅ | `/contact` | Static + form |
| ✅ | `/search` | Global cross-entity search (products+services+people) with tabs and recent search history |

## Auth
| Status | Route |
|---|---|
| ✅ | `/login` |
| ✅ | `/register` |
| ⬜ | `/forgot-password` | *(no email provider in the SRS stack — see TASK.md)* |
| ⬜ | `/reset-password` | *(same as above)* |

## Authenticated — reached only via profile dropdown, never the landing page
| Status | Route | Notes |
|---|---|---|
| ✅ | `/dashboard` | Role-aware overview + Recharts analytics |
| ✅ | `/dashboard/listings` | Seller/provider products + services management (TanStack Table + create/edit modals) |
| ✅ | `/dashboard/orders` | Orders — Purchases/Sales tabs, status updates, invoice download |
| ✅ | `/dashboard/bookings` | Bookings — Made/Received tabs, status updates |
| ✅ | `/dashboard/messages` | Full messaging workspace (built Phase 7, now nested in the Phase 9 dashboard shell) |
| ✅ | `/dashboard/notifications` | Full notification history (built Phase 8, now nested in the Phase 9 dashboard shell) |
| ✅ | `/dashboard/saved` | Wishlist grid |
| ✅ | `/dashboard/reviews` | Reviews — Received/Given tabs |
| ✅ | `/dashboard/calendar` | Upcoming-bookings list (not a month grid — see IMPLEMENTATION_LOG.md) |
| ✅ | `/dashboard/activity` | Merged activity timeline (Orders/Bookings/Reviews/Follows) |
| ✅ | `/dashboard/settings` | Account info, change password, logout |
| ⬜ | `/dashboard/wallet` | **Skipped by design** — no payment gateway exists in the app; see IMPLEMENTATION_LOG.md Phase 9 |
| ✅ | `/profile/edit` | Edit own profile (built Phase 3, ahead of the dashboard group since it's needed standalone) |

## API proxy (route handlers, not pages)
| Status | Route |
|---|---|
| ✅ | `/api/health` | Simple frontend-side liveness check used during Phase 0 verification |

## Admin
| Status | Route | Notes |
|---|---|---|
| ✅ | `/admin` | Admin dashboard with insights and platform stats |
| ✅ | `/admin/users` | User management (suspend, activate, update role) |
| ✅ | `/admin/listings` | Listing moderation for products and services |
| ✅ | `/admin/categories` | Category and ServiceCategory CRUD |
| ✅ | `/admin/reports` | Content moderation reports |
| ✅ | `/admin/activity` | Read-only view of all admin activity audit logs |

## Backend API Additions (Phase 4)

#### **GET /api/feed** (Public)
- **Description:** Returns aggregated marketplace homepage data in a single request.
- **Returns:** `{ latestProducts: Product[], featuredServices: Service[], topProviders: PublicProfile[] }`
