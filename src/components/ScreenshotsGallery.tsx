'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScreenshotsGalleryProps {
  screenshots: string[]
  appName: string
}

export function ScreenshotsGallery({ screenshots, appName }: ScreenshotsGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!screenshots || screenshots.length === 0) return null

  return (
    <>
      <div className="mt-5">
        <p className="text-sm font-medium mb-3">Screenshots</p>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {screenshots.map((url, i) => (
            <button
              key={i}
              onClick={() => setLightboxIndex(i)}
              className="shrink-0 rounded-xl overflow-hidden border border-border/50 hover:border-border transition-colors"
            >
              <img
                src={url}
                alt={`${appName} screenshot ${i + 1}`}
                className="h-36 w-64 object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {lightboxIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            {lightboxIndex < screenshots.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}

            <motion.img
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={screenshots[lightboxIndex]}
              alt={`${appName} screenshot ${lightboxIndex + 1}`}
              className="max-h-[80vh] max-w-[90vw] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
              {screenshots.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    i === lightboxIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
                  )}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
