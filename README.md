# 🍔 The Foodie Wagon

**Modern Restaurant Platform** — Customer-facing storefront + Restaurant Admin Dashboard + Super Admin Panel

Built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4**, and **Zustand 5**.

---

## 📸 Preview

### 🛒 Customer Storefront
![Storefront](public/storefront-preview.png)

### 🎛️ Admin Dashboard
![Dashboard](public/dashboard-preview.png)

---

## ✨ Features

### Customer Storefront
- 🍕 Full menu with categories (Beef, Chicken, Veggie, Appetizers, Fried Chicken, Dips, Drinks)
- 🔍 Search & filter (Halal, Vegetarisch, Scharf)
- 🛒 Shopping cart with size selection (S/M/L)
- 📦 Checkout flow: Order type → Customer info → Summary → Confirmation
- 📍 Branch selection with delivery/pickup
- 📱 Fully responsive mobile-first design

### Restaurant Admin Dashboard (`/dashboard`)
- 📊 **Overview** — KPI cards, revenue chart, recent orders, top products
- 📋 **Orders Management** — Real-time order tracking, status updates (Neu → In Bearbeitung → Bereit → Geliefert)
- 🍔 **Menu Management** — Add, edit, delete products with image preview, sizes, tags (Halal/Vegetarisch/Scharf)
- 📂 **Categories** — Manage categories, toggle visibility
- 🏪 **Branches** — Manage locations, toggle active/inactive
- 👥 **Customers** — Customer list with order history
- 📈 **Reports** — Revenue charts, hourly heatmap, top products, order types (pure CSS/SVG charts)
- ⚙️ **Settings** — Restaurant info, opening hours, delivery, payments, notifications

### Super Admin Panel (`/admin`)
- 🏠 **Restaurants** — Manage all restaurants, activate/deactivate, impersonate
- 💳 **Subscriptions** — Plans (Starter/Pro/Business), payment tracking
- 📊 **Platform Analytics** — Total restaurants, orders, revenue, growth charts

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **pnpm** (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/the-foodie-wagon.git
cd the-foodie-wagon

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Credentials

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Restaurant Admin | `admin@foodiewagon.de` | `admin123` | `/dashboard` |
| Super Admin | `owner@platform.com` | `owner123` | `/admin` |

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 16 | React framework (App Router) |
| [React](https://react.dev/) | 19 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Utility-first styling |
| [Zustand](https://zustand.docs.pmnd.rs/) | 5 | State management |
| [iconoir-react](https://iconoir.com/) | - | Icons |
| [pnpm](https://pnpm.io/) | - | Package manager |
| Turbopack | - | Fast bundler |

### Fonts
- **Oswald** — Headings (bold, impactful)
- **Playfair Display** — Secondary text

---

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                    # Homepage
│   ├── speisekarte/page.tsx        # Full menu page
│   ├── login/page.tsx              # Login page
│   ├── dashboard/                  # Restaurant admin
│   │   ├── layout.tsx              # Dashboard shell (sidebar + topbar)
│   │   ├── overview/               # KPI stats & charts
│   │   ├── orders/                 # Order management
│   │   ├── menu/                   # Product management (CRUD)
│   │   ├── categories/             # Category management
│   │   ├── branches/               # Branch management
│   │   ├── customers/              # Customer list
│   │   ├── reports/                # Revenue reports
│   │   └── settings/               # Restaurant settings
│   └── admin/                      # Super admin
│       ├── restaurants/            # Restaurant management
│       ├── subscriptions/          # Subscription billing
│       └── analytics/              # Platform analytics
│
├── components/
│   ├── header.tsx                  # Navigation bar
│   ├── hero.tsx                    # Hero section
│   ├── menu-section.tsx            # Homepage menu display
│   ├── product-card.tsx            # Interactive product card
│   ├── cart-drawer.tsx             # Sliding cart drawer
│   ├── checkout-modal.tsx          # 4-step checkout flow
│   └── dashboard/                  # Dashboard components (12)
│       ├── sidebar.tsx             # Collapsible navigation
│       ├── topbar.tsx              # Top bar + notifications
│       ├── stats-card.tsx          # KPI metric card
│       ├── orders-table.tsx        # Orders data table
│       ├── product-table.tsx       # Products management table
│       ├── revenue-chart.tsx       # Pure CSS/SVG chart
│       └── ...                     # And more
│
├── lib/
│   ├── store/
│   │   ├── cart.ts                 # Cart state (Zustand)
│   │   └── dashboard.ts           # Dashboard state (Zustand + persist)
│   ├── data/
│   │   ├── menu.ts                 # Menu data (35+ products)
│   │   └── mock-dashboard.ts      # Mock data for dashboard
│   ├── hooks/
│   │   ├── use-orders.ts          # Orders hook with filters
│   │   └── use-dashboard-stats.ts # KPI calculations
│   └── config/
│       └── branches.ts            # Branch data (3 locations)
│
└── public/                         # Static assets
    ├── burgers/                    # Burger images
    ├── Appetizers/                 # Appetizer images
    ├── Fried-Chicken/             # Fried chicken images
    └── graphics/                   # Icons & logos
```

---

## 🔗 Data Flow

```
Customer browses menu → Add to cart (cart.ts) → Checkout (checkout-modal.tsx)
        ↓
Order saved to Dashboard Store (dashboard.ts + localStorage)
        ↓
Restaurant admin sees order in /dashboard/orders → Updates status
        ↓
Statistics auto-update in /dashboard/overview
```

```
Admin adds/edits/deletes products in /dashboard/menu
        ↓
Changes saved to Dashboard Store (persist in localStorage)
        ↓
Storefront (/speisekarte) & Homepage auto-update
```

---

## 🎨 Design System

- **Dark theme only** — Matching CSS variables
- **Primary accent:** Gold/Yellow (`var(--primary)`)
- **Background:** Dark (`var(--background)`)
- **Icons:** iconoir-react exclusively
- **Charts:** Pure CSS/SVG — no heavy charting libraries
- **Responsive:** Mobile-first design

### Order Status Colors

| Status | Color | German |
|--------|-------|--------|
| New | 🟡 Yellow | Neu |
| Preparing | 🔵 Blue | In Bearbeitung |
| Ready | 🟢 Green | Bereit |
| Delivered | ⚪ Gray | Geliefert |
| Cancelled | 🔴 Red | Storniert |

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

<p align="center">
  Built with ❤️ by <strong>The Foodie Wagon Team</strong>
</p>