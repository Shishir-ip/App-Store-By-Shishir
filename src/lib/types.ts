export interface AppVersion {
  id: string
  app_id: string
  version: string
  direct_link: string
  created_at: string
}

export interface AppItem {
  id: string
  name: string
  description: string | null
  category: string
  logo_url: string | null
  banner_url: string | null
  link: string | null
  developer: string | null
  file_size: string | null
  rating: number | null
  downloads: number
  created_at: string
  updated_at: string
  versions?: AppVersion[]
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export type AppCategory =
  | 'Productivity'
  | 'Entertainment'
  | 'IPTV'
  | 'Tools'
  | 'Education'
  | 'Finance'
  | 'Health'
  | 'Photography'
  | 'Windows Apps'
  | 'Utilities'
  | 'Other'

export const CATEGORIES: { name: AppCategory; icon: string; color: string }[] = [
  { name: 'Productivity', icon: 'Briefcase', color: 'bg-blue-500' },
  { name: 'Entertainment', icon: 'Gamepad2', color: 'bg-purple-500' },
  { name: 'IPTV', icon: 'Tv', color: 'bg-violet-500' },
  { name: 'Tools', icon: 'Wrench', color: 'bg-orange-500' },
  { name: 'Education', icon: 'GraduationCap', color: 'bg-green-500' },
  { name: 'Finance', icon: 'Wallet', color: 'bg-emerald-500' },
  { name: 'Health', icon: 'Heart', color: 'bg-rose-500' },
  { name: 'Photography', icon: 'Camera', color: 'bg-indigo-500' },
  { name: 'Windows Apps', icon: 'Monitor', color: 'bg-sky-500' },
  { name: 'Utilities', icon: 'Settings', color: 'bg-slate-500' },
  { name: 'Other', icon: 'Package', color: 'bg-gray-500' },
]
