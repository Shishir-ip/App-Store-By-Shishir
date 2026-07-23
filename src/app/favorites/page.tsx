'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/Navbar'
import { AppCard } from '@/components/AppCard'
import { AppModal } from '@/components/AppModal'
import { useApps } from '@/hooks/useApps'
import { useFavorites } from '@/components/FavoritesProvider'
import { AppItem } from '@/lib/types'
import { useState } from 'react'
import { Heart } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'

export default function FavoritesPage() {
  const { apps, loading } = useApps()
  const { favorites } = useFavorites()
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const favoriteApps = apps.filter((app) => favorites.includes(app.id))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Favorites</h1>
            <p className="text-sm text-muted-foreground">{favoriteApps.length} app{favoriteApps.length !== 1 ? 's' : ''} saved</p>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-card border border-border/50 p-5 animate-pulse h-48" />
            ))}
          </div>
        ) : favoriteApps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {favoriteApps.map((app, index) => (
              <AppCard
                key={app.id}
                app={app}
                index={index}
                onClick={() => { setSelectedApp(app); setModalOpen(true); }}
              />
            ))}
          </div>
        ) : (
          <EmptyState type="no-favorites" />
        )}
      </main>

      <AppModal app={selectedApp} isOpen={modalOpen} onClose={() => {
        setModalOpen(false)
        setTimeout(() => setSelectedApp(null), 300)
      }} />
    </div>
  )
}
