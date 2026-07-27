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
import { ArrowDown, LayoutGrid, List, Grid3X3, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const APPS_PER_PAGE = 12

export default function HomePage() {
  const router = useRouter()
  const { apps, loading } = useApps()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [apps, searchQuery, selectedCategory])

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  const totalPages = Math.max(1, Math.ceil(filteredApps.length / APPS_PER_PAGE))
  const paginatedApps = useMemo(() => {
    const start = (currentPage - 1) * APPS_PER_PAGE
    return filteredApps.slice(start, start + APPS_PER_PAGE)
  }, [filteredApps, currentPage])

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

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    return pages
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
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
          ) : paginatedApps.length > 0 ? (
            <>
              <div className={cn(
                viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                  : viewMode === 'compact' ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4'
                  : 'flex flex-col gap-3'
              )}>
                {paginatedApps.map((app, index) => (
                  <AppCard key={app.id} app={app} index={index} onClick={() => handleAppClick(app)} view={viewMode} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                      currentPage === 1
                        ? 'text-muted-foreground cursor-not-allowed'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => (
                      page === '...' ? (
                        <span key={`dots-${idx}`} className="px-2 text-sm text-muted-foreground">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page as number)}
                          className={cn(
                            'h-9 min-w-[36px] px-3 rounded-xl text-sm font-medium transition-colors',
                            currentPage === page
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                          )}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                      currentPage === totalPages
                        ? 'text-muted-foreground cursor-not-allowed'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    )}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              <p className="text-center text-xs text-muted-foreground mt-3">
                Showing {(currentPage - 1) * APPS_PER_PAGE + 1}–{Math.min(currentPage * APPS_PER_PAGE, filteredApps.length)} of {filteredApps.length} apps
              </p>
            </>
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
