'use client'

import { useState, useEffect, useCallback } from 'react'
import { AppItem } from '@/lib/types'
import { fetchApps, fetchAppById, createApp, updateApp, deleteApp } from '@/lib/supabase'

export function useApps(includeDrafts = false) {
  const [apps, setApps] = useState<AppItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadApps = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchApps(includeDrafts)
      setApps(data)
    } catch (err) {
      setError('Failed to load apps')
    } finally {
      setLoading(false)
    }
  }, [includeDrafts])

  useEffect(() => {
    loadApps()
  }, [loadApps])

  const addApp = useCallback(async (app: Partial<AppItem>) => {
    const newApp = await createApp(app)
    if (newApp) {
      setApps((prev) => [newApp, ...prev])
    }
    return newApp
  }, [])

  const editApp = useCallback(async (id: string, updates: Partial<AppItem>) => {
    const updated = await updateApp(id, updates)
    if (updated) {
      setApps((prev) => prev.map((app) => (app.id === id ? updated : app)))
    }
    return updated
  }, [])

  const removeApp = useCallback(async (id: string) => {
    const success = await deleteApp(id)
    if (success) {
      setApps((prev) => prev.filter((app) => app.id !== id))
    }
    return success
  }, [])

  return { apps, loading, error, loadApps, addApp, editApp, removeApp }
}

export function useApp(id: string) {
  const [app, setApp] = useState<AppItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchAppById(id).then((data) => {
        setApp(data)
        setLoading(false)
      })
    }
  }, [id])

  return { app, loading }
}
