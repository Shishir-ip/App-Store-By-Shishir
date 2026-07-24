import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchApps } from '@/lib/supabase'
import { AppItem } from '@/lib/types'
import AppDetailClient from './AppDetailClient'

// Force dynamic rendering — never serve stale cached data
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const apps = await fetchApps()
  const app = apps.find((a: AppItem) => a.id === params.id)
  return {
    title: app ? `${app.name} — App Store` : 'App Not Found',
    description: app?.description || 'Discover amazing apps',
  }
}

export async function generateStaticParams() {
  const apps = await fetchApps()
  return apps.map((app: AppItem) => ({ id: app.id }))
}

export default async function AppDetailPage({ params }: Props) {
  const apps = await fetchApps()
  const app = apps.find((a: AppItem) => a.id === params.id)

  if (!app) {
    notFound()
  }

  return <AppDetailClient app={app} allApps={apps} />
}
