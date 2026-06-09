# Database Schema

## Tables

### assessments
| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | Auto-generated |
| user_id | UUID FK | References auth.users |
| transport | NUMERIC(10,2) | km/week |
| electricity | NUMERIC(10,2) | ₹/month |
| diet | TEXT | non-veg, vegetarian, vegan |
| flights | INTEGER | per year |
| shopping | INTEGER | orders/month |
| carbon_score | NUMERIC(10,2) | Calculated total |
| created_at | TIMESTAMPTZ | Auto timestamp |

Index: `idx_assessments_user_id` on user_id

### recommendations
| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | Auto-generated |
| assessment_id | UUID FK | References assessments |
| ai_response | JSONB | Gemini response |
| created_at | TIMESTAMPTZ | Auto timestamp |

Index: `idx_recommendations_assessment_id` on assessment_id

## Security
Both tables have Row Level Security (RLS) enabled.
Users can only access their own data via auth.uid() checks.
