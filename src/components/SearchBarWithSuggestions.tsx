'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, X, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppItem } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SearchBarWithSuggestionsProps {
  apps: AppItem[]
  value: string
  onChange: (value: string) => void
  onSelectApp?: (app: AppItem) => void
  placeholder?: string
  className?: string
}

export function SearchBarWithSuggestions({
  apps,
  value,
  onChange,
  onSelectApp,
  placeholder = 'Search apps...',
  className,
}: SearchBarWithSuggestionsProps) {
  const [focused, setFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const suggestions = useMemo(() => {
    if (!value.trim()) return []
    const q = value.toLowerCase()
    return apps
      .filter((app) =>
        app.name.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q)
      )
      .slice(0, 6)
  }, [apps, value])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        placeholder={placeholder}
        className={cn(
          'w-full h-11 pl-10 pr-10 rounded-xl',
          'bg-muted/50 border border-border/50',
          'focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20',
          'transition-all duration-200',
          'placeholder:text-muted-foreground'
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}

      <AnimatePresence>
        {focused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-card border border-border shadow-xl z-50"
          >
            {suggestions.map((app) => (
              <button
                key={app.id}
                onClick={() => {
                  onSelectApp?.(app)
                  setFocused(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left"
              >
                {app.logo_url ? (
                  <img src={app.logo_url} alt={app.name} className="h-9 w-9 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-foreground font-bold text-sm">
                    {app.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{app.name}</p>
                  <p className="text-xs text-muted-foreground">{app.category}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
