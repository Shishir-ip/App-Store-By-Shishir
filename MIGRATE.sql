-- Run this in Supabase SQL Editor to add new columns for v3 features

ALTER TABLE apps ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false;
ALTER TABLE apps ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;
ALTER TABLE apps ADD COLUMN IF NOT EXISTS screenshots TEXT[];

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_apps_is_draft ON apps(is_draft);
CREATE INDEX IF NOT EXISTS idx_apps_priority ON apps(priority DESC);
