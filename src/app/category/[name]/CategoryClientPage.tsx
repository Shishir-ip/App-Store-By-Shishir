'use client'

import { motion } from 'framer-motion'
import { AppCard } from '@/components/AppCard'
import { AppModal } from '@/components/AppModal'
import { Navbar } from '@/components/Navbar'
import { AppItem } from '@/lib/types'
import { useState } from 'react'
import { Package, LayoutGrid, List, Grid3X3 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function CategoryClientPage({ categoryName, apps }: { categoryName: string; apps: AppItem[] }) {
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'list'>('grid')

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm text-muted-foreground mb-2">Category</p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">{categoryName}</h1>
            <p className="mt-3 text-lg text-muted-foreground">{apps.length} app{apps.length !== 1 ? 's' : ''} in this category</p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-4 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-end mb-6">
            <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
              <button onClick={() => setViewMode('grid')} className={cn('flex items-center justify-center h-8 w-8 rounded-lg transition-all', viewMode === 'grid' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}><LayoutGrid className="h-4 w-4" /></button>
              <button onClick={() => setViewMode('compact')} className={cn('flex items-center justify-center h-8 w-8 rounded-lg transition-all', viewMode === 'compact' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}><Grid3X3 className="h-4 w-4" /></button>
              <button onClick={() => setViewMode('list')} className={cn('flex items-center justify-center h-8 w-8 rounded-lg transition-all', viewMode === 'list' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}><List className="h-4 w-4" /></button>
            </div>
          </div>

          {apps.length > 0 ? (
            <div className={cn(
              viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                : viewMode === 'compact' ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4'
                : 'flex flex-col gap-3'
            )}>
              {apps.map((app, index) => (
                <AppCard key={app.id} app={app} index={index} onClick={() => { setSelectedApp(app); setModalOpen(true); }} view={viewMode} />
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4"><Package className="h-8 w-8 text-muted-foreground" /></div>
              <h3 className="text-lg font-semibold text-foreground">No apps yet</h3>
              <p className="text-muted-foreground mt-1">No apps in the {categoryName} category yet.</p>
            </motion.div>
          )}
        </div>
      </section>

      <footer className="border-t border-border py-8 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm text-muted-foreground">App Store — Built with Next.js & Supabase</p>
        </div>
      </footer>

      <AppModal app={selectedApp} isOpen={modalOpen} onClose={() => { setModalOpen(false); setTimeout(() => setSelectedApp(null), 300); }} />
    </div>
  )
}
