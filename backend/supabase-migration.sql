-- EcoTrack AI — Supabase Migration
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Assessments table
-- Stores each carbon footprint assessment submission
CREATE TABLE IF NOT EXISTS assessments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transport     NUMERIC(10, 2) NOT NULL,  -- km per week
  electricity   NUMERIC(10, 2) NOT NULL,  -- monthly bill amount
  diet          TEXT NOT NULL CHECK (diet IN ('non-veg', 'vegetarian', 'vegan')),
  flights       INTEGER NOT NULL,          -- flights per year
  shopping      INTEGER NOT NULL,          -- purchases per month
  carbon_score  NUMERIC(10, 2) NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fetching user assessments
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);

-- Enable Row Level Security
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- RLS: Users can only see their own assessments
CREATE POLICY "Users can view own assessments"
  ON assessments FOR SELECT
  USING (auth.uid() = user_id);

-- RLS: Users can insert their own assessments
CREATE POLICY "Users can insert own assessments"
  ON assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 2. Recommendations table
-- Stores AI-generated recommendations for each assessment
CREATE TABLE IF NOT EXISTS recommendations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id   UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  ai_response     JSONB NOT NULL,  -- Full Gemini response
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fetching recommendations by assessment
CREATE INDEX IF NOT EXISTS idx_recommendations_assessment_id ON recommendations(assessment_id);

-- Enable Row Level Security
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view recommendations for their assessments
CREATE POLICY "Users can view own recommendations"
  ON recommendations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = recommendations.assessment_id
        AND assessments.user_id = auth.uid()
    )
  );

-- RLS: Users can insert recommendations for their assessments
CREATE POLICY "Users can insert own recommendations"
  ON recommendations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = recommendations.assessment_id
        AND assessments.user_id = auth.uid()
    )
  );
