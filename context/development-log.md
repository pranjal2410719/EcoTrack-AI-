# Development Log

## v1.2.0 — Feature Expansion (June 9, 2026)

- AI Climate Coach chat page with Gemini-powered conversations
- Carbon Reduction Simulator for before/after comparisons
- Sustainability Goals tracking on dashboard
- Route-based code splitting via React.lazy + Suspense
- React.memo on chart, score card, recommendation components
- Comprehensive JSDoc across all backend modules
- docs/ folder with ARCHITECTURE.md, API_REFERENCE.md, DATABASE_SCHEMA.md

## v1.1.0 — Architecture & Testing Upgrade (June 9, 2026)

### Week 1 — Foundation
- Set up Express.js backend with Supabase integration
- Implemented carbon footprint calculator algorithm
- Set up React frontend with Vite + Tailwind CSS
- Added user authentication flow (sign up, sign in, protected routes)
- Created assessment form with step-by-step questions

### Week 2 — AI Integration
- Integrated Google Gemini 2.0 Flash for personalized recommendations
- Built dashboard with Recharts visualization (pie chart)
- Added carbon score card with color-coded levels
- Implemented progress tracking with historical comparison

### Week 3 — Polish & Testing
- Added loading skeletons for all async states
- Implemented toast notifications with Sonner
- Added animated score counter on assessment page
- Added XP system for gamification

### Week 4 — Architecture Upgrade
- Refactored to controller-service architecture pattern
- Added comprehensive test suite (Jest + Supertest)
- Set up ESLint + Prettier for code quality
- Created project documentation (architecture, schema, API docs)
- Optimized dashboard queries with parallel fetching

## Known Issues
- AI recommendations may take 2-3 seconds to generate
- No pagination for long assessment history
- Rate limiting not yet implemented

## Future Improvements
See [roadmap.md](./roadmap.md) for the full product roadmap.
