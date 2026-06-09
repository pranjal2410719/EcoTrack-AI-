# Changelog

## [v1.2.0] — June 9, 2026

### Added
- **22 automated tests** — unit tests for carbon calculator + API integration tests
- **Controller layer** — `controllers/` with: calculateController, assessmentController, dashboardController, aiController
- **ESLint config** — backend (flat config v10) + frontend (React + hooks plugins)
- **Prettier config** — consistent formatting rules
- **Jest config** — with coverage reporting
- **context/ documentation** — architecture.md, database-schema.md, api-documentation.md, roadmap.md, development-log.md
- **404 handler** — catch-all middleware for unknown API routes

### Changed
- **Routes refactored** — all routes now delegate to controllers (thin routes pattern)
- **Dashboard** — parallel DB queries via `Promise.all`
- **Validators** — deduplicated `validateAssessment`/`validateCalculate` into shared array
- **Server** — conditional `app.listen` for test compat (`require.main === module`)
- **Health route** — now returns `{ success: true, ... }` for API consistency
- **Assessment form** — added `<label htmlFor>`, ARIA roles, radiogroup, progressbar roles
- **Navbar** — `aria-label` on mobile menu, `aria-expanded` state
- **EmissionChart** — `role="region"`, `role="img"` with descriptive label
- **RecommendationCard** — `aria-expanded`, `aria-controls` on toggle
- **CarbonScoreCard** — improved color contrast (green-600→700, etc.)
- **`.gitignore`** — added coverage/ exclusion, removed context/ exclusion

### Added
- **AI Climate Coach** — New `/coach` page with real-time Gemini chat, conversation history, user carbon context injection, typing indicator, and quick suggestion chips
- **Carbon Reduction Simulator** — New `/simulator` page with before/after comparison forms, real-time savings calculation, and animated results with category breakdown
- **Sustainability Goals** — Goals section on dashboard with localStorage persistence, goal templates, custom goals, progress tracking, and completion toggle
- **Route-based code splitting** — All pages lazy-loaded via `React.lazy` + `Suspense`
- **React.memo** — On CarbonScoreCard, EmissionChart, RecommendationCard components
- **PageSkeleton** — Shared loading placeholder for lazy-loaded routes
- **JSDoc** — Comprehensive documentation on all backend services, controllers, middleware
- **docs/ folder** — ARCHITECTURE.md, API_REFERENCE.md, DATABASE_SCHEMA.md

### Changed
- **Backend** — 3 new endpoints: POST /api/coach/chat, POST /api/simulate
- **Navbar** — Added AI Coach and Simulator navigation links (desktop + mobile)
- **Dashboard** — Integrated GoalsSection component
- **API service** — Added chatWithCoach() and simulateReduction() functions
- **carbonCalculator.js** — Exported getLevel() and EMISSION_FACTORS for reuse
- **dashboardController.js** — Now imports getLevel from carbonCalculator (DRY)

### Technical
- `npm test` — run all 22 tests
- `npm run lint` / `lint:fix` — ESLint
- `npm run format` / `format:check` — Prettier
