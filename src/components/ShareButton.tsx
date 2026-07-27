'use client'

import { useState } from 'react'
import { Share2, Copy, Check, Link2, MessageCircle, Send, Twitter, Facebook } from 'lucide-react'
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

  const shareText = `Check out ${appName} on App Store!`

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

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="h-4 w-4" />,
      color: 'text-green-500',
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${appUrl}`)}`,
    },
    {
      name: 'Telegram',
      icon: <Send className="h-4 w-4" />,
      color: 'text-sky-500',
      href: `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Twitter',
      icon: <Twitter className="h-4 w-4" />,
      color: 'text-slate-800 dark:text-slate-200',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook className="h-4 w-4" />,
      color: 'text-blue-600',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`,
    },
  ]

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
            {/* Backdrop — covers everything */}
            <div className="fixed inset-0 z-[200]" onClick={() => setOpen(false)} />
            {/* Dropdown — high z-index, positioned with portal-like behavior */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              transition={{ duration: 0.15 }}
              className="fixed z-[210] right-4 sm:right-auto sm:absolute sm:right-0 sm:top-full sm:mt-2 w-[280px] p-3 rounded-2xl bg-card border border-border shadow-2xl"
              style={typeof window !== 'undefined' ? undefined : {}}
            >
              <p className="text-xs font-medium text-muted-foreground mb-2 px-1">Share {appName}</p>

              {/* Social buttons */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-muted transition-colors"
                  >
                    <span className={social.color}>{social.icon}</span>
                    <span className="text-[10px] text-muted-foreground">{social.name}</span>
                  </a>
                ))}
              </div>

              <div className="h-px bg-border my-2" />

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
