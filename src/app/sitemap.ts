import { MetadataRoute } from 'next'
import { fetchApps } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://app-store-by-shishir.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apps = await fetchApps()

  const appPages: MetadataRoute.Sitemap = apps.map((app) => ({
    url: `${BASE_URL}/app/${app.id}/`,
    lastModified: app.updated_at || new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...appPages,
  ]
}
