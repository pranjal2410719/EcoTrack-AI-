# Testing Report

## Current State: ✅ EXCELLENT

### Backend Tests
- **Framework:** Jest + Supertest
- **Test suites:** 5 (calculator, api, simulator, coach, dashboard)
- **Total tests:** 43
- **Skipped:** 2 (AI Coach integration — requires Gemini API quota)
- **Pass rate:** 100%

### Test Files

| File | Tests | What it covers |
|------|-------|----------------|
| `tests/calculator.test.js` | 12 | Unit tests for carbonCalculator (all diets, levels, edge cases) |
| `tests/api.test.js` | 10 | Integration tests for health, calculate, assessment, analyze, dashboard, 404 |
| `tests/simulator.test.js` | 12 | Unit tests for computeSavings + integration tests for POST /api/simulate |
| `tests/coach.test.js` | 3 | Auth gate tests for POST /api/coach/chat |
| `tests/dashboard.test.js` | 3 | Auth edge cases for GET /api/dashboard (malformed tokens, expired) |
| `tests/ai-coach.test.js` | 2 | Integration test for Gemini coach (skipped when no API key) |

### Coverage Gaps (Low Priority)
- `coachController.js` — requires Gemini API mock for unit testing
- `assessmentController.js` — requires Supabase mock
- `aiController.js` — requires Gemini + Supabase mocks
- No frontend component tests

### Test Scripts
```bash
npm test          # Run all 43 tests
npm run test:watch # Watch mode
```
