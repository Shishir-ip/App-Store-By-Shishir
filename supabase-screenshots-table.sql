-- ============================================================
-- App Store: app_screenshots table + RLS policies
-- Run ALL of this in Supabase SQL Editor (one shot)
-- ============================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS app_screenshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index
CREATE INDEX IF NOT EXISTS idx_app_screenshots_app_id ON app_screenshots(app_id);

-- 3. Enable RLS
ALTER TABLE app_screenshots ENABLE ROW LEVEL SECURITY;

-- 4. Delete any old/broken policies
DROP POLICY IF EXISTS "Public read access" ON app_screenshots;
DROP POLICY IF EXISTS "Authenticated full access" ON app_screenshots;

-- 5. Allow ANYONE to read (public store + app detail pages)
CREATE POLICY "Public read access"
  ON app_screenshots FOR SELECT
  USING (true);

-- 6. Allow ANYONE to insert/update/delete
--    (Your app uses anon key; admin login is app-level, not Supabase Auth)
CREATE POLICY "Allow all writes"
  ON app_screenshots FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- OPTIONAL: Migrate old screenshots from apps.screenshots column
-- Uncomment and run only if you had screenshots in the old array
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
