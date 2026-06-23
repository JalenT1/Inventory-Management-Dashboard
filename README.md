# Brew & Crumb — Inventory Management Dashboard

A full-stack inventory and business analytics system built for small coffee shops and bakeries. Tracks real-time stock levels, sales, restocking, and generates daily, weekly, monthly, and yearly revenue reports through a clean manager dashboard.

---

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Recharts (data visualization)

**Backend** *(in development)*
- Java (Spring Boot)
- REST API
- PostgreSQL

---

## Features

- **Dashboard** — real-time revenue charts, order counts, top-selling items, and key stat cards with period toggles (7D / 30D / YTD / 1Y)
- **Inventory** — live stock level tracking with low-stock indicators
- **Sell Items** — point-of-sale style cart interface for logging sales
- **Restock** — log incoming inventory with quantity and cost tracking
- **Products** — manage the product catalog (names, prices, categories)
- **History** — full transaction log of sales and restock events
- **Responsive layout** — fluid scaling from desktop to tablet with collapsing sidebar below 900px

---

## Getting Started

### Prerequisites
- Node.js v18+ — [nodejs.org](https://nodejs.org)

### Run the frontend locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── App.tsx                  # Root layout, sidebar, routing
│   └── components/
│       ├── Dashboard.tsx        # Revenue charts and stat cards
│       ├── Inventory.tsx        # Stock level table
│       ├── SellItems.tsx        # POS cart interface
│       ├── Restock.tsx          # Incoming inventory form
│       ├── Products.tsx         # Product catalog management
│       ├── History.tsx          # Transaction history log
│       └── ui/                  # shadcn/ui base components
├── styles/                      # Global styles and Tailwind config
└── main.tsx                     # Entry point
```

---

## API Integration *(coming soon)*

The frontend currently uses hardcoded placeholder data. Backend integration is in progress. Planned endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory` | Fetch all inventory items |
| POST | `/api/inventory` | Add or restock an item |
| GET | `/api/products` | Fetch product catalog |
| POST | `/api/sales` | Log a sale |
| GET | `/api/history` | Fetch transaction history |
| GET | `/api/reports/daily` | Revenue data for charts |
| POST | `/api/auth/login` | Manager/admin authentication |

---

## Team

| Role | Contribution |
|------|-------------|
| Frontend Engineer | React UI, responsive layout, Figma design, component architecture |
| Backend Engineer | Java Spring Boot API, database design, REST endpoints |

---

## Roadmap

- [x] UI design and component layout
- [x] Responsive scaling across screen sizes
- [ ] Java backend REST API
- [ ] Database integration (PostgreSQL)
- [ ] Connect frontend to live API endpoints
- [ ] Authentication (manager vs admin roles)
- [ ] Deployment (Vercel + Render)
