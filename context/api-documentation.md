# API Documentation

Base URL: `http://localhost:5001/api`

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <supabase-jwt-token>
```

---

## Health Check

### GET /api/health

Check server status.

**Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Calculate Carbon Score

### POST /api/calculate

Calculate carbon footprint without saving to database. **No auth required.**

**Request Body:**
```json
{
  "transport": 150,
  "electricity": 2500,
  "diet": "vegetarian",
  "flights": 3,
  "shopping": 5
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total": 345.5,
    "level": "Moderate",
    "breakdown": {
      "transport": 31.5,
      "electricity": 2.0,
      "flights": 270,
      "shopping": 25,
      "diet": 50
    }
  }
}
```

---

## Save Assessment

### POST /api/assessment

Save a new assessment and calculate the score. **Auth required.**

**Request Body:**
```json
{
  "transport": 150,
  "electricity": 2500,
  "diet": "vegetarian",
  "flights": 3,
  "shopping": 5
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "assessment": {
      "id": "uuid",
      "user_id": "uuid",
      "transport": 150,
      "electricity": 2500,
      "diet": "vegetarian",
      "flights": 3,
      "shopping": 5,
      "carbon_score": 345.5,
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "carbonLevel": "Moderate",
    "breakdown": { ... }
  }
}
```

---

## Analyze Assessment

### POST /api/analyze

Generate AI-powered recommendations for a saved assessment. **Auth required.**

**Request Body:**
```json
{
  "assessmentId": "uuid"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "analysis": "Markdown text with AI recommendations...",
    "saved": true
  }
}
```

---

## Dashboard

### GET /api/dashboard

Fetch all dashboard data. **Auth required.**

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "hasAssessment": true,
    "latestAssessment": {
      "id": "uuid",
      "carbon_score": 345.5,
      "level": "Moderate",
      "breakdown": { ... },
      "transport": 150,
      "electricity": 2500,
      "diet": "vegetarian",
      "flights": 3,
      "shopping": 5
    },
    "recommendations": { "text": "..." },
    "history": [
      { "carbon_score": 400, "created_at": "..." },
      { "carbon_score": 345.5, "created_at": "..." }
    ],
    "progress": {
      "lastMonth": 400,
      "currentMonth": 345.5,
      "reduction": 13.6
    }
  }
}
```

---

## Validation Rules

| Field | Type | Rules |
|-------|------|-------|
| `transport` | Number | Required, numeric |
| `electricity` | Number | Required, numeric |
| `diet` | String | Required, one of: `non-veg`, `vegetarian`, `vegan` |
| `flights` | Integer | Required, non-negative integer |
| `shopping` | Integer | Required, non-negative integer |

## Error Responses

### Validation Error: `400 Bad Request`
```json
{
  "success": false,
  "error": "diet must be non-veg, vegetarian, or vegan"
}
```

### Auth Error: `401 Unauthorized`
```json
{
  "success": false,
  "error": "Missing or invalid authorization header"
}
```

### Not Found: `404 Not Found`
```json
{
  "success": false,
  "error": "Assessment not found"
}
```

### Server Error: `500 Internal Server Error`
```json
{
  "success": false,
  "error": "Failed to save assessment"
}
```
