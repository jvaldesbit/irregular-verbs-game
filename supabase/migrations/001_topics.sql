-- ══════════════════════════════════════════════════════════════════════════════
-- 001_topics.sql  —  schema only, no data
-- Run this once in the Supabase SQL editor.
-- ══════════════════════════════════════════════════════════════════════════════

-- Topics: lightweight metadata + URL to the JSON payload stored in R2
CREATE TABLE IF NOT EXISTS topics (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        text        UNIQUE NOT NULL,
  name_en     text        NOT NULL,
  name_es     text        NOT NULL,
  icon        text        NOT NULL DEFAULT '📚',
  sort_order  int         NOT NULL DEFAULT 0,
  payload_url text        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- App config: key/value store for admin-only settings (e.g. R2 credentials)
CREATE TABLE IF NOT EXISTS app_config (
  key   text NOT NULL PRIMARY KEY,
  value text NOT NULL
);

-- ── Row Level Security ─────────────────────────────────────────────────────

ALTER TABLE topics     ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- topics: anyone can read, only authenticated admin can write
CREATE POLICY "public read topics"  ON topics     FOR SELECT USING (true);
CREATE POLICY "auth write topics"   ON topics     FOR ALL    TO authenticated USING (true) WITH CHECK (true);

-- app_config: only authenticated admin can read or write
CREATE POLICY "auth only app_config" ON app_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
