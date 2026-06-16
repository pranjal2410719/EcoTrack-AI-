# EcoTrack AI — Architectural Decisions

## ADR-1: Vite over Create React App
**Status:** Accepted
**Context:** Need a fast, modern React setup.
**Decision:** Use Vite for faster development server and build times.
**Consequences:** CRA migration path not needed; Vite is the modern standard.

## ADR-2: Express.js over Next.js for Backend
**Status:** Accepted
**Context:** Simple API server, no SSR needed.
**Decision:** Use Express.js for a lightweight, focused backend.
**Consequences:** Separate frontend and backend deployments.

## ADR-3: Supabase Auth over Clerk
**Status:** Accepted (changed mid-development)
**Context:** Need quick, secure auth without building from scratch. Initially considered Clerk, but Supabase Auth provides tighter integration with the existing Supabase database and RLS policies.
**Decision:** Use Supabase Auth (email/password) for authentication, integrated with the existing Supabase database.
**Consequences:** Unified auth + database provider; JWT tokens verified on every request; RLS policies ensure data isolation per user.

## ADR-4: Supabase over Direct PostgreSQL
**Status:** Accepted
**Context:** Need hosted PostgreSQL with easy client SDK.
**Decision:** Use Supabase for managed database + JS client library.
**Consequences:** Vendor lock-in but zero database management overhead.

## ADR-5: Gemini over OpenAI
**Status:** Accepted
**Context:** Need AI recommendations; want to differentiate.
**Decision:** Use Google Gemini API for sustainability analysis.
**Consequences:** Different API patterns vs OpenAI; free tier available.

## ADR-6: Simple Formula over ML Model
**Status:** Accepted
**Context:** Prototype phase; need working demo quickly.
**Decision:** Use deterministic formula based on established emission factors.
**Consequences:** Less accurate than ML-based estimation; easy to explain to judges.

## ADR-7: Fake Historical Data for Progress
**Status:** Accepted
**Context:** MVP needs to show progress tracking but has no real history.
**Decision:** Generate a fake "last month" score for comparison.
**Consequences:** Acceptable for demo; real data accumulates with usage.

## ADR-8: Monorepo over Separate Repos
**Status:** Accepted
**Context:** Small team, single developer iteration.
**Decision:** Keep frontend and backend in one repository.
**Consequences:** Simpler development; separate deployments still possible.
