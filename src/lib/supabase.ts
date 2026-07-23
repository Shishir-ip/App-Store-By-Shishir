import { createClient } from '@supabase/supabase-js'
import { AppItem, AppVersion, AppRequest, AppScreenshot } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function fetchApps(includeDrafts = false): Promise<AppItem[]> {
  const { data, error } = await supabase
    .from('apps')
    .select('*, versions:app_versions(*)')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching apps:', error)
    return []
  }

  const apps = (data || []).map((app: any) => ({
    ...app,
    downloads: app.downloads || 0,
    rating: app.rating || 0,
    versions: app.versions || [],
  }))

  // Fetch all screenshots in one query and merge
  const appIds = apps.map((a: AppItem) => a.id)
  const screenshotsMap: Record<string, string[]> = {}

  if (appIds.length > 0) {
    const { data: ssData, error: ssError } = await supabase
      .from('app_screenshots')
      .select('*')
      .in('app_id', appIds)
      .order('created_at', { ascending: true })

    if (!ssError && ssData) {
      for (const ss of ssData as AppScreenshot[]) {
        if (!screenshotsMap[ss.app_id]) screenshotsMap[ss.app_id] = []
        screenshotsMap[ss.app_id].push(ss.url)
      }
    }
  }

  let result = apps.map((app: AppItem) => ({
    ...app,
    screenshots: screenshotsMap[app.id] || [],
  }))

  // Filter out drafts for public store
  if (!includeDrafts) {
    result = result.filter((app: AppItem) => !app.is_draft)
  }

  return result
}

export async function fetchAppById(id: string): Promise<AppItem | null> {
  const { data, error } = await supabase
    .from('apps')
    .select('*, versions:app_versions(*)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching app:', error)
    return null
  }

  // Fetch screenshots from relational table
  const { data: ssData, error: ssError } = await supabase
    .from('app_screenshots')
    .select('*')
    .eq('app_id', id)
    .order('created_at', { ascending: true })

  const screenshots = (!ssError && ssData)
    ? (ssData as AppScreenshot[]).map((s) => s.url)
    : []

  return data ? {
    ...data,
    downloads: data.downloads || 0,
    rating: data.rating || 0,
    versions: data.versions || [],
    screenshots,
  } : null
}

export async function createApp(app: Partial<AppItem>): Promise<AppItem | null> {
  const { data, error } = await supabase
    .from('apps')
    .insert([app])
    .select()
    .single()

  if (error) {
    console.error('Error creating app:', error)
    return null
  }
  return data
}

export async function updateApp(id: string, updates: Partial<AppItem>): Promise<AppItem | null> {
  const { data, error } = await supabase
    .from('apps')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating app:', error)
    return null
  }
  return data
}

export async function deleteApp(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('apps')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting app:', error)
    return false
  }
  return true
}

// ─── Screenshots ───

export async function syncScreenshots(appId: string, urls: string[]): Promise<boolean> {
  // Delete all existing screenshots for this app
  const { error: delError } = await supabase
    .from('app_screenshots')
    .delete()
    .eq('app_id', appId)

  if (delError) {
    console.error('Error deleting old screenshots:', delError)
    return false
  }

  if (urls.length === 0) return true

  // Insert new screenshots
  const rows = urls.map((url) => ({ app_id: appId, url }))
  const { error: insError } = await supabase
    .from('app_screenshots')
    .insert(rows)

  if (insError) {
    console.error('Error inserting screenshots:', insError)
    return false
  }
  return true
}

export async function createScreenshot(screenshot: Partial<AppScreenshot>): Promise<AppScreenshot | null> {
  const { data, error } = await supabase
    .from('app_screenshots')
    .insert([screenshot])
    .select()
    .single()

  if (error) {
    console.error('Error creating screenshot:', error)
    return null
  }
  return data
}

export async function deleteScreenshot(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('app_screenshots')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting screenshot:', error)
    return false
  }
  return true
}

// ─── Versions ───

export async function createVersion(version: Partial<AppVersion>): Promise<AppVersion | null> {
  const { data, error } = await supabase
    .from('app_versions')
    .insert([version])
    .select()
    .single()

  if (error) {
    console.error('Error creating version:', error)
    return null
  }
  return data
}

export async function updateVersion(id: string, updates: Partial<AppVersion>): Promise<AppVersion | null> {
  const { data, error } = await supabase
    .from('app_versions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating version:', error)
    return null
  }
  return data
}

export async function deleteVersion(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('app_versions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting version:', error)
    return false
  }
  return true
}

export async function incrementDownloads(id: string): Promise<void> {
  const { data } = await supabase
    .from('apps')
    .select('downloads')
    .eq('id', id)
    .single()

  const currentDownloads = data?.downloads || 0

  await supabase
    .from('apps')
    .update({ downloads: currentDownloads + 1 })
    .eq('id', id)
}

// ─── App Requests ───

export async function fetchRequests(): Promise<AppRequest[]> {
  const { data, error } = await supabase
    .from('app_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching requests:', error)
    return []
  }
  return (data || []) as AppRequest[]
}

export async function createRequest(request: Partial<AppRequest>): Promise<AppRequest | null> {
  const { data, error } = await supabase
    .from('app_requests')
    .insert([{ ...request, status: 'pending' }])
    .select()
    .single()

  if (error) {
    console.error('Error creating request:', error)
    return null
  }
  return data
}

export async function updateRequestStatus(id: string, status: AppRequest['status']): Promise<boolean> {
  const { error } = await supabase
    .from('app_requests')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating request status:', error)
    return false
  }
  return true
}

export async function deleteRequest(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('app_requests')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting request:', error)
    return false
  }
  return true
}
