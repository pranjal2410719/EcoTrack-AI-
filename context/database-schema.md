# Database Schema

## Tables

### assessments

Stores each carbon footprint assessment submission.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto-generated unique identifier |
| `user_id` | UUID (FK → auth.users) | Owner of the assessment |
| `transport` | NUMERIC(10,2) | Weekly transport distance in km |
| `electricity` | NUMERIC(10,2) | Monthly electricity bill in ₹ |
| `diet` | TEXT | One of: `non-veg`, `vegetarian`, `vegan` |
| `flights` | INTEGER | Flights taken per year |
| `shopping` | INTEGER | Online purchases per month |
| `carbon_score` | NUMERIC(10,2) | Calculated total carbon footprint |
| `created_at` | TIMESTAMPTZ | Auto-set creation timestamp |

**Indexes:**
- `idx_assessments_user_id` on `user_id`

**Security:**
- Row Level Security enabled
- Users can only `SELECT` their own assessments (`auth.uid() = user_id`)
- Users can only `INSERT` their own assessments

### recommendations

Stores AI-generated recommendations for each assessment.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto-generated unique identifier |
| `assessment_id` | UUID (FK → assessments) | Associated assessment |
| `ai_response` | JSONB | Full Gemini AI response |
| `created_at` | TIMESTAMPTZ | Auto-set creation timestamp |

**Indexes:**
- `idx_recommendations_assessment_id` on `assessment_id`

**Security:**
- Row Level Security enabled
- Users can view/insert recommendations for their own assessments via subquery check

## Carbon Score Calculation

```
transportScore    = transport × 0.21
electricityScore  = electricity × 0.0008
flightsScore      = flights × 90
shoppingScore     = shopping × 5
dietScore         = non-veg: 100 | vegetarian: 50 | vegan: 20

total = transportScore + electricityScore + flightsScore + shoppingScore + dietScore

Levels:
  < 200   → "Low"
  < 500   → "Moderate"
  ≥ 500   → "High"
```

## Migrations

The full migration SQL is available in `backend/supabase-migration.sql`.
Run it in the Supabase SQL Editor to set up all tables, indexes, and RLS policies.
