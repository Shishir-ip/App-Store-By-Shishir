'use client'

import { Download, Star, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { AppItem } from '@/lib/types'
import { cn } from '@/lib/utils'
import { incrementDownloads } from '@/lib/supabase'
import { useFavorites } from './FavoritesProvider'
import { showToast } from './Toast'

interface AppCardProps {
  app: AppItem
  index: number
  onClick: () => void
  view?: 'grid' | 'compact' | 'list'
}

export function AppCard({ app, index, onClick, view = 'grid' }: AppCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const link = app.versions?.[0]?.direct_link || app.link
    if (link) {
      await incrementDownloads(app.id)
      showToast('Download started!', 'success')
      window.open(link, '_blank')
    }
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(app.id)
    showToast(isFavorite(app.id) ? 'Removed from favorites' : 'Added to favorites', 'success')
  }

  const hasVersions = app.versions && app.versions.length > 0
  const displayVersion = hasVersions ? app.versions![0].version : '1.0.0'

  // ─── COMPACT VIEW ───
  if (view === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, delay: index * 0.03 }}
        whileHover={{ scale: 1.06, transition: { duration: 0.15 } }}
        onClick={onClick}
        className="group cursor-pointer flex flex-col items-center text-center relative"
      >
        {app.logo_url ? (
          <img
            src={app.logo_url}
            alt={app.name}
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover shadow-md group-hover:shadow-lg transition-shadow"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-xl shadow-md group-hover:shadow-lg transition-shadow">
            {app.name.charAt(0).toUpperCase()}
          </div>
        )}
        <p className="mt-2 text-xs font-medium text-foreground truncate w-full px-1 group-hover:text-primary transition-colors">
          {app.name}
        </p>
        <p className="text-[10px] text-muted-foreground truncate w-full px-1">{app.category}</p>
        {isFavorite(app.id) && (
          <Heart className="absolute -top-1 -right-1 h-3.5 w-3.5 text-rose-500 fill-rose-500" />
        )}
      </motion.div>
    )
  }

  // ─── LIST VIEW ───
  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.04 }}
        whileHover={{ x: 4, transition: { duration: 0.15 } }}
        onClick={onClick}
        className={cn(
          'group flex items-center gap-4 cursor-pointer rounded-2xl',
          'bg-card border border-border/50 p-4',
          'hover:border-border hover:shadow-md hover:shadow-primary/5',
          'transition-shadow duration-300'
        )}
      >
        {app.logo_url ? (
          <img src={app.logo_url} alt={app.name} className="h-14 w-14 rounded-xl object-cover shadow-sm shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-lg shadow-sm shrink-0">
            {app.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{app.name}</h3>
            {isFavorite(app.id) && <Heart className="h-3 w-3 text-rose-500 fill-rose-500 shrink-0" />}
          </div>
          <p className="text-sm text-muted-foreground truncate">{app.category}{app.description ? ` · ${app.description}` : ''}</p>
          <div className="flex items-center gap-3 mt-1">
            {app.rating && app.rating > 0 && (
              <div className="flex items-center gap-1 text-amber-500"><Star className="h-3 w-3 fill-current" /><span className="text-xs font-medium">{app.rating.toFixed(1)}</span></div>
            )}
            <div className="flex items-center gap-1 text-muted-foreground"><Download className="h-3 w-3" /><span className="text-xs">{(app.downloads || 0).toLocaleString()}</span></div>
            {displayVersion && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">v{displayVersion}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleFavorite} className={cn('p-2 rounded-lg transition-colors', isFavorite(app.id) ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500')}>
            <Heart className={cn('h-4 w-4', isFavorite(app.id) && 'fill-current')} />
          </button>
          <button onClick={handleDownload} className={cn('flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all')}>
            <Download className="h-4 w-4" /><span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </motion.div>
    )
  }

  // ─── GRID VIEW ───
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={cn(
        'group relative cursor-pointer rounded-2xl',
        'bg-card border border-border/50',
        'hover:border-border hover:shadow-lg hover:shadow-primary/5',
        'transition-shadow duration-300'
      )}
    >
      {/* Favorite button */}
      <button
        onClick={handleFavorite}
        className={cn(
          'absolute top-3 right-3 z-10 p-1.5 rounded-full transition-all',
          isFavorite(app.id)
            ? 'bg-rose-500/10 text-rose-500'
            : 'opacity-0 group-hover:opacity-100 bg-background/80 text-muted-foreground hover:text-rose-500'
        )}
      >
        <Heart className={cn('h-4 w-4', isFavorite(app.id) && 'fill-current')} />
      </button>

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            {app.logo_url ? (
              <img src={app.logo_url} alt={app.name} className="h-16 w-16 rounded-2xl object-cover shadow-sm"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-xl shadow-sm">
                {app.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{app.name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{app.category}</p>
            <div className="flex items-center gap-3 mt-1.5">
              {app.rating && app.rating > 0 && (
                <div className="flex items-center gap-1 text-amber-500"><Star className="h-3.5 w-3.5 fill-current" /><span className="text-xs font-medium">{app.rating.toFixed(1)}</span></div>
              )}
              <div className="flex items-center gap-1 text-muted-foreground"><Download className="h-3.5 w-3.5" /><span className="text-xs">{(app.downloads || 0).toLocaleString()}</span></div>
              {displayVersion && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">v{displayVersion}</span>}
            </div>
          </div>
        </div>

        {app.description && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{app.description}</p>
        )}
      </div>

      <div className="px-5 pb-4">
        <button onClick={handleDownload} className={cn('w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all')}>
          <Download className="h-4 w-4" /> Download
        </button>
      </div>
    </motion.div>
  )
}
