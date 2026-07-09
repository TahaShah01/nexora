# Nexora — Unified Marketplace Platform

![Nexora Banner](https://placehold.co/1200x400/b97a35/ffffff?text=Nexora+Marketplace)

**Nexora** is a premium, unified marketplace that seamlessly integrates a product store and a service booking platform into a single consumer-first experience. It combines social profiles, real-time messaging, notifications, robust order/booking lifecycles, and role-based dashboards.

## ✨ Key Features

- **Unified Marketplace:** Buy and sell physical products or hire professional service providers from a single account.
- **Social Ecosystem:** User profiles with trust scores, followers/following, and comprehensive multi-tier review systems.
- **Real-Time Communication:** Instant messaging via Socket.io with typing indicators, read receipts, and file/audio attachments.
- **Premium Checkout Flows:** Multi-step cart for products (supporting COD and secure Online transfers with receipt upload) and an interactive multi-step booking wizard for services.
- **Advanced Dashboards:** Specialized role-based dashboard for buyers, sellers, providers, and admins featuring real-time analytics charts and robust management tables.
- **Modern UI/UX:** Built with Tailwind CSS v4, dark mode support, and fluid animations for a high-end feel.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (Custom CSS-first `@theme` tokens)
- **State Management:** TanStack Query (Server), React Context API (Client)
- **Components:** Radix UI primitives, Lucide React (Icons), Recharts (Data Visualization)
- **Forms:** React Hook Form + Zod resolvers

### Backend
- **Framework:** Node.js + Express
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (Access + Refresh tokens via HTTP-only cookies)
- **Realtime Transport:** Socket.io
- **Media Storage:** Cloudinary
- **PDF Generation:** pdf-lib (for automatic invoice generation)

---

## 🚀 Getting Started

The project is structured as a monorepo with completely independent `frontend` and `backend` directories.

### 1. Backend Setup

```bash
cd backend
# Copy the environment template
cp .env.example .env 
# Configure your MongoDB URI, JWT secrets, and Cloudinary keys inside .env

npm install
npm run dev
# The API will be available at http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
# Copy the environment template
cp .env.example .env.local

npm install
npm run dev
# The application will be available at http://localhost:3000
```

---

## 🏗️ Architecture & Documentation

Nexora's architecture is fully documented. Refer to the `docs/` folder for comprehensive details:

- [`docs/API.md`](docs/API.md) — REST endpoint catalogue.
- [`docs/DATABASE.md`](docs/DATABASE.md) — Mongoose schema reference.
- [`docs/ROUTES.md`](docs/ROUTES.md) — Frontend route structure.
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — Design tokens, typography, and component inventory.
- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) — The original 10-phase build strategy.

---

## 🔒 Authentication & Roles

Nexora uses a robust Role-Based Access Control (RBAC) system. An account can hold multiple roles simultaneously:
- **Buyer:** Can purchase products, book services, and leave reviews.
- **Seller:** Can list products and manage orders via the seller dashboard.
- **Provider:** Can list service packages and manage incoming bookings.
- **Admin:** Has global oversight via the Admin panel.

---

## 📄 License

This project is licensed under the MIT License.