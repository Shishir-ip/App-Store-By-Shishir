'use client'

import { useState } from 'react'
import { Share2, Copy, Check, Link2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { showToast } from './Toast'

interface ShareButtonProps {
  appName: string
  appId: string
  directLink?: string
  className?: string
}

export function ShareButton({ appName, appId, directLink, className }: ShareButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const appUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/app/${appId}/`
    : `/app/${appId}/`

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      showToast(`${label} copied to clipboard`, 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('Failed to copy', 'error')
    }
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
        title="Share"
      >
        <Share2 className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[90]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              className="absolute right-0 top-full mt-2 w-64 p-3 rounded-2xl bg-card border border-border shadow-xl z-[100]"
            >
              <p className="text-xs font-medium text-muted-foreground mb-2 px-1">Share {appName}</p>
              <button
                onClick={() => handleCopy(appUrl, 'App link')}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left"
              >
                {copied ? <Check className="h-4 w-4 text-success shrink-0" /> : <Link2 className="h-4 w-4 shrink-0" />}
                <span className="text-sm truncate">{appUrl}</span>
              </button>
              {directLink && (
                <button
                  onClick={() => handleCopy(directLink, 'Download link')}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left mt-1"
                >
                  <Copy className="h-4 w-4 shrink-0" />
                  <span className="text-sm">Copy download link</span>
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
