import { createClient } from '@supabase/supabase-js'
import { AppItem, AppVersion, AppRequest } from './types'

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

  let apps = (data || []).map((app: any) => ({
    ...app,
    downloads: app.downloads || 0,
    rating: app.rating || 0,
    versions: app.versions || [],
  }))

  // Filter out drafts for public store
  if (!includeDrafts) {
    apps = apps.filter((app: AppItem) => !app.is_draft)
  }

  return apps
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

  return data ? {
    ...data,
    downloads: data.downloads || 0,
    rating: data.rating || 0,
    versions: data.versions || [],
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
