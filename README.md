# 🌿 EcoTrack AI — Personal Carbon Footprint Assistant

> **Track, Understand, and Reduce Your Environmental Impact with AI-Powered Insights.**

EcoTrack AI helps individuals calculate their carbon footprint through a simple lifestyle assessment, generates personalized sustainability recommendations using Google's Gemini AI, and visualizes progress through an interactive dashboard.

## ✨ Features

- **One-Click Assessment** — Answer 5 quick questions about your lifestyle
- **Carbon Score Calculation** — Instant environmental impact score with category breakdown
- **AI-Powered Recommendations** — Personalized analysis and action plan from Gemini AI
- **Interactive Dashboard** — Score visualization, pie charts, and progress tracking
- **Supabase Authentication** — Secure sign-in with email

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **AI** | Google Gemini API |
| **Charts** | Recharts |

## 📁 Project Structure

```
e2e-track/
├── context/              # Project documentation (source of truth)
│   ├── project-overview.md
│   ├── product-requirements.md
│   ├── architecture.md
│   ├── api-documentation.md
│   ├── database-schema.md
│   ├── user-flows.md
│   ├── feature-list.md
│   ├── roadmap.md
│   ├── ai-prompts.md
│   ├── decisions.md
│   ├── future-plans.md
│   └── development-log.md
│
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route pages
│   │   ├── layouts/      # Layout wrappers
│   │   ├── services/     # API layer
│   │   └── App.jsx       # Root component
│   └── ...
│
├── backend/              # Express API server
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── config/       # Configuration
│   │   ├── middleware/    # Auth & error handling
│   │   └── server.js     # Entry point
│   └── ...
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Set Up Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
CLERK_SECRET_KEY=your_clerk_secret_key
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=
```

### 3. Set Up Supabase Database

Run the SQL migration script located in [supabase-migration.sql](file:///home/dev/Desktop/projects/e2e-track/backend/supabase-migration.sql) in your Supabase SQL editor to create the necessary tables and Row-Level Security (RLS) policies.

### 4. Set Up Environment Variables

Configure the environment files (`.env`) in both directories:
- In `frontend/`, copy `.env.example` to `.env` and configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- In `backend/`, copy `.env.example` to `.env` and configure `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `GEMINI_API_KEY`.

### 5. Set Up Gemini

1. Get an API key from [Google AI Studio](https://aistudio.google.com/)
2. Add it to `backend/.env` as `GEMINI_API_KEY`

### 6. Run the App

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/assessment` | Save assessment & calculate score |
| POST | `/api/calculate` | Calculate score only |
| POST | `/api/analyze` | Generate AI recommendations |
| GET | `/api/dashboard/:userId` | Get full dashboard data |

See `context/api-documentation.md` for detailed API documentation.

## 🧮 Carbon Calculation Formula

| Category | Calculation |
|----------|-------------|
| Transport | `km_per_week × 0.21` |
| Electricity | `bill_amount × 0.0008` |
| Flights | `flights_per_year × 90` |
| Shopping | `purchases_per_month × 5` |
| Diet | Non-Veg: 100 / Vegetarian: 50 / Vegan: 20 |

### Carbon Levels
- **Low**: < 200 kg
- **Moderate**: 200–500 kg
- **High**: > 500 kg

## 🔮 Future Roadmap

- Gamification (points, badges, leaderboards)
- Community challenges
- Carbon receipt scanner (OCR)
- Green route planner
- Mobile app (Flutter)
- B2B corporate platform

## 📄 License

MIT

---

<p align="center">Built with 🌱 for a greener planet</p>
