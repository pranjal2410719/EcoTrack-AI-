# 🌿 EcoTrack AI — Personal Carbon Footprint Assistant

> **Track, Understand, and Reduce Your Environmental Impact with AI-Powered Insights.**

[![Tests](https://img.shields.io/badge/tests-22%20passing-brightgreen)](#-testing)
[![Code Style](https://img.shields.io/badge/code%20style-prettier-ff69b4)](#)
[![ESLint](https://img.shields.io/badge/lint-eslint-4b32c3)](#)
[![AI](https://img.shields.io/badge/AI-Gemini%202.0-4285F4)](#)

EcoTrack AI is a full-stack sustainability platform that helps you **understand**, **track**, and **reduce** your carbon footprint. Built with React, Node.js, and Google Gemini AI.

---

## ✨ Features

### ✅ Understand
- **One-Click Assessment** — Answer 5 quick questions about your lifestyle
- **Instant Carbon Score** — Real-time calculation with category breakdown (transport, energy, diet, flights, shopping)
- **Emission Charts** — Interactive pie chart visualization of your carbon footprint

### ✅ Track
- **Interactive Dashboard** — Score history, progress tracking, and trend analysis
- **Score History** — Timeline of all your assessments with month-over-month comparison
- **Progress Metrics** — Track reduction percentage and carbon level changes

### ✅ Reduce
- **AI Recommendations** — Personalized analysis and action plan from Gemini AI
- **AI Climate Coach** — Chat with an AI sustainability coach on `/coach` for personalized advice
- **Carbon Reduction Simulator** — Compare current vs target lifestyle at `/simulator` and see potential CO₂ savings
- **Sustainability Goals** — Set and track reduction goals with progress bar on dashboard

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React SPA (Vite)                   │
│  ┌─────────┐ ┌──────────┐ ┌──────────────────────┐  │
│  │  Pages  │ │Components│ │   Services (axios)   │  │
│  │ - Home  │ │ - Cards  │ │ - API Layer          │  │
│  │ - Auth  │ │ - Charts │ │ - Supabase Auth      │  │
│  │ - Assess│ │ - Layout │ │                      │  │
│  │ - Dash  │ │ - Skele  │ │                      │  │
│  │ - Coach │ │ - Goals  │ │                      │  │
│  │ - Sim   │ │          │ │                      │  │
│  └─────────┘ └──────────┘ └──────────────────────┘  │
│         │ Lazy loading + React.memo                  │
└──────────┼───────────────────────────────────────────┘
           │ HTTP (axios)
┌──────────┼───────────────────────────────────────────┐
│            Express.js API (Controller-Service)        │
│  Routes → Controllers → Services → Database/AI       │
│  Middleware: Auth (JWT), Validation, Error Handler    │
└──────────┬───────────────────────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
┌───▼────┐  ┌────▼───┐
│Supabase│  │ Gemini │
│Postgres│  │ 2.0    │
│+ Auth  │  │ Flash  │
└────────┘  └────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### 1. Install Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Set Up Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=
```

### 3. Set Up Database
Run the SQL in `backend/supabase-migration.sql` in your Supabase SQL editor.

### 4. Run the App
```bash
# Terminal 1 — Backend API
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)**

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | ❌ | Health check |
| POST | `/api/calculate` | ❌ | Calculate carbon score |
| POST | `/api/simulate` | ❌ | Compare current vs target lifestyle |
| POST | `/api/assessment` | ✅ | Save assessment & calculate score |
| POST | `/api/analyze` | ✅ | Generate AI recommendations |
| GET | `/api/dashboard` | ✅ | Full dashboard data |
| POST | `/api/coach/chat` | ✅ | Chat with AI climate coach |

See **[docs/API_REFERENCE.md](docs/API_REFERENCE.md)** for full documentation.

---

## 🧮 Carbon Calculation

| Category | Factor | Example |
|----------|--------|---------|
| 🚗 Transport | 0.21 kg CO₂ per km/week | 150 km → 31.5 kg |
| ⚡ Electricity | 0.0008 per ₹/month | ₹2500 → 2 kg |
| ✈️ Flights | 90 kg per flight/year | 3 flights → 270 kg |
| 🛍️ Shopping | 5 kg per order/month | 5 orders → 25 kg |
| 🍽️ Diet | Veg: 50 / Vegan: 20 / Meat: 100 | — |

### Carbon Levels
- **🟢 Low:** < 200 kg
- **🟡 Moderate:** 200–500 kg
- **🔴 High:** > 500 kg

---

## 🧪 Testing

```bash
cd backend
npm test          # Run 22 tests
npm run test:watch # Watch mode
npm run lint      # ESLint check
npm run format    # Prettier format
```

**Coverage:** Unit tests for calculator (all diet types, edge cases), API integration tests (validation, auth, 404, health check).

---

## 📚 Documentation

| Resource | Description |
|----------|-------------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture and design decisions |
| [docs/API_REFERENCE.md](docs/API_REFERENCE.md) | Complete API reference with examples |
| [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Database tables and schemas |
| [context/](context/) | Project management and strategy docs |

---

## 🎯 Project Structure

```
e2e-track/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Business logic layer
│   │   ├── services/      # Calculator, AI, DB services
│   │   ├── routes/        # API endpoint definitions
│   │   ├── middleware/     # Auth, validation, error handling
│   │   └── validations/   # Input validation rules
│   ├── tests/             # Jest + Supertest
│   └── docs/              # Project documentation
├── frontend/
│   └── src/
│       ├── pages/         # Route pages (lazy-loaded)
│       ├── components/    # Reusable UI (memoized)
│       ├── services/      # API client (axios)
│       └── layouts/       # Layout wrappers
└── context/               # Management docs
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + Tailwind CSS |
| **Charts** | Recharts |
| **Backend** | Node.js + Express.js |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth + JWT |
| **AI** | Google Gemini 2.0 Flash |
| **Testing** | Jest + Supertest |
| **Linting** | ESLint + Prettier |

---

## 📈 Performance

- **Lazy loading** — All routes code-split via `React.lazy` + `Suspense`
- **Memoization** — Charts and cards wrapped in `React.memo`
- **Parallel queries** — Dashboard fetches data via `Promise.all`
- **AI caching** — Gemini responses stored in DB, not regenerated on every load
- **Efficient API** — Controller-Service architecture with proper separation of concerns

---

## 🔮 Future Roadmap

- Gamification (points, badges, leaderboards)
- Weekly email sustainability reports
- Carbon receipt scanner (OCR)
- Green route planner
- Mobile app
- B2B corporate platform

---

## 📄 License

MIT

---

<p align="center">
  Built with 🌱 for a greener planet<br>
  <a href="https://github.com/pranjal2410719/EcoTrack-AI-">GitHub</a>
</p>
