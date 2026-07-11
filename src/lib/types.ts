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
  | 'Social'
  | 'Entertainment'
  | 'Tools'
  | 'Games'
  | 'Education'
  | 'Finance'
  | 'Health'
  | 'Photography'
  | 'Music'
  | 'Communication'
  | 'Utilities'
  | 'Other'

export const CATEGORIES: { name: string; icon: string; color: string }[] = [
  { name: 'Productivity', icon: 'Briefcase', color: 'bg-blue-500' },
  { name: 'Social', icon: 'Users', color: 'bg-pink-500' },
  { name: 'Entertainment', icon: 'Gamepad2', color: 'bg-purple-500' },
  { name: 'Tools', icon: 'Wrench', color: 'bg-orange-500' },
  { name: 'Games', icon: 'Trophy', color: 'bg-red-500' },
  { name: 'Education', icon: 'GraduationCap', color: 'bg-green-500' },
  { name: 'Finance', icon: 'Wallet', color: 'bg-emerald-500' },
  { name: 'Health', icon: 'Heart', color: 'bg-rose-500' },
  { name: 'Photography', icon: 'Camera', color: 'bg-indigo-500' },
  { name: 'Music', icon: 'Music', color: 'bg-cyan-500' },
  { name: 'Communication', icon: 'MessageCircle', color: 'bg-teal-500' },
  { name: 'Utilities', icon: 'Settings', color: 'bg-slate-500' },
  { name: 'Other', icon: 'Package', color: 'bg-gray-500' },
]
