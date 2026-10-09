# App Store by Shishir

A modern app listing platform built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

This project includes:
- A public storefront for browsing apps
- A lightweight admin panel for managing listings and versions
- A request workflow for users to suggest new apps

---

## Highlights

- **Modern Next.js App Router architecture**
- **Responsive, animated UI** with Tailwind + Framer Motion
- **Category filtering and search** for quick discovery
- **Version and screenshot management** for each app
- **Supabase-backed persistence** (PostgreSQL + RLS)
- **Dark/light mode support** via `next-themes`

---

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Supabase (`@supabase/supabase-js`)
- Framer Motion

---

## Project Structure

```text
/home/runner/work/App-Store-By-Shishir/App-Store-By-Shishir
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   └── lib/
├── supabase-requests-table.sql
├── supabase-screenshots-table.sql
└── README.md
```

---

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Create local environment file

Create `/home/runner/work/App-Store-By-Shishir/App-Store-By-Shishir/.env.local` and add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_USERNAME=your-admin-username
NEXT_PUBLIC_ADMIN_PASSWORD=your-admin-password
```

### 3) Configure Supabase

1. Create a Supabase project.
2. Copy **Project URL** and **anon key** from **Project Settings → API**.
3. Run your schema SQL in Supabase SQL Editor.
4. Also run:
   - `/home/runner/work/App-Store-By-Shishir/App-Store-By-Shishir/supabase-requests-table.sql`
   - `/home/runner/work/App-Store-By-Shishir/App-Store-By-Shishir/supabase-screenshots-table.sql`

### 4) Run locally

```bash
npm run dev
```

Open:
- Storefront: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

---

## Scripts

- `npm run dev` — start development server
- `npm run build` — create production build
- `npm run start` — run production server
- `npm run lint` — run lint checks

---

## Deployment

This project can be deployed to Vercel.

Recommended settings:
- Framework preset: **Next.js**
- Build command: `npm run build`
- Add the same environment variables from `.env.local` in the deployment environment

---

## Security Notes (Important Before Making Public)

You can make this repository public, but keep these points in mind:

1. **Do not commit `.env.local`** (it is already git-ignored).
2. **`NEXT_PUBLIC_*` variables are exposed to the browser by design**. Treat them as non-secret.
3. The current admin authentication is **client-side** and not suitable for production-grade security.
4. Current Supabase policies allow broad write access for app operations in SQL scripts. For production, restrict write policies to authenticated/authorized users only.

If you plan to run this publicly in production, move admin authorization to a secure server-side flow (e.g., Supabase Auth + role-based RLS).

---

## License

MIT
