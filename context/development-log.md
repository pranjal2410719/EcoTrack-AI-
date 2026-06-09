# Development Log

## v1.0.0 — Initial MVP

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
