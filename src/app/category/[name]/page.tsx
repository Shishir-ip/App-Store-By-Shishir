import { Metadata } from 'next'
import { AppItem } from '@/lib/types'
import { fetchApps } from '@/lib/supabase'
import CategoryClientPage from './CategoryClientPage'

interface Props {
  params: { name: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.name)
  return {
    title: `${categoryName} Apps — App Store`,
    description: `Browse ${categoryName} apps in our curated store.`,
  }
}

export async function generateStaticParams() {
  const categories = [
    'Entertainment', 'Tools', 'IPTV', 'IPTV Player', 'Customization',
    'Patched', 'Editing Apps', 'Productivity', 'Photography', 'Utilities',
    'Windows Apps', 'TV', 'Education', 'Finance', 'Games', 'Other'
  ]
  return categories.map((name) => ({ name }))
}

export default async function CategoryPage({ params }: Props) {
  const categoryName = decodeURIComponent(params.name)
  const allApps = await fetchApps()
  const apps = allApps.filter((app: AppItem) => app.category === categoryName)

  return <CategoryClientPage categoryName={categoryName} apps={apps} />
}
