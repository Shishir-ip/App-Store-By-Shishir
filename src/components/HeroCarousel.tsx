'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Download, Star } from 'lucide-react'
import { AppItem } from '@/lib/types'
import { cn } from '@/lib/utils'
import { incrementDownloads } from '@/lib/supabase'

interface HeroCarouselProps {
  apps: AppItem[]
}

export function HeroCarousel({ apps }: HeroCarouselProps) {
  const featured = [...apps].sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 5)
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent((c) => (c + 1) % featured.length), [featured.length])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + featured.length) % featured.length), [featured.length])

  useEffect(() => {
    if (featured.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, featured.length])

  if (featured.length === 0) return null

  const app = featured[current]

  const handleDownload = async () => {
    const link = app.versions?.[0]?.direct_link || app.link
    if (link) {
      await incrementDownloads(app.id)
      window.open(link, '_blank')
    }
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border">
        <AnimatePresence mode="wait">
          <motion.div
            key={app.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="relative min-h-[280px] sm:min-h-[320px] flex items-end"
          >
            {/* Background */}
            {app.banner_url ? (
              <img
                src={app.banner_url}
                alt={app.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-secondary" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

            {/* Content */}
            <div className="relative z-10 p-6 sm:p-8 w-full">
              <div className="flex items-end gap-4 sm:gap-6">
                {app.logo_url ? (
                  <img
                    src={app.logo_url}
                    alt={app.name}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover shadow-lg border-2 border-background"
                  />
                ) : (
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-2xl shadow-lg border-2 border-background">
                    {app.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 pb-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
                    <Star className="h-3 w-3 fill-current" /> Featured
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold truncate">{app.name}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5 truncate">{app.category}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold',
                    'bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
                  )}
                >
                  <Download className="h-4 w-4" /> Get
                </button>
                <a
                  href={`/app/${app.id}/`}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-muted hover:bg-muted/80 transition-colors"
                >
                  View
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        {featured.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {featured.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    i === current ? 'w-5 bg-primary' : 'w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/60'
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
