-- ════════════════════════════════════════════════════════════════
-- AI Content Summarizer — Database Schema
-- ════════════════════════════════════════════════════════════════
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- to create the summaries table.
--
-- This is equivalent to the SQLAlchemy model in:
--   backend/app/models/db_models.py
-- ════════════════════════════════════════════════════════════════

-- Enable the pgcrypto extension for gen_random_uuid() if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── Summaries Table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS summaries (
    id           UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type  VARCHAR(20)      NOT NULL,          -- 'youtube' or 'pdf'
    source_name  TEXT             NOT NULL,          -- Original URL or filename
    summary      TEXT             NOT NULL,          -- AI-generated summary
    action_items JSONB            NOT NULL DEFAULT '[]'::jsonb,  -- Action items list
    created_at   TIMESTAMPTZ      NOT NULL DEFAULT now()
);

-- ─── Indexes ────────────────────────────────────────────────────
-- Speed up queries that filter by source type
CREATE INDEX IF NOT EXISTS idx_summaries_source_type ON summaries (source_type);

-- Speed up queries that sort by creation date (most recent first)
CREATE INDEX IF NOT EXISTS idx_summaries_created_at ON summaries (created_at DESC);

-- ─── Row Level Security (Optional) ─────────────────────────────
-- Uncomment the lines below if you want to enable RLS.
-- By default, Supabase enables RLS on new tables, so you may need
-- to add policies for your backend's service role key.
--
-- ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
--
-- Allow the service role full access:
-- CREATE POLICY "Service role full access" ON summaries
--     FOR ALL
--     USING (true)
--     WITH CHECK (true);
