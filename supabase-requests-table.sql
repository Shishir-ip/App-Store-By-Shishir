-- Run this in your Supabase SQL Editor to create the app_requests table

CREATE TABLE IF NOT EXISTS app_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  link TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE app_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (users submitting requests)
CREATE POLICY "Allow public insert" ON app_requests
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read (admins will read via admin page)
CREATE POLICY "Allow public read" ON app_requests
  FOR SELECT USING (true);

-- Allow anyone to update/delete (since you use a simple auth check in the app)
-- In production, you should restrict this to authenticated admin users only
CREATE POLICY "Allow public update" ON app_requests
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON app_requests
  FOR DELETE USING (true);
