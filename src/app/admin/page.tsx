'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, LogOut, Plus, Pencil, Trash2, X, ChevronDown,
  Package, Search, AlertTriangle, Download, ExternalLink,
  ArrowLeft, Loader2, Check, Copy, Pin,
  Upload, FileSpreadsheet, CheckSquare, Square,
  Send, Inbox, CheckCircle2, XCircle, Clock
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useApps } from '@/hooks/useApps'
import { AppItem, AppVersion, AppRequest, CATEGORIES } from '@/lib/types'
import { cn, formatDate } from '@/lib/utils'
import { createVersion, updateVersion, deleteVersion, fetchRequests, updateRequestStatus, deleteRequest } from '@/lib/supabase'
import { showToast } from '@/components/Toast'

export default function AdminPage() {
  const { isAuthenticated, isLoading, login, logout } = useAuth()
  const { apps, loading: appsLoading, loadApps, addApp, editApp, removeApp } = useApps()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingApp, setEditingApp] = useState<AppItem | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [adminCategory, setAdminCategory] = useState('All')
  const [activeTab, setActiveTab] = useState<'all' | 'versions'>('all')
  const [selectedAppForVersions, setSelectedAppForVersions] = useState<AppItem | null>(null)

  // Admin view toggle
  const [adminView, setAdminView] = useState<'apps' | 'requests'>('apps')

  // Requests
  const [requests, setRequests] = useState<AppRequest[]>([])
  const [requestsLoading, setRequestsLoading] = useState(false)
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkMode, setBulkMode] = useState(false)

  // Form
  const [formData, setFormData] = useState<Partial<AppItem> & { is_draft?: boolean; priority?: number }>({
    name: '', description: '', category: 'Other', logo_url: '', banner_url: '',
    link: '', developer: '', file_size: '', rating: 0, is_draft: false, priority: 0,
  })
  const [versionForm, setVersionForm] = useState({ version: '', direct_link: '' })
  const [versions, setVersions] = useState<Partial<AppVersion>[]>([])
  const [showVersionForm, setShowVersionForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingVersionIndex, setEditingVersionIndex] = useState<number | null>(null)
  const [editVersionData, setEditVersionData] = useState({ version: '', direct_link: '' })

  // CSV
  const [csvText, setCsvText] = useState('')
  const [showCsvImport, setShowCsvImport] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Load requests when view changes
  useEffect(() => {
    if (isAuthenticated && adminView === 'requests') {
      loadRequests()
    }
  }, [isAuthenticated, adminView])

  const loadRequests = async () => {
    setRequestsLoading(true)
    const data = await fetchRequests()
    setRequests(data)
    setRequestsLoading(false)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    const success = login(username, password)
    if (!success) setLoginError('Invalid username or password')
  }

  const openAddForm = () => {
    setEditingApp(null)
    setFormData({ name: '', description: '', category: 'Other', logo_url: '', banner_url: '', link: '', developer: '', file_size: '', rating: 0, is_draft: false, priority: 0 })
    setVersions([])
    setShowForm(true)
    setActiveTab('all')
    setEditingVersionIndex(null)
  }

  const openEditForm = (app: AppItem) => {
    setEditingApp(app)
    setFormData({ ...app, is_draft: (app as any).is_draft || false, priority: (app as any).priority || 0 })
    setVersions(app.versions || [])
    setShowForm(true)
    setActiveTab('all')
    setEditingVersionIndex(null)
  }

  const handleSave = async () => {
    if (!formData.name) return
    setSaving(true)
    const { versions: _, ...appDataWithoutVersions } = formData
    const appData = { ...appDataWithoutVersions, rating: formData.rating ? Number(formData.rating) : null }

    let app: AppItem | null
    if (editingApp) app = await editApp(editingApp.id, appData)
    else app = await addApp(appData)

    if (app) {
      for (const v of versions) {
        if (v.id) await updateVersion(v.id, v as Partial<AppVersion>)
        else if (v.version && v.direct_link) await createVersion({ ...v, app_id: app.id } as Partial<AppVersion>)
      }
      await loadApps()
      setShowForm(false)
      setEditingApp(null)
      setVersions([])
      setEditingVersionIndex(null)
      showToast(editingApp ? 'App updated!' : 'App created!', 'success')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    const success = await removeApp(id)
    if (success) { setDeleteConfirm(null); showToast('App deleted', 'success') }
  }

  const handleDuplicate = async (app: AppItem) => {
    const { id, created_at, updated_at, versions, downloads, ...rest } = app as any
    const newApp = await addApp({ ...rest, name: `${rest.name} (Copy)`, downloads: 0 })
    if (newApp) {
      for (const v of app.versions || []) {
        await createVersion({ app_id: newApp.id, version: v.version, direct_link: v.direct_link })
      }
      await loadApps()
      showToast('App duplicated!', 'success')
    }
  }

  const handleBulkDelete = async () => {
    for (const id of Array.from(selectedIds)) await removeApp(id)
    setSelectedIds(new Set())
    setBulkMode(false)
    showToast(`${selectedIds.size} apps deleted`, 'success')
  }

  const handleBulkCategory = async (category: string) => {
    for (const id of Array.from(selectedIds)) await editApp(id, { category })
    setSelectedIds(new Set())
    setBulkMode(false)
    await loadApps()
    showToast(`Category updated for ${selectedIds.size} apps`, 'success')
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const selectAll = () => {
    if (selectedIds.size === filteredApps.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(filteredApps.map((a) => a.id)))
  }

  // CSV import
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setCsvText((ev.target?.result as string) || '')
    reader.readAsText(file)
  }

  const parseCsv = async () => {
    const lines = csvText.trim().split('\n')
    if (lines.length < 2) { showToast('CSV is empty', 'error'); return }
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
    let count = 0
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim())
      const obj: any = {}
      headers.forEach((h, idx) => { if (values[idx] !== undefined) obj[h] = values[idx] })
      if (obj.name) {
        await addApp({
          name: obj.name, category: obj.category || 'Other', description: obj.description || '',
          logo_url: obj.logo_url || '', banner_url: obj.banner_url || '', link: obj.link || '',
          developer: obj.developer || '', file_size: obj.file_size || '', rating: obj.rating ? Number(obj.rating) : null,
        })
        count++
      }
    }
    await loadApps()
    setShowCsvImport(false)
    setCsvText('')
    showToast(`${count} apps imported!`, 'success')
  }

  // Versions
  const addVersionToForm = () => {
    if (versionForm.version && versionForm.direct_link) {
      setVersions([...versions, { ...versionForm }])
      setVersionForm({ version: '', direct_link: '' })
      setShowVersionForm(false)
    }
  }
  const removeVersionFromForm = (index: number) => setVersions(versions.filter((_, i) => i !== index))
  const handleDeleteVersion = async (versionId: string) => {
    await deleteVersion(versionId)
    if (editingApp) {
      const updated = { ...editingApp, versions: (editingApp.versions || []).filter((v) => v.id !== versionId) }
      setEditingApp(updated)
      setVersions(updated.versions || [])
      await loadApps()
    }
  }
  const startEditVersion = (index: number, v: Partial<AppVersion>) => {
    setEditingVersionIndex(index)
    setEditVersionData({ version: v.version || '', direct_link: v.direct_link || '' })
  }
  const saveEditVersion = async (index: number) => {
    const v = versions[index]
    if (!v) return
    const updated = { ...v, version: editVersionData.version, direct_link: editVersionData.direct_link }
    const newVersions = [...versions]
    newVersions[index] = updated
    setVersions(newVersions)
    if (v.id) { await updateVersion(v.id, { version: editVersionData.version, direct_link: editVersionData.direct_link }); await loadApps() }
    setEditingVersionIndex(null)
  }
  const cancelEditVersion = () => { setEditingVersionIndex(null); setEditVersionData({ version: '', direct_link: '' }) }

  // Request handlers
  const handleRequestStatus = async (id: string, status: AppRequest['status']) => {
    const success = await updateRequestStatus(id, status)
    if (success) {
      setRequests(requests.map((r) => r.id === id ? { ...r, status } : r))
      showToast(`Request ${status}`, 'success')
    }
  }

  const handleDeleteRequest = async (id: string) => {
    const success = await deleteRequest(id)
    if (success) {
      setRequests(requests.filter((r) => r.id !== id))
      showToast('Request deleted', 'success')
    }
  }

  // Filter
  const filteredApps = apps.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || app.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = adminCategory === 'All' || app.category === adminCategory
    return matchesSearch && matchesCategory
  })

  const filteredRequests = requests.filter((r) => {
    if (requestFilter === 'all') return true
    return r.status === requestFilter
  })

  const pendingCount = requests.filter((r) => r.status === 'pending').length

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-4"><Shield className="h-7 w-7" /></div>
            <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to manage your app store</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div><label className="block text-sm font-medium mb-1.5">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all" placeholder="Enter username" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all" placeholder="Enter password" /></div>
            <AnimatePresence>
              {loginError && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 text-sm text-destructive"><AlertTriangle className="h-4 w-4" /> {loginError}</motion.div>}
            </AnimatePresence>
            <button type="submit" className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">Sign In</button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 w-full glass">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" className="p-2 rounded-lg hover:bg-muted transition-colors"><ArrowLeft className="h-5 w-5" /></a>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Shield className="h-5 w-5" /></div>
                <span className="text-lg font-semibold">Admin</span>
              </div>
            </div>
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><LogOut className="h-4 w-4" /> Sign Out</button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setAdminView('apps')}
            className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
              adminView === 'apps' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}
          >
            <Package className="h-4 w-4" /> Apps
          </button>
          <button
            onClick={() => setAdminView('requests')}
            className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
              adminView === 'requests' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}
          >
            <Inbox className="h-4 w-4" /> Requests
            {pendingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">{pendingCount}</span>
            )}
          </button>
        </div>

        {adminView === 'apps' ? (
          !showForm ? (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard icon={<Package className="h-5 w-5 text-primary" />} value={apps.length} label="Total Apps" />
                <StatCard icon={<Download className="h-5 w-5 text-success" />} value={apps.reduce((sum, a) => sum + (a.downloads || 0), 0).toLocaleString()} label="Total Downloads" />
                <StatCard icon={<ExternalLink className="h-5 w-5 text-warning" />} value={apps.filter((a) => a.versions && a.versions.length > 0).length} label="Multi-Version Apps" />
              </div>

              {/* Actions Bar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search apps..." className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setBulkMode(!bulkMode)} className={cn('flex items-center gap-2 h-11 px-4 rounded-xl font-medium text-sm transition-colors', bulkMode ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}>
                    <CheckSquare className="h-4 w-4" /> {bulkMode ? 'Done' : 'Bulk'}
                  </button>
                  <button onClick={() => setShowCsvImport(!showCsvImport)} className="flex items-center gap-2 h-11 px-4 rounded-xl bg-muted text-muted-foreground hover:text-foreground font-medium text-sm transition-colors">
                    <Upload className="h-4 w-4" /> CSV
                  </button>
                  <button onClick={openAddForm} className="flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Add</button>
                </div>
              </div>

              {/* Bulk Actions */}
              {bulkMode && selectedIds.size > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <span className="text-sm font-medium">{selectedIds.size} selected</span>
                  <select onChange={(e) => e.target.value && handleBulkCategory(e.target.value)} className="h-9 px-3 rounded-lg bg-background border border-border text-sm">
                    <option value="">Change category...</option>
                    {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                  <button onClick={handleBulkDelete} className="h-9 px-3 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors">Delete</button>
                </motion.div>
              )}

              {/* CSV Import */}
              <AnimatePresence>
                {showCsvImport && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
                    <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                      <p className="text-sm font-medium flex items-center gap-2"><FileSpreadsheet className="h-4 w-4" /> Bulk Import CSV</p>
                      <p className="text-xs text-muted-foreground">Format: name,category,description,logo_url,banner_url,link,developer,file_size,rating</p>
                      <input ref={fileRef} type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
                      <button onClick={() => fileRef.current?.click()} className="h-10 px-4 rounded-xl bg-muted text-sm font-medium hover:bg-muted/80 transition-colors">Choose CSV File</button>
                      {csvText && <textarea value={csvText} onChange={(e) => setCsvText(e.target.value)} rows={5} className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-xs font-mono resize-none" />}
                      <div className="flex gap-2">
                        <button onClick={parseCsv} className="px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Import</button>
                        <button onClick={() => { setShowCsvImport(false); setCsvText(''); }} className="px-4 h-10 rounded-xl bg-muted text-sm font-medium hover:bg-muted/80 transition-colors">Cancel</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 mb-6">
                <button onClick={() => setAdminCategory('All')} className={cn('px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all', adminCategory === 'All' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground')}>All ({apps.length})</button>
                {CATEGORIES.map((cat) => {
                  const count = apps.filter((a) => a.category === cat.name).length
                  return <button key={cat.name} onClick={() => setAdminCategory(cat.name)} className={cn('px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all', adminCategory === cat.name ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground')}>{cat.name} ({count})</button>
                })}
              </div>

              {/* Apps List */}
              {appsLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : filteredApps.length > 0 ? (
                <div className="space-y-3">
                  {bulkMode && (
                    <button onClick={selectAll} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-1 mb-1">
                      {selectedIds.size === filteredApps.length ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                      Select All ({filteredApps.length})
                    </button>
                  )}
                  {filteredApps.map((app) => (
                    <motion.div key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-border/80 transition-colors">
                      {bulkMode && (
                        <button onClick={() => toggleSelect(app.id)} className="shrink-0">
                          {selectedIds.has(app.id) ? <CheckSquare className="h-5 w-5 text-primary" /> : <Square className="h-5 w-5 text-muted-foreground" />}
                        </button>
                      )}
                      {app.logo_url ? <img src={app.logo_url} alt={app.name} className="h-12 w-12 rounded-xl object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-foreground font-bold">{app.name.charAt(0).toUpperCase()}</div>}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{app.name}</h3>
                          {(app as any).is_draft && <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-medium">DRAFT</span>}
                          {(app as any).priority > 0 && <Pin className="h-3 w-3 text-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{app.category} &middot; {(app.downloads || 0).toLocaleString()} downloads</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDuplicate(app)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Duplicate"><Copy className="h-4 w-4" /></button>
                        <button onClick={() => { setSelectedAppForVersions(app); setActiveTab('versions'); setShowForm(true); setEditingApp(app); setFormData({ ...app, is_draft: (app as any).is_draft || false, priority: (app as any).priority || 0 }); setVersions(app.versions || []); setEditingVersionIndex(null); }} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Versions"><ChevronDown className="h-4 w-4" /></button>
                        <button onClick={() => openEditForm(app)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Edit"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => setDeleteConfirm(app.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20"><Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No apps found in this category.</p></div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => { setShowForm(false); setEditingApp(null); setSelectedAppForVersions(null); setEditingVersionIndex(null); }} className="p-2 rounded-lg hover:bg-muted transition-colors"><ArrowLeft className="h-5 w-5" /></button>
                <h1 className="text-xl font-bold">{editingApp ? 'Edit App' : 'Add New App'}</h1>
              </div>

              <div className="flex gap-2 mb-6">
                <button onClick={() => setActiveTab('all')} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', activeTab === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}>App Details</button>
                <button onClick={() => setActiveTab('versions')} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', activeTab === 'versions' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}>Versions ({versions.length})</button>
              </div>

              {activeTab === 'all' ? (
                <div className="max-w-2xl space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-medium mb-1.5">App Name <span className="text-destructive">*</span></label>
                      <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all" placeholder="e.g. My Awesome App" /></div>
                    <div><label className="block text-sm font-medium mb-1.5">Category <span className="text-destructive">*</span></label>
                      <select value={formData.category || 'Other'} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all">
                        {CATEGORIES.map((cat) => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                      </select></div>
                  </div>

                  <div><label className="block text-sm font-medium mb-1.5">Description</label>
                    <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all resize-none" placeholder="Brief description..." /></div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-medium mb-1.5">Logo URL</label>
                      <input type="url" value={formData.logo_url || ''} onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all" placeholder="https://..." /></div>
                    <div><label className="block text-sm font-medium mb-1.5">Banner URL</label>
                      <input type="url" value={formData.banner_url || ''} onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all" placeholder="https://..." /></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-medium mb-1.5">Website Link</label>
                      <input type="url" value={formData.link || ''} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all" placeholder="https://..." /></div>
                    <div><label className="block text-sm font-medium mb-1.5">Developer</label>
                      <input type="text" value={formData.developer || ''} onChange={(e) => setFormData({ ...formData, developer: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all" placeholder="Developer name" /></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-medium mb-1.5">File Size</label>
                      <input type="text" value={formData.file_size || ''} onChange={(e) => setFormData({ ...formData, file_size: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all" placeholder="e.g. 25 MB" /></div>
                    <div><label className="block text-sm font-medium mb-1.5">Rating (0-5)</label>
                      <input type="number" min={0} max={5} step={0.1} value={formData.rating || ''} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all" placeholder="4.5" /></div>
                  </div>

                  {/* Priority & Draft */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-medium mb-1.5">Priority (higher = pinned first)</label>
                      <input type="number" min={0} value={formData.priority || 0} onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })} className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all" placeholder="0" /></div>
                    <div className="flex items-center gap-3 h-11">
                      <input id="draft" type="checkbox" checked={formData.is_draft || false} onChange={(e) => setFormData({ ...formData, is_draft: e.target.checked })} className="h-5 w-5 rounded border-border" />
                      <label htmlFor="draft" className="text-sm font-medium cursor-pointer">Save as Draft (hidden from store)</label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={handleSave} disabled={saving || !formData.name} className={cn('flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-medium transition-colors', (saving || !formData.name) && 'opacity-50 cursor-not-allowed')}>
                      {saving ? 'Saving...' : editingApp ? 'Update App' : 'Create App'}
                    </button>
                    <button onClick={() => { setShowForm(false); setEditingApp(null); }} className="h-11 px-6 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="max-w-2xl space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Versions</h2>
                    <button onClick={() => setShowVersionForm(!showVersionForm)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Add Version</button>
                  </div>
                  <AnimatePresence>
                    {showVersionForm && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1.5">Version</label>
                              <input type="text" value={versionForm.version} onChange={(e) => setVersionForm({ ...versionForm, version: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all" placeholder="e.g. 1.2.3" /></div>
                            <div><label className="block text-sm font-medium mb-1.5">Direct Download Link</label>
                              <input type="url" value={versionForm.direct_link} onChange={(e) => setVersionForm({ ...versionForm, direct_link: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all" placeholder="https://..." /></div>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={addVersionToForm} className="px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Add Version</button>
                            <button onClick={() => setShowVersionForm(false)} className="px-4 h-10 rounded-xl bg-muted text-sm font-medium hover:bg-muted/80 transition-colors">Cancel</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {versions.length > 0 ? (
                    <div className="space-y-3">
                      {versions.map((v, index) => (
                        <div key={v.id || index} className="p-4 rounded-2xl bg-card border border-border">
                          {editingVersionIndex === index ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1.5">Version</label>
                                  <input type="text" value={editVersionData.version} onChange={(e) => setEditVersionData({ ...editVersionData, version: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all text-sm" placeholder="e.g. 1.2.3" /></div>
                                <div><label className="block text-sm font-medium mb-1.5">Direct Link</label>
                                  <input type="url" value={editVersionData.direct_link} onChange={(e) => setEditVersionData({ ...editVersionData, direct_link: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all text-sm" placeholder="https://..." /></div>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => saveEditVersion(index)} className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"><Check className="h-3.5 w-3.5" /> Save</button>
                                <button onClick={cancelEditVersion} className="px-3 h-9 rounded-lg bg-muted text-sm font-medium hover:bg-muted/80 transition-colors">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="min-w-0"><p className="font-medium">Version {v.version}</p><p className="text-sm text-muted-foreground truncate max-w-md">{v.direct_link}</p></div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button onClick={() => startEditVersion(index, v)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Edit version"><Pencil className="h-4 w-4" /></button>
                                <button onClick={() => { if (v.id && editingApp) handleDeleteVersion(v.id); else removeVersionFromForm(index); }} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Delete version"><Trash2 className="h-4 w-4" /></button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : <div className="text-center py-12"><p className="text-muted-foreground">No versions added yet.</p></div>}

                  <div className="flex gap-3 pt-4">
                    <button onClick={handleSave} disabled={saving || !formData.name} className={cn('flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-medium transition-colors', (saving || !formData.name) && 'opacity-50 cursor-not-allowed')}>
                      {saving ? 'Saving...' : editingApp ? 'Update App' : 'Create App'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )
        ) : (
          /* ─── REQUESTS VIEW ─── */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" /> App Requests
              </h2>
              <div className="flex gap-1 rounded-xl bg-muted p-1">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setRequestFilter(f)}
                    className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize',
                      requestFilter === f ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {requestsLoading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filteredRequests.length > 0 ? (
              <div className="space-y-3">
                {filteredRequests.map((req) => (
                  <motion.div key={req.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl bg-card border border-border">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{req.name}</h3>
                          {req.status === 'pending' && <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-medium flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</span>}
                          {req.status === 'approved' && <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-medium flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Approved</span>}
                          {req.status === 'rejected' && <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-medium flex items-center gap-1"><XCircle className="h-3 w-3" /> Rejected</span>}
                        </div>
                        {req.category && <p className="text-sm text-muted-foreground mt-0.5">Category: {req.category}</p>}
                        {req.description && <p className="text-sm text-muted-foreground mt-1">{req.description}</p>}
                        {req.link && <a href={req.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-1 inline-block">{req.link}</a>}
                        <p className="text-xs text-muted-foreground mt-2">{formatDate(req.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {req.status === 'pending' && (
                          <>
                            <button onClick={() => handleRequestStatus(req.id, 'approved')} className="p-2 rounded-lg text-success hover:bg-success/10 transition-colors" title="Approve"><CheckCircle2 className="h-4 w-4" /></button>
                            <button onClick={() => handleRequestStatus(req.id, 'rejected')} className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors" title="Reject"><XCircle className="h-4 w-4" /></button>
                          </>
                        )}
                        <button onClick={() => handleDeleteRequest(req.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No requests found.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-sm p-6 rounded-3xl bg-card border border-border shadow-2xl text-center">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4"><AlertTriangle className="h-6 w-6 text-destructive" /></div>
              <h3 className="text-lg font-semibold">Delete App?</h3>
              <p className="text-sm text-muted-foreground mt-2">This action cannot be undone. All versions will also be deleted.</p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 h-11 rounded-xl bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors">Delete</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-11 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">{icon}</div>
        <div><p className="text-2xl font-bold">{value}</p><p className="text-sm text-muted-foreground">{label}</p></div>
      </div>
    </div>
  )
}
