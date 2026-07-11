'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Star, ExternalLink, Calendar, User, Hash, ChevronDown, ChevronUp } from 'lucide-react'
import { AppItem } from '@/lib/types'
import { cn, formatDate } from '@/lib/utils'
import { incrementDownloads } from '@/lib/supabase'

interface AppModalProps {
  app: AppItem | null
  isOpen: boolean
  onClose: () => void
}

export function AppModal({ app, isOpen, onClose }: AppModalProps) {
  const [showVersions, setShowVersions] = useState(false)

  if (!app) return null

  const handleDownload = async (link?: string) => {
    const downloadLink = link || app.versions?.[0]?.direct_link || app.link
    if (downloadLink) {
      await incrementDownloads(app.id)
      window.open(downloadLink, '_blank')
    }
  }

  const hasVersions = app.versions && app.versions.length > 0
  const allVersions = hasVersions ? app.versions! : []

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl',
              'bg-card border border-border shadow-2xl'
            )}
          >
            {/* Banner */}
            <div className="relative h-40 w-full overflow-hidden rounded-t-3xl">
              {app.banner_url ? (
                <img
                  src={app.banner_url}
                  alt={app.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-primary/20 via-primary/10 to-secondary" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 pb-6 -mt-10 relative">
              {/* Logo and Title */}
              <div className="flex items-end gap-4">
                {app.logo_url ? (
                  <img
                    src={app.logo_url}
                    alt={app.name}
                    className="h-20 w-20 rounded-2xl object-cover shadow-lg border-4 border-card"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-2xl shadow-lg border-4 border-card">
                    {app.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="mb-1">
                  <h2 className="text-2xl font-bold text-foreground">{app.name}</h2>
                  <p className="text-sm text-muted-foreground">{app.category}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mt-4">
                {app.rating && app.rating > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="font-semibold">{app.rating.toFixed(1)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Download className="h-4 w-4" />
                  <span>{(app.downloads || 0).toLocaleString()} downloads</span>
                </div>
              </div>

              {/* Description */}
              {app.description && (
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {app.description}
                </p>
              )}

              {/* Meta Info */}
              <div className="mt-4 space-y-2">
                {app.developer && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Developer: {app.developer}</span>
                  </div>
                )}
                {app.file_size && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    <span>Size: {app.file_size}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Added: {formatDate(app.created_at)}</span>
                </div>
              </div>

              {/* Versions */}
              {hasVersions && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowVersions(!showVersions)}
                    className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Versions ({allVersions.length})
                    {showVersions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  <AnimatePresence>
                    {showVersions && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 space-y-2">
                          {allVersions.map((v) => (
                            <div
                              key={v.id}
                              className="flex items-center justify-between p-3 rounded-xl bg-muted"
                            >
                              <div>
                                <span className="font-medium text-sm">Version {v.version}</span>
                                <p className="text-xs text-muted-foreground">{formatDate(v.created_at)}</p>
                              </div>
                              <button
                                onClick={() => handleDownload(v.direct_link)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                              >
                                <Download className="h-3.5 w-3.5" />
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleDownload()}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2',
                    'py-3 px-4 rounded-xl text-sm font-semibold',
                    'bg-primary text-primary-foreground',
                    'hover:bg-primary/90 active:scale-[0.98]',
                    'transition-all duration-200'
                  )}
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                {app.link && (
                  <a
                    href={app.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'flex items-center justify-center gap-2',
                      'py-3 px-4 rounded-xl text-sm font-semibold',
                      'bg-muted text-foreground',
                      'hover:bg-muted/80 transition-colors'
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
