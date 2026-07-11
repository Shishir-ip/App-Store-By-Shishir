'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AppCard } from '@/components/AppCard'
import { AppModal } from '@/components/AppModal'
import { SearchBar } from '@/components/SearchBar'
import { CategoryFilter } from '@/components/CategoryFilter'
import { Navbar } from '@/components/Navbar'
import { useApps } from '@/hooks/useApps'
import { AppItem } from '@/lib/types'
import { useState, useMemo } from 'react'
import { Package, Loader2, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const { apps, loading } = useApps()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [apps, searchQuery, selectedCategory])

  const featuredApps = useMemo(() => {
    return [...apps].sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 6)
  }, [apps])

  const handleAppClick = (app: AppItem) => {
    setSelectedApp(app)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setTimeout(() => setSelectedApp(null), 300)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Discover Amazing{' '}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Apps
              </span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Browse, download, and explore a curated collection of the best applications.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 max-w-xl mx-auto"
          >
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search for apps, tools, games..."
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6"
          >
            <CategoryFilter
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      {featuredApps.length > 0 && !searchQuery && selectedCategory === 'All' && (
        <section className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <ArrowDown className="h-5 w-5 text-primary" />
              Most Popular
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredApps.map((app, index) => (
                <AppCard
                  key={app.id}
                  app={app}
                  index={index}
                  onClick={() => handleAppClick(app)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Apps Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-xl font-semibold mb-6">
            {searchQuery || selectedCategory !== 'All' ? 'Results' : 'All Apps'}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredApps.length})
            </span>
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Loading apps...</p>
            </div>
          ) : filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredApps.map((app, index) => (
                <AppCard
                  key={app.id}
                  app={app}
                  index={index}
                  onClick={() => handleAppClick(app)}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No apps found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or category filter.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm text-muted-foreground">
            App Store — Built with Next.js & Supabase
          </p>
        </div>
      </footer>

      {/* Modal */}
      <AppModal
        app={selectedApp}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
