# Architecture

## System Overview

EcoTrack AI is a full-stack web application for tracking, understanding, and reducing personal carbon footprints.

```
┌─────────────────────────────────────────────────────┐
│                   Client Browser                    │
│  ┌───────────────────────────────────────────────┐  │
│  │            React SPA (Vite)                   │  │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────────┐   │  │
│  │  │  Pages  │ │Components│ │    Services   │   │  │
│  │  │ - Home  │ │ - Cards  │ │  - API Layer  │   │  │
│  │  │ - Auth  │ │ - Charts │ │  - Auth       │   │  │
│  │  │ - Assess│ │ - Layout │ │  - Coach Chat │   │  │
│  │  │ - Dash  │ │ - Skele  │ │               │   │  │
│  │  │ - Coach │ │          │ │               │   │  │
│  │  │ - Sim   │ │          │ │               │   │  │
│  │  └─────────┘ └──────────┘ └───────────────┘   │  │
│  └─────────────────────┬─────────────────────────┘  │
│                        │ HTTP (axios)               │
└────────────────────────┼────────────────────────────┘
                         │
┌────────────────────────┼───────────────────────────┐
│           Express.js API Server                    │
│  ┌──────────┐ ┌──────────────┐ ┌────────────────┐  │
│  │  Routes  │→│  Controllers │→│   Services     │  │
│  │ - /api/  │ │  (Business   │ │ - Carbon Calc  │  │
│  │   health │ │   Logic)     │ │ - Gemini AI    │  │
│  │   assess │ │              │ │ - Supabase DB  │  │
│  │   calc   │ │              │ │ - Coach Chat   │  │
│  │   dash   │ │              │ │                │  │
│  │   coach  │ │              │ │                │  │
│  │   sim    │ │              │ │                │  │
│  └──────────┘ └──────────────┘ └───────┬────────┘  │
│                                        │           │
│  ┌─────────────────────────────────────┴────────┐  │
│  │           Middleware Layer                   │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │   Auth   │ │Validator │ │Error Handler │  │  │
│  │  │ (JWT)    │ │(express- │ │              │  │  │
│  │  │          │ │val)      │ │              │  │  │
│  │  └──────────┘ └──────────┘ └──────────────┘  │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
     ┌────────▼──────┐    ┌────────▼──────┐
     │   Supabase    │    │    Google     │
     │  (PostgreSQL) │    │   Gemini AI   │
     │  + Auth       │    │               │
     └───────────────┘    └───────────────┘
```

## Key Design Decisions

### Controller-Service Architecture

- **Routes** are thin — only define HTTP method, middleware, and controller binding
- **Controllers** handle request/response formatting and orchestration
- **Services** contain pure business logic (calculator, AI, database)
- This separation improves testability and maintainability

### Authentication

- Supabase Auth handles user registration and login
- JWT tokens are verified on every protected route
- Row Level Security (RLS) in PostgreSQL ensures data isolation
- Authed Supabase client created per-request for RLS compliance

### AI Integration

- Gemini 2.0 Flash for both assessment recommendations and chat coach
- Recommendations are cached in the database (generated once, read many times)
- Coach chat sends conversation history for contextual responses

### Performance

- Lazy-loaded routes with React.Suspense
- Memoized components (React.memo)
- Parallel database queries (Promise.all)
- Route-based code splitting (Vite)
