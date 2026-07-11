# App Store

A modern, minimal App Store built with Next.js, Tailwind CSS, and Supabase.

## Features

- **Public Store**: Browse apps with search, category filtering, and smooth animations
- **Dark/Light Mode**: System-aware theme switching with manual override
- **Admin Panel**: Secure admin at `/admin` with login
- **App Management**: Add, edit, delete apps with version control
- **Supabase Backend**: All data stored in PostgreSQL via Supabase
- **Responsive Design**: Works beautifully on mobile, tablet, and desktop

## Tech Stack

- **Next.js 14** (App Router, Static Export)
- **React 18** + TypeScript
- **Tailwind CSS** (Custom design system)
- **Supabase** (PostgreSQL + Realtime)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **next-themes** (Dark/Light mode)

## Quick Start

### 1. Clone & Install

```bash
cd app-store
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **Project Settings > API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Go to **SQL Editor** and run the schema below

### 3. Environment Variables

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_USERNAME=shishir
NEXT_PUBLIC_ADMIN_PASSWORD=appstore182
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

### 5. Deploy to Vercel

```bash
npm run build
```

Or connect your GitHub repo to Vercel for automatic deployments.

**Vercel Settings:**
- Framework: Next.js
- Build command: `npm run build`
- Output directory: `dist`
- Add the same environment variables in Vercel dashboard

---

## Supabase Database Schema

Run this in Supabase SQL Editor:

```sql
-- Create apps table
CREATE TABLE apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Other',
  logo_url TEXT,
  banner_url TEXT,
  link TEXT,
  developer TEXT,
  file_size TEXT,
  rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create app_versions table
CREATE TABLE app_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  direct_link TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_apps_category ON apps(category);
CREATE INDEX idx_apps_name ON apps(name);
CREATE INDEX idx_app_versions_app_id ON app_versions(app_id);

-- Enable Row Level Security (RLS) - allow public read
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_versions ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON apps
  FOR SELECT USING (true);

CREATE POLICY "Allow public read versions" ON app_versions
  FOR SELECT USING (true);

-- Allow public insert/update/delete (for admin operations)
-- In production, replace this with authenticated-only policies
CREATE POLICY "Allow public insert" ON apps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON apps
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON apps
  FOR DELETE USING (true);

CREATE POLICY "Allow public insert versions" ON app_versions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update versions" ON app_versions
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete versions" ON app_versions
  FOR DELETE USING (true);
```

---

## Project Structure

```
app-store/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with theme provider
│   │   ├── page.tsx            # Public store page
│   │   ├── globals.css         # Global styles + Tailwind
│   │   └── admin/
│   │       └── page.tsx        # Admin dashboard
│   ├── components/
│   │   ├── Navbar.tsx          # Top navigation
│   │   ├── SearchBar.tsx       # Search input
│   │   ├── CategoryFilter.tsx  # Horizontal category scroll
│   │   ├── AppCard.tsx         # App card in grid
│   │   ├── AppModal.tsx        # App detail modal
│   │   ├── ThemeProvider.tsx   # Theme context
│   │   └── ThemeToggle.tsx     # Light/dark/system toggle
│   ├── hooks/
│   │   ├── useAuth.ts          # Admin auth hook
│   │   └── useApps.ts          # Apps data hook
│   └── lib/
│       ├── supabase.ts         # Supabase client & CRUD
│       ├── types.ts            # TypeScript interfaces
│       └── utils.ts            # Utility functions
├── public/                      # Static assets
├── next.config.js              # Next.js config (static export)
├── tailwind.config.ts          # Tailwind with custom theme
├── package.json                # Dependencies
└── .env.local                  # Environment variables (ignored by git)
```

## Admin Credentials

- **Username:** `shishir`
- **Password:** `appstore182`

Access: `https://your-domain.vercel.app/admin`

There is no link to the admin page on the public site — you must manually type `/admin` in the URL.

## License

MIT
