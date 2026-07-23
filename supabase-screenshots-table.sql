-- ============================================================
-- App Store: Create app_screenshots relational table
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create the app_screenshots table
CREATE TABLE IF NOT EXISTS app_screenshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index for fast lookups by app_id
CREATE INDEX IF NOT EXISTS idx_app_screenshots_app_id ON app_screenshots(app_id);

-- 3. Enable Row Level Security
ALTER TABLE app_screenshots ENABLE ROW LEVEL SECURITY;

-- 4. Allow public read access
DROP POLICY IF EXISTS "Public read access" ON app_screenshots;
CREATE POLICY "Public read access"
  ON app_screenshots FOR SELECT
  USING (true);

-- 5. Allow authenticated insert/update/delete (for admin)
DROP POLICY IF EXISTS "Authenticated full access" ON app_screenshots;
CREATE POLICY "Authenticated full access"
  ON app_screenshots FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- OPTIONAL: Migrate existing screenshots from apps.screenshots
-- Only run this if you already have data in the old array column
-- ============================================================
/*
INSERT INTO app_screenshots (app_id, url)
SELECT 
  id AS app_id,
  unnest(screenshots) AS url
FROM apps
WHERE screenshots IS NOT NULL
  AND array_length(screenshots, 1) > 0;
*/
