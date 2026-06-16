# EcoTrack AI — Product Requirements

## MVP Goal
Build a working prototype that demonstrates:
1. User authentication via Supabase Auth
2. Carbon footprint assessment questionnaire
3. Carbon score calculation
4. Gemini-powered personalized sustainability insights
5. Dashboard with score visualization and AI recommendations

## Functional Requirements

### FR1: Landing Page
- Hero section with product tagline and CTA
- Features section highlighting key capabilities
- How it works section (3-step explanation)
- Call-to-action button linking to sign-up

### FR2: Authentication
- Sign-in and Sign-up pages via Supabase Auth
- Protected dashboard routes (JWT-based)
- User profile management

### FR3: Carbon Assessment
- 5-field questionnaire covering: transportation, electricity, diet, flights, shopping
- Form validation
- Loading state during submission

### FR4: Carbon Calculation
- Server-side calculation using provided formula
- Carbon level classification (Low / Moderate / High)
- Breakdown by category

### FR5: AI Analysis
- Gemini API integration for personalized recommendations
- Response includes: analysis, top 5 actions, expected impact, weekly plan
- Structured output display

### FR6: Dashboard
- Carbon score display with level indicator
- Emission breakdown pie chart (Recharts)
- AI recommendations cards
- Progress comparison (fake historical data)

## Non-Functional Requirements
- Responsive mobile-first design
- Loading states for all async operations
- Error handling and user feedback
- Environment variables for all secrets
- Clean modular code structure
