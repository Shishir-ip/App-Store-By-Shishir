'use client'

import { Download, Star, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { AppItem } from '@/lib/types'
import { cn } from '@/lib/utils'
import { incrementDownloads } from '@/lib/supabase'

interface AppCardProps {
  app: AppItem
  index: number
  onClick: () => void
}

export function AppCard({ app, index, onClick }: AppCardProps) {
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const link = app.versions?.[0]?.direct_link || app.link
    if (link) {
      await incrementDownloads(app.id)
      window.open(link, '_blank')
    }
  }

  const hasVersions = app.versions && app.versions.length > 0
  const displayVersion = hasVersions ? app.versions![0].version : '1.0.0'

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
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            {app.logo_url ? (
              <img
                src={app.logo_url}
                alt={app.name}
                className="h-16 w-16 rounded-2xl object-cover shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-xl shadow-sm">
                {app.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {app.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {app.category}
            </p>
            <div className="flex items-center gap-3 mt-1.5">
              {app.rating && app.rating > 0 && (
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="text-xs font-medium">{app.rating.toFixed(1)}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Download className="h-3.5 w-3.5" />
                <span className="text-xs">{(app.downloads || 0).toLocaleString()}</span>
              </div>
              {displayVersion && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  v{displayVersion}
                </span>
              )}
            </div>
          </div>
        </div>

        {app.description && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {app.description}
          </p>
        )}
      </div>

      <div className="px-5 pb-4">
        <button
          onClick={handleDownload}
          className={cn(
            'w-full flex items-center justify-center gap-2',
            'py-2.5 px-4 rounded-xl text-sm font-medium',
            'bg-primary text-primary-foreground',
            'hover:bg-primary/90 active:scale-[0.98]',
            'transition-all duration-200'
          )}
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>
    </motion.div>
  )
}
