'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, LogOut, Plus, Pencil, Trash2, X, ChevronDown,
  Package, Search, AlertTriangle, Download, ExternalLink,
  ArrowLeft, Loader2, Check, LayoutGrid
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useApps } from '@/hooks/useApps'
import { AppItem, AppVersion, CATEGORIES } from '@/lib/types'
import { cn, formatDate } from '@/lib/utils'
import {
  createVersion, updateVersion, deleteVersion
} from '@/lib/supabase'

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

  const [formData, setFormData] = useState<Partial<AppItem>>({
    name: '', description: '', category: 'Other',
    logo_url: '', banner_url: '', link: '',
    developer: '', file_size: '', rating: 0,
  })

  const [versionForm, setVersionForm] = useState({ version: '', direct_link: '' })
  const [versions, setVersions] = useState<Partial<AppVersion>[]>([])
  const [showVersionForm, setShowVersionForm] = useState(false)
  const [saving, setSaving] = useState(false)

  // Inline version editing
  const [editingVersionIndex, setEditingVersionIndex] = useState<number | null>(null)
  const [editVersionData, setEditVersionData] = useState({ version: '', direct_link: '' })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    const success = login(username, password)
    if (!success) setLoginError('Invalid username or password')
  }

  const openAddForm = () => {
    setEditingApp(null)
    setFormData({ name: '', description: '', category: 'Other', logo_url: '', banner_url: '', link: '', developer: '', file_size: '', rating: 0 })
    setVersions([])
    setShowForm(true)
    setActiveTab('all')
    setEditingVersionIndex(null)
  }

  const openEditForm = (app: AppItem) => {
    setEditingApp(app)
    setFormData({ ...app })
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
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    const success = await removeApp(id)
    if (success) setDeleteConfirm(null)
  }

  const addVersionToForm = () => {
    if (versionForm.version && versionForm.direct_link) {
      setVersions([...versions, { ...versionForm }])
      setVersionForm({ version: '', direct_link: '' })
      setShowVersionForm(false)
    }
  }

  const removeVersionFromForm = (index: number) => {
    setVersions(versions.filter((_, i) => i !== index))
  }

  const handleDeleteVersion = async (versionId: string) => {
    await deleteVersion(versionId)
    if (editingApp) {
      const updated = { ...editingApp, versions: (editingApp.versions || []).filter(v => v.id !== versionId) }
      setEditingApp(updated)
      setVersions(updated.versions || [])
      await loadApps()
    }
  }

  // Inline edit version
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

    if (v.id) {
      await updateVersion(v.id, { version: editVersionData.version, direct_link: editVersionData.direct_link })
      await loadApps()
    }
    setEditingVersionIndex(null)
  }

  const cancelEditVersion = () => {
    setEditingVersionIndex(null)
    setEditVersionData({ version: '', direct_link: '' })
  }

  // Filter apps by search + category
  const filteredApps = apps.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = adminCategory === 'All' || app.category === adminCategory
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-4">
              <Shield className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to manage your app store</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                placeholder="Enter username" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                placeholder="Enter password" />
            </div>
            <AnimatePresence>
              {loginError && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" /> {loginError}
                </motion.div>
              )}
            </AnimatePresence>
            <button type="submit" className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <nav className="sticky top-0 z-50 w-full glass">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </a>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-lg font-semibold">Admin</span>
              </div>
            </div>
            <button onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {!showForm ? (
          <>
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-5 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{apps.length}</p>
                    <p className="text-sm text-muted-foreground">Total Apps</p>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Download className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{apps.reduce((sum, a) => sum + (a.downloads || 0), 0).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Downloads</p>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <ExternalLink className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{apps.filter(a => a.versions && a.versions.length > 0).length}</p>
                    <p className="text-sm text-muted-foreground">Multi-Version Apps</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search apps..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all" />
              </div>
              <button onClick={openAddForm}
                className="flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shrink-0">
                <Plus className="h-4 w-4" /> Add App
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 mb-6">
              <button onClick={() => setAdminCategory('All')}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200',
                  adminCategory === 'All' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                )}>
                All ({apps.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = apps.filter(a => a.category === cat.name).length
                return (
                  <button key={cat.name} onClick={() => setAdminCategory(cat.name)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200',
                      adminCategory === cat.name ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                    )}>
                    {cat.name} ({count})
                  </button>
                )
              })}
            </div>

            {/* Apps Table */}
            {appsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredApps.length > 0 ? (
              <div className="space-y-3">
                {filteredApps.map((app) => (
                  <motion.div key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-border/80 transition-colors">
                    {app.logo_url ? (
                      <img src={app.logo_url} alt={app.name} className="h-12 w-12 rounded-xl object-cover" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-foreground font-bold">
                        {app.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{app.name}</h3>
                      <p className="text-sm text-muted-foreground">{app.category} &middot; {(app.downloads || 0).toLocaleString()} downloads</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => {
                        setSelectedAppForVersions(app)
                        setActiveTab('versions')
                        setShowForm(true)
                        setEditingApp(app)
                        setFormData({ ...app })
                        setVersions(app.versions || [])
                        setEditingVersionIndex(null)
                      }} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Manage versions">
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button onClick={() => openEditForm(app)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteConfirm(app.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No apps found in this category.</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Form Header */}
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => { setShowForm(false); setEditingApp(null); setSelectedAppForVersions(null); setEditingVersionIndex(null); }}
                className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold">{editingApp ? 'Edit App' : 'Add New App'}</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button onClick={() => setActiveTab('all')}
                className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeTab === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}>
                App Details
              </button>
              <button onClick={() => setActiveTab('versions')}
                className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeTab === 'versions' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}>
                Versions ({versions.length})
              </button>
            </div>

            {activeTab === 'all' ? (
              <div className="max-w-2xl space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">App Name <span className="text-destructive">*</span></label>
                    <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                      placeholder="e.g. My Awesome App" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Category <span className="text-destructive">*</span></label>
                    <select value={formData.category || 'Other'} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all">
                      {CATEGORIES.map((cat) => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all resize-none"
                    placeholder="Brief description of the app..." />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Logo URL</label>
                    <input type="url" value={formData.logo_url || ''} onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                      placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Banner URL</label>
                    <input type="url" value={formData.banner_url || ''} onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                      placeholder="https://..." />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Website Link</label>
                    <input type="url" value={formData.link || ''} onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                      placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Developer</label>
                    <input type="text" value={formData.developer || ''} onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                      placeholder="Developer name" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">File Size</label>
                    <input type="text" value={formData.file_size || ''} onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                      placeholder="e.g. 25 MB" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Rating (0-5)</label>
                    <input type="number" min={0} max={5} step={0.1} value={formData.rating || ''}
                      onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                      className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                      placeholder="4.5" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={handleSave} disabled={saving || !formData.name}
                    className={cn('flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-medium transition-colors',
                      (saving || !formData.name) && 'opacity-50 cursor-not-allowed')}>
                    {saving ? 'Saving...' : editingApp ? 'Update App' : 'Create App'}
                  </button>
                  <button onClick={() => { setShowForm(false); setEditingApp(null); }}
                    className="h-11 px-6 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Versions</h2>
                  <button onClick={() => setShowVersionForm(!showVersionForm)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                    <Plus className="h-4 w-4" /> Add Version
                  </button>
                </div>

                <AnimatePresence>
                  {showVersionForm && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1.5">Version</label>
                            <input type="text" value={versionForm.version} onChange={(e) => setVersionForm({ ...versionForm, version: e.target.value })}
                              className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                              placeholder="e.g. 1.2.3" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1.5">Direct Download Link</label>
                            <input type="url" value={versionForm.direct_link} onChange={(e) => setVersionForm({ ...versionForm, direct_link: e.target.value })}
                              className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                              placeholder="https://..." />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={addVersionToForm}
                            className="px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Add Version</button>
                          <button onClick={() => setShowVersionForm(false)}
                            className="px-4 h-10 rounded-xl bg-muted text-sm font-medium hover:bg-muted/80 transition-colors">Cancel</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {versions.length > 0 ? (
                  <div className="space-y-3">
                    {versions.map((v, index) => (
                      <div key={v.id || index}
                        className="p-4 rounded-2xl bg-card border border-border">
                        {editingVersionIndex === index ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1.5">Version</label>
                                <input type="text" value={editVersionData.version}
                                  onChange={(e) => setEditVersionData({ ...editVersionData, version: e.target.value })}
                                  className="w-full h-10 px-3 rounded-lg bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all text-sm"
                                  placeholder="e.g. 1.2.3" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1.5">Direct Link</label>
                                <input type="url" value={editVersionData.direct_link}
                                  onChange={(e) => setEditVersionData({ ...editVersionData, direct_link: e.target.value })}
                                  className="w-full h-10 px-3 rounded-lg bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all text-sm"
                                  placeholder="https://..." />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => saveEditVersion(index)}
                                className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                                <Check className="h-3.5 w-3.5" /> Save
                              </button>
                              <button onClick={cancelEditVersion}
                                className="px-3 h-9 rounded-lg bg-muted text-sm font-medium hover:bg-muted/80 transition-colors">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="min-w-0">
                              <p className="font-medium">Version {v.version}</p>
                              <p className="text-sm text-muted-foreground truncate max-w-md">{v.direct_link}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button onClick={() => startEditVersion(index, v)}
                                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Edit version">
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button onClick={() => {
                                if (v.id && editingApp) handleDeleteVersion(v.id)
                                else removeVersionFromForm(index)
                              }} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Delete version">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No versions added yet.</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button onClick={handleSave} disabled={saving || !formData.name}
                    className={cn('flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-medium transition-colors',
                      (saving || !formData.name) && 'opacity-50 cursor-not-allowed')}>
                    {saving ? 'Saving...' : editingApp ? 'Update App' : 'Create App'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm p-6 rounded-3xl bg-card border border-border shadow-2xl text-center">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold">Delete App?</h3>
              <p className="text-sm text-muted-foreground mt-2">This action cannot be undone. All versions will also be deleted.</p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 h-11 rounded-xl bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors">Delete</button>
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 h-11 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
