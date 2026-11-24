# Growth Wellness Store — Operations Dashboard

A responsive, production-ready React operations dashboard for **Growth Wellness Store** built with Vite, React 18, and pure modular CSS.

---

## 1. Overview & Key Capabilities

* **Executive Sales KPIs**: Dynamic calculations derived directly from the source dataset:
  * **Gross Revenue**: Sum of `amountINR` for Completed orders only (`₹ 66,065`).
  * **Completed Orders**: Total count of completed orders (`53`).
  * **Units Sold**: Sum of `quantity` across completed orders (`85`).
  * **Pending Orders**: Total count of pending orders (`19`).
* **Visual Data Insights**:
  * **Revenue Trend**: Dynamic weekly revenue line chart rendered with clean SVG polylines and points generated from completed transactions.
  * **Orders by Channel**: Real-time distribution breakdown across Website, Mobile App, and Marketplace with custom progress indicators.
* **Filterable & Paginated Transaction Table**:
  * Combined real-time filtering: **Status** (All, Completed, Pending, Refunded, Cancelled) + **Channel** (All, Website, Mobile App, Marketplace) + **Date Range**.
  * Sorted newest first (`date descending`).
  * Accessible pagination (10 rows per page) with page navigation and record counters.
* **Interactive Date Range Filter**:
  * Functional date selector in the top header with quick preset filters (All Time, Aug 2026, Sep 2026, Oct 2026, Nov 2026) and custom date inputs.
* **100% Inline-Style Free**: Strictly styled with structured CSS custom properties in `src/styles/global.css`.
* **Zero Horizontal Overflow**: Verified at 1440px desktop, 768px tablet, and 390px/320px mobile viewports.

---

## 2. Component Hierarchy

```
App.jsx (Root coordinator, state management for filters & dynamic metrics)
├── Sidebar.jsx (Brand identity, navigation links, tablet/mobile drawer menu)
├── Header.jsx (Page heading, subtitle, interactive date range filter badge & dropdown)
├── StatCard.jsx (Reusable KPI metric cards with Indian Rupee formatting)
├── RevenueTrend.jsx (Dynamic SVG line chart of weekly completed revenue)
├── ChannelBreakdown.jsx (Dynamic SVG progress bars by sales channel)
└── TransactionTable.jsx (Recent transactions table, status/channel filters, pagination)
```

---

## 3. Data Source & Aggregation Rules

All dashboard analytics and table records are loaded directly from the local dataset at `src/data/transactions.json` (imported via `src/data.js`).

### Transaction Record Structure
Each record in `src/data/transactions.json` adheres to the following structure:
```json
{
  "transactionId": "TXN-0001",
  "date": "2026-08-30",
  "customerId": "CUST-018",
  "productId": "PR-106",
  "productName": "Ginger Turmeric Tea",
  "category": "Tea & Infusions",
  "quantity": 1,
  "unitPriceINR": 549,
  "amountINR": 549,
  "status": "Pending",
  "channel": "Mobile App",
  "region": "East"
}
```

### Business Rules & KPI Calculations
* **Currency:** Indian Rupee (INR / `₹`), formatted with Indian numbering conventions (`en-IN`).
* **Gross Revenue:** Dynamic sum of `amountINR` for transactions with `status === 'Completed'` (`₹ 66,065`).
* **Completed Orders:** Total count of transactions with `status === 'Completed'` (`53`).
* **Units Sold:** Dynamic sum of `quantity` for transactions with `status === 'Completed'` (`85`).
* **Pending Orders:** Total count of transactions with `status === 'Pending'` (`19`).
* **Sorting:** Newest first (`date descending`).
* **Pagination:** 10 records per page.

*Note on Navigation Scope:* As specified in the project requirements (`COMPONENT_AND_TEST_SPEC.txt`), this implementation focuses on a single-page operations dashboard. `Overview` and `Transactions` serve as the active navigation anchors within this one-page scope, while `Customers`, `Products`, and `Settings` are visual navigation placeholders representing the broader platform shell.

### Baseline Dataset Summary (96 Records)
* Total Transactions: 96
* Completed: 53 (Gross Revenue: ₹66,065 | Units: 85)
* Pending: 19
* Refunded: 13
* Cancelled: 11
* Channels (Completed): Website (17), Mobile App (16), Marketplace (20)

---

## 4. Local Development & Setup

### Prerequisites
* Node.js $\ge$ 18.0.0
* npm $\ge$ 9.0.0

### Installation
```sh
npm install
```

### Start Development Server
```sh
npm run dev
```
The server will start at `http://127.0.0.1:5173/`.

### Production Build
```sh
npm run build
```
Build output is generated into the `dist/` directory with zero errors and minified assets.

### Preview Production Build
```sh
npm run preview
```

---

## 5. Verified Browser & Responsive Test Matrix

| Environment / Device | Viewport | Result | Notes |
| :--- | :---: | :---: | :--- |
| **Desktop (High-Res)** | 1440 × 900 | ✅ PASS | Fixed sidebar, 4 KPI cards row, visual charts, full table |
| **Tablet (iPad Landscape)** | 1024 × 768 | ✅ PASS | Top bar nav, 2×2 KPI grid, stacked charts, 0px page overflow |
| **Tablet (iPad Portrait)** | 768 × 1024 | ✅ PASS | Top header bar, 2×2 KPI grid, isolated table scroll container |
| **Mobile (Pixel 9)** | 412 × 924 | ✅ PASS | Single column cards, 100% width date dropdown, compact pagination |
| **Mobile (iPhone 14)** | 390 × 844 | ✅ PASS | Single column cards, isolated table scroll, 0px body overflow |
| **Compact Mobile** | 320 × 568 | ✅ PASS | 2-col date presets, wrap-safe typography, 0px horizontal scroll |

---

## 6. Accessibility & Best Practices

* **Semantic HTML**: Proper landmarks (`<header>`, `<aside>`, `<main>`, `<article>`, `<section>`, `<table>`).
* **ARIA Support**: Dialog roles, `aria-expanded` attributes on interactive toggles, `scope="col"` headers on table elements.
* **Keyboard Accessible**: Dropdowns and inputs are fully navigable via standard keyboard controls.
