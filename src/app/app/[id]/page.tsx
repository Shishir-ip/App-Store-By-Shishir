import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchAppById, fetchApps } from '@/lib/supabase'
import { AppItem } from '@/lib/types'
import AppDetailClient from './AppDetailClient'
import { AppDetailSkeleton } from '@/components/AppDetailSkeleton'

// Force dynamic rendering — never serve stale cached data
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const app = await fetchAppById(params.id)
  if (!app) {
    return {
      title: 'App Not Found',
      description: 'This app could not be found.',
    }
  }

  const title = `${app.name} — App Store`
  const description = app.description || `Download ${app.name} from App Store`
  const image = app.banner_url || app.logo_url || undefined
  const url = `https://app-store-by-shishir.vercel.app/app/${app.id}/`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'App Store by Shishir',
      images: image ? [{ url: image, width: 1200, height: 630, alt: app.name }] : [],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: url,
    },
  }
}

export async function generateStaticParams() {
  const apps = await fetchApps()
  return apps.map((app: AppItem) => ({ id: app.id }))
}

export default async function AppDetailPage({ params }: Props) {
  const app = await fetchAppById(params.id)

  if (!app) {
    notFound()
  }

  // Fetch all apps for "related" section
  const allApps = await fetchApps()

  return (
    <Suspense fallback={<AppDetailSkeleton />}>
      <AppDetailClient app={app} allApps={allApps} />
    </Suspense>
  )
}
