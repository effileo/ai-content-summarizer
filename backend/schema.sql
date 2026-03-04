-- ════════════════════════════════════════════════════════════════
-- AI Content Summarizer — Database Schema
-- ════════════════════════════════════════════════════════════════
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- to create the summaries table with Row Level Security (RLS).
--
-- This is equivalent to the SQLAlchemy model in:
--   backend/app/models/db_models.py
-- ════════════════════════════════════════════════════════════════

-- Enable the pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── Summaries Table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS summaries (
    id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID           NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source_type      VARCHAR(20)    NOT NULL CHECK (source_type IN ('youtube', 'pdf')),
    source_url       TEXT           NOT NULL,              -- Original YouTube URL or PDF filename
    content_summary  TEXT           NOT NULL,              -- AI-generated summary
    action_items     JSONB          NOT NULL DEFAULT '[]'::jsonb,  -- Action items list
    created_at       TIMESTAMPTZ    NOT NULL DEFAULT now()
);

-- ─── Indexes ────────────────────────────────────────────────────
-- Speeds up filtering by user (essential for RLS)
CREATE INDEX IF NOT EXISTS idx_summaries_user_id     ON summaries (user_id);

-- Speeds up filtering by source type
CREATE INDEX IF NOT EXISTS idx_summaries_source_type ON summaries (source_type);

-- Speeds up sorting by creation date (most recent first)
CREATE INDEX IF NOT EXISTS idx_summaries_created_at  ON summaries (created_at DESC);

-- ════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ════════════════════════════════════════════════════════════════
-- RLS ensures each authenticated user can only access their OWN
-- summaries. Supabase passes the logged-in user's UUID via
-- auth.uid(), which we compare against the row's user_id.
-- ════════════════════════════════════════════════════════════════

ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

-- ─── Policy: Users can SELECT only their own summaries ──────────
CREATE POLICY "Users can view their own summaries"
    ON summaries
    FOR SELECT
    USING (auth.uid() = user_id);

-- ─── Policy: Users can INSERT only with their own user_id ───────
CREATE POLICY "Users can create their own summaries"
    ON summaries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ─── Policy: Users can UPDATE only their own summaries ──────────
CREATE POLICY "Users can update their own summaries"
    ON summaries
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ─── Policy: Users can DELETE only their own summaries ──────────
CREATE POLICY "Users can delete their own summaries"
    ON summaries
    FOR DELETE
    USING (auth.uid() = user_id);

-- ─── Policy: Service role bypasses RLS (for backend API calls) ──
-- The service_role key in your .env already bypasses RLS by default
-- in Supabase, so this policy is only needed if you use a custom
-- PostgreSQL role. Uncomment if required:
--
-- CREATE POLICY "Service role full access" ON summaries
--     FOR ALL
--     USING (true)
--     WITH CHECK (true);
