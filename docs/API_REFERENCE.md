# API Reference

Base: `http://localhost:5001/api`

## Public Endpoints

### GET /api/health
Health check endpoint.

**Response 200:**
```json
{ "success": true, "status": "ok", "timestamp": "..." }
```

### POST /api/calculate
Calculate carbon score without saving.

**Body:**
```json
{ "transport": 150, "electricity": 2500, "diet": "vegetarian", "flights": 3, "shopping": 5 }
```

### POST /api/simulate
Compare current vs target lifestyle.

**Body:**
```json
{
  "current": { "transport": 150, "electricity": 2500, "diet": "non-veg", "flights": 3, "shopping": 5 },
  "target": { "transport": 50, "electricity": 1500, "diet": "vegan", "flights": 1, "shopping": 2 }
}
```

## Auth-Required Endpoints

All require: `Authorization: Bearer <supabase-jwt>`

### POST /api/assessment
Save assessment + get AI analysis.

### POST /api/analyze
Generate AI recommendations for a saved assessment.

### GET /api/dashboard
Get full dashboard data (latest assessment, history, recommendations, progress).

### POST /api/coach/chat
Chat with AI sustainability coach.

**Body:**
```json
{ "message": "...", "history": [{ "role": "user", "content": "..." }] }
```
