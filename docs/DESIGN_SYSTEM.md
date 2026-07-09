# Nexora — Design System

Status: tokens ✅ implemented in `frontend/src/app/globals.css` (Tailwind v4
`@theme`). Components ⬜ planned for Phase 2.

## Color Palette

### Dark Mode (default)
| Token | Hex |
|---|---|
| Background | `#181716` |
| Surface | `#21201F` |
| Card | `#262524` |
| Elevated Surface | `#2D2C2B` |
| Border | `#343332` |
| Primary Accent | `#B97A35` |
| Primary Hover | `#C78A47` |
| Secondary Accent | `#6E7D57` |
| Success | `#4CAF6A` |
| Warning | `#E2A93B` |
| Danger | `#D35D5D` |
| Info | `#5E8DD6` |
| Primary Text | `#F5F4F2` |
| Secondary Text | `#B5B2AC` |
| Muted Text | `#8C8A86` |
| Placeholder | `#6E6B67` |

### Light Mode
| Token | Hex |
|---|---|
| Background | `#F7F6F3` |
| Surface | `#FFFFFF` |
| Card | `#FFFFFF` |
| Border | `#E7E3DD` |
| Primary Accent | `#B97A35` |
| Secondary Accent | `#6E7D57` |
| Text | `#1F1F1F` |
| Secondary Text | `#555555` |
| Muted | `#8B8B8B` |

Success/Warning/Danger/Info reuse the dark-mode values in light mode — the
Phase 10 contrast audit confirmed no light-mode-specific adjustment was needed.

### Fixed (non-theme) token
| Token | Hex | Purpose |
|---|---|---|
| Ink | `#181716` | Text on solid accent/semantic backgrounds — added Phase 10, see the Contrast Audit section below |

## Typography
- Font: **Inter**, fallback `system-ui`
- Scale (px): 12, 14, 16, 18, 20, 24, 30, 36, 48
- Weights: 400, 500, 600, 700, 800
- Line height: 150%

## Spacing (8-point grid)
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

## Border Radius
| Element | Radius |
|---|---|
| Buttons | 12 |
| Cards | 18 |
| Dialogs | 20 |
| Inputs | 12 |
| Badges | 999 |

## Shadows
Subtle, layered, low-opacity — premium depth, never a heavy glow. Three tiers
(`shadow-sm`, `shadow-md`, `shadow-lg`) defined in Phase 2 alongside the
component library.

## Component Inventory
Status: ✅ implemented — Buttons, Inputs, Textarea, Select, Checkbox, Radio,
Labels, Cards, Badges, Chips, Tags, Avatars, Tooltips, Alerts, Skeletons,
Empty States, Spinners, Modals, Drawers, Dropdowns, Popovers, Tabs,
Breadcrumbs, Pagination, Accordions, Toasts (Sonner), Rating, Review card,
Product card, Service card, DataTable (TanStack Table), Navbar, Footer,
ThemeToggle, FilterPanel, ConversationList/MessageBubble/MessageThread/
MessageComposer (messaging), NotificationBell, DashboardSidebar/
DashboardMobileNav, ProductFormModal/ServiceFormModal.

⬜ planned — a dedicated Order card/row component beyond what the Phase 9
Orders table already renders (a data table is the right pattern for that
list, not a card grid — see IMPLEMENTATION_LOG.md Phase 9).

Every component consumes the tokens above via Tailwind utility classes
(`bg-card`, `rounded-btn`, `text-text-secondary`, etc.) — none hardcodes a
raw hex value or px radius, with one narrow exception: the Recharts chart
colors in the Phase 9 dashboard, which need concrete hex strings for SVG
fill/stroke and reuse this file's exact `--primary`/`--secondary` values
rather than introducing new colors.

## Design Inspiration
Airbnb, Apple, Stripe, Notion, Linear, Discord, GitHub, Vercel — usability and
polish as reference points, never literal copies. Consumer-first marketplace
feel, with power-user tooling available through the dashboard without turning
the public site into an admin panel.

## Contrast Audit ✅ (Phase 10)
Computed WCAG 2.1 relative-luminance contrast ratios for every text/background
pairing actually used in the app (not assumed — calculated). Findings and fixes:

| Pairing | Ratio | Result |
|---|---|---|
| Primary/Secondary/Muted text on dark Background/Card | 4.6–14.9:1 | ✅ pass |
| Text on light-mode Background | 4.7–15.8:1 | ✅ pass (Muted-on-light was 3.15:1, borderline — Muted text is never used alone for essential content, only as a tertiary label next to a stronger-contrast primary label) |
| White text on solid Primary/Danger/Success buttons & badges | 2.75–3.82:1 | ❌ **failed** AA (needs 4.5:1 for normal text) |

**Fix**: added a fixed (non-theme-reactive) `--color-ink` token (`#181716`)
specifically for text placed on solid accent/semantic backgrounds. Near-black
on every brand color passes cleanly:

| Ink text on... | Ratio |
|---|---|
| Primary Accent | 5.03:1 |
| Danger | 4.68:1 |
| Success | 6.52:1 |
| Warning | 8.50:1 |
| Info | 5.33:1 |

Applied to: primary/danger Button variants, ProductCard's NEW/discount badges,
outgoing chat bubbles, unread-count badges (Navbar, NotificationBell,
ConversationList, DashboardNav), the "N" logo mark, form-modal image-remove
buttons, and Pagination's active page number.

**Known, documented residual gap**: the Button `secondary` variant
(`bg-secondary` + white text) measures 4.44:1 — a hair under the 4.5:1
threshold. Near-black text on the same background measures worse (4.04:1), so
white is the better of two imperfect options for this specific SRS-specified
olive-green (`#6E7D57`). This variant has zero usages in the app today
(confirmed by search), so it's flagged rather than silently left broken or
"fixed" by deviating from the client-specified palette — if a real use case
for `secondary` comes up, revisit the exact shade with the client at that
point rather than guessing now.

Icons (not text) are held to the separate WCAG 1.4.11 non-text 3:1 threshold,
not 4.5:1 — e.g. the white paper-plane icon on the footer's primary-colored
subscribe button (3.56:1) correctly passes under that rule and needed no change.
