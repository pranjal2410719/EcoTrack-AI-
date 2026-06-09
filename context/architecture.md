# Architecture

## Overview

EcoTrack AI is a full-stack carbon footprint tracking application with AI-powered recommendations.

```
┌─────────────────────────────────────┐
│         Frontend (React + Vite)      │
│  ┌───────────┐  ┌──────────────────┐ │
│  │   Pages   │  │   Components     │ │
│  │  - Home   │  │  - CarbonScore   │ │
│  │  - Auth   │  │  - EmissionChart │ │
│  │  - Assess │  │  - Recommends    │ │
│  │  - Dashbd │  │  - Skeletons    │ │
│  └─────┬─────┘  └──────────────────┘ │
│        │ axios                         │
└────────┼─────────────────────────────┘
         │
┌────────┼─────────────────────────────┐
│   Backend (Express.js)                │
│  ┌─────┴─────┐                        │
│  │  Routes   │                        │
│  └─────┬─────┘                        │
│  ┌─────┴─────┐                        │
│  │Controllers│ (Business logic)       │
│  └─────┬─────┘                        │
│  ┌─────┴─────┐                        │
│  │ Services  │ (Core logic, AI, DB)   │
│  └─────┬─────┘                        │
│  ┌─────┴─────┐                        │
│  │Middleware │ (Auth, Validation,     │
│  │           │  Error handling)       │
│  └───────────┘                        │
└────────┬─────────────────────────────┘
         │
┌────────┼─────────────────────────────┐
│   External Services                   │
│  ┌─────┴─────┐  ┌──────────────────┐ │
│  │  Supabase │  │  Google Gemini   │ │
│  │ (Postgres)│  │  (AI Engine)     │ │
│  └───────────┘  └──────────────────┘ │
└───────────────────────────────────────┘
```

## Layers

### Frontend
- **React 18** with **Vite** for fast development
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Sonner** for toast notifications
- **Supabase JS** for authentication
- **React Router** v6 for routing

### Backend
- **Express.js** server
- **Controller-Service** architecture pattern
- **JWT authentication** via Supabase
- **express-validator** for input validation
- **Jest + Supertest** for testing

### Database (Supabase/PostgreSQL)
- **Assessments** table for carbon footprint data
- **Recommendations** table for AI-generated insights
- Row Level Security (RLS) ensures data isolation per user

### AI
- **Google Gemini 2.0 Flash** generates personalized sustainability recommendations

## Data Flow

1. User signs up/in → JWT token issued by Supabase
2. User takes assessment → data sent to backend
3. Backend calculates carbon score → saves to Supabase
4. Backend calls Gemini AI → generates recommendations
5. Recommendations stored in DB (cached)
6. Dashboard loads: fetches assessment + recommendations in parallel
7. User sees score breakdown, history, AI suggestions
