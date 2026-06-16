# EcoTrack AI — User Flows

## Primary Flow: First-Time User

```
Landing Page
    │
    ▼
Click "Start Tracking" CTA
    │
    ▼
Supabase Auth Sign-Up Page
    │
    ▼
Create Account (Google / Email)
    │
    ▼
Redirect to Assessment Page
    │
    ▼
Fill Questionnaire (5 fields)
    │
    ▼
Click "Calculate My Footprint"
    │
    ▼
Loading State → Backend calculates score + Gemini generates insights
    │
    ▼
Redirect to Dashboard
    │
    ▼
View: Carbon Score, Level, Pie Chart, AI Recommendations, Progress
```

## Returning User Flow

```
Login (Supabase Auth Sign-In)
    │
    ▼
Dashboard
    │
    ▼
View latest assessment data
    │
    ▼
Option: Take new assessment to update score
```

## Assessment Detail Flow

```
Dashboard
    │
    ▼
Click "New Assessment"
    │
    ▼
Assessment Form (pre-filled or blank)
    │
    ▼
Submit → Calculate → Analyze
    │
    ▼
Redirect to updated Dashboard
```

## Edge Cases

### User has no assessments yet
- Dashboard shows "Take your first assessment" prompt
- No charts or recommendations displayed
- CTA button to start assessment

### API failure during calculation
- Error message displayed
- User can retry submission
- Assessment not saved to database

### Gemini API timeout
- Carbon score still calculated and saved
- Recommendations show "Coming soon" placeholder
- User can retry analysis from dashboard

### Unauthenticated access
- Protected routes redirect to Supabase Auth sign-in
- After sign-in, redirect back to intended page
