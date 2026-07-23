'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AppCard } from '@/components/AppCard'
import { SearchBarWithSuggestions } from '@/components/SearchBarWithSuggestions'
import { CategoryFilter } from '@/components/CategoryFilter'
import { Navbar } from '@/components/Navbar'
import { HeroCarousel } from '@/components/HeroCarousel'
import { SkeletonCard, SkeletonCompact, SkeletonList } from '@/components/SkeletonCard'
import { EmptyState } from '@/components/EmptyState'
import { useApps } from '@/hooks/useApps'
import { AppItem } from '@/lib/types'
import { useState, useMemo } from 'react'
import { ArrowDown, LayoutGrid, List, Grid3X3 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const router = useRouter()
  const { apps, loading } = useApps()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'list'>('grid')

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
    router.push(`/app/${app.id}/`)
  }

  const handleSelectSuggestion = (app: AppItem) => {
    setSearchQuery('')
    router.push(`/app/${app.id}/`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section — overflow-hidden REMOVED to fix search dropdown clipping */}
      <section className="relative pt-10 pb-6 px-4 sm:px-6 lg:px-8">
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
            <SearchBarWithSuggestions
              apps={apps}
              value={searchQuery}
              onChange={setSearchQuery}
              onSelectApp={handleSelectSuggestion}
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

      {/* Featured Carousel */}
      <HeroCarousel apps={apps} />

      {/* Featured Grid */}
      {featuredApps.length > 0 && !searchQuery && selectedCategory === 'All' && (
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <ArrowDown className="h-5 w-5 text-primary" />
              Most Popular
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredApps.slice(0, 3).map((app, index) => (
                <AppCard key={app.id} app={app} index={index} onClick={() => handleAppClick(app)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Apps */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {searchQuery || selectedCategory !== 'All' ? 'Results' : 'All Apps'}
              <span className="ml-2 text-sm font-normal text-muted-foreground">({filteredApps.length})</span>
            </h2>

            <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
              <button onClick={() => setViewMode('grid')}
                className={cn('flex items-center justify-center h-8 w-8 rounded-lg transition-all',
                  viewMode === 'grid' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode('compact')}
                className={cn('flex items-center justify-center h-8 w-8 rounded-lg transition-all',
                  viewMode === 'compact' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode('list')}
                className={cn('flex items-center justify-center h-8 w-8 rounded-lg transition-all',
                  viewMode === 'list' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className={cn(
              viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                : viewMode === 'compact' ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4'
                : 'flex flex-col gap-3'
            )}>
              {Array.from({ length: 8 }).map((_, i) => (
                viewMode === 'compact' ? <SkeletonCompact key={i} />
                  : viewMode === 'list' ? <SkeletonList key={i} />
                  : <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredApps.length > 0 ? (
            <div className={cn(
              viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                : viewMode === 'compact' ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4'
                : 'flex flex-col gap-3'
            )}>
              {filteredApps.map((app, index) => (
                <AppCard key={app.id} app={app} index={index} onClick={() => handleAppClick(app)} view={viewMode} />
              ))}
            </div>
          ) : (
            <EmptyState type={searchQuery ? 'no-results' : 'no-apps'} />
          )}
        </div>
      </section>

      <footer className="border-t border-border py-8 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm text-muted-foreground">App Store — Built with Next.js & Supabase</p>
        </div>
      </footer>
    </div>
  )
}
