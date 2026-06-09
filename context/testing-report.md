# Testing Report

## Current State: ✅ EXCELLENT

### Backend Tests
- **Framework:** Jest + Supertest
- **Test suites:** 5 active (calculator, api, simulator, coach, dashboard)
- **Total tests:** 52 (50 passed, 2 skipped)
- **Skipped:** 2 (AI Coach integration — requires Gemini API quota)
- **Pass rate:** 100% of executed tests

### Test Files

| File | Tests | What it covers |
|------|-------|----------------|
| `tests/calculator.test.js` | 12 | Unit: carbonCalculator (all diets, levels, edge cases, zero/undefined) |
| `tests/api.test.js` | 12 | Integration: health, calculate (valid + invalid), assessment/analyze/dashboard auth gates, 404 |
| `tests/simulator.test.js` | 15 | Unit: computeSavings (identical, positive/negative savings, diet switches, large numbers) + API: valid, missing fields, empty body, partial inputs |
| `tests/coach.test.js` | 10 | Full mocked flow: auth gate (4 scenarios), successful chat (no assessment, with context, with history), error handling, low/high score levels |
| `tests/dashboard.test.js` | 3 | Auth edge cases: no token, invalid token, expired token |

### Coverage Highlights
- `services/carbonCalculator.js` — ~95% (all paths)
- `controllers/simulatorController.js` — ~95% (computeSavings + API)
- `controllers/coachController.js` — ~90% (chat flow via mocks)
- `routes/` — All auth gates tested
- `middleware/auth.js` — All code paths (missing header, invalid token, valid user, catch block)

### Test Scripts
```bash
npm test          # Run all 52 tests
npm run test:watch # Watch mode
```
