'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Download, Star, ExternalLink, Calendar, User, Hash,
  ChevronDown, ChevronUp, ArrowLeft, Heart, QrCode,
} from 'lucide-react'
import { AppItem } from '@/lib/types'
import { Navbar } from '@/components/Navbar'
import { ShareButton } from '@/components/ShareButton'
import { ScreenshotsGallery } from '@/components/ScreenshotsGallery'
import { useFavorites } from '@/components/FavoritesProvider'
import { cn, formatDate } from '@/lib/utils'
import { LinkifyText } from '@/components/LinkifyText'
import { incrementDownloads, supabase } from '@/lib/supabase'
import { showToast } from '@/components/Toast'
import Link from 'next/link'

export default function AppDetailClient({ app, allApps }: { app: AppItem; allApps: AppItem[] }) {
  const [showVersions, setShowVersions] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [screenshots, setScreenshots] = useState<string[]>(app.screenshots || [])
  const { isFavorite, toggleFavorite } = useFavorites()

  // Client-side fallback: fetch screenshots directly from relational table
  useEffect(() => {
    const fetchScreenshots = async () => {
      // If server already gave us screenshots, use them
      if (app.screenshots && app.screenshots.length > 0) {
        setScreenshots(app.screenshots)
        return
      }

      try {
        const { data, error } = await supabase
          .from('app_screenshots')
          .select('url')
          .eq('app_id', app.id)
          .order('created_at', { ascending: true })

        if (error) {
          console.error('Client screenshot fetch error:', error)
          return
        }

        if (data && data.length > 0) {
          const urls = data.map((s: any) => s.url)
          console.log('Client fetched screenshots:', urls)
          setScreenshots(urls)
        }
      } catch (err) {
        console.error('Client screenshot fetch exception:', err)
      }
    }

    fetchScreenshots()
  }, [app.id, app.screenshots])

  const handleDownload = async (link?: string) => {
    const downloadLink = link || app.versions?.[0]?.direct_link || app.link
    if (downloadLink) {
      await incrementDownloads(app.id)
      showToast('Download started!', 'success')
      window.open(downloadLink, '_blank')
    }
  }

  const relatedApps = allApps
    .filter((a) => a.category === app.category && a.id !== app.id)
    .slice(0, 4)

  const downloadLink = app.versions?.[0]?.direct_link || app.link || ''
  const qrUrl = downloadLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(downloadLink)}`
    : null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to store
        </Link>

        {/* ─── Hero Header with Banner Behind ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden bg-card border border-border"
        >
          {/* Banner Background */}
          <div className="relative h-40 sm:h-52">
            {app.banner_url ? (
              <img src={app.banner_url} alt={app.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/20 via-primary/10 to-secondary" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />
          </div>

          {/* Content overlaid on banner */}
          <div className="relative px-6 pb-6 -mt-16 sm:-mt-20">
            <div className="flex items-end gap-4 sm:gap-5">
              {app.logo_url ? (
                <img
                  src={app.logo_url}
                  alt={app.name}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover shadow-xl border-4 border-card"
                />
              ) : (
                <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-3xl shadow-xl border-4 border-card">
                  {app.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0 pb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{app.name}</h1>
                <p className="text-muted-foreground mt-0.5">{app.category}</p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              {app.rating && app.rating > 0 && (
                <div className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><span className="font-semibold">{app.rating.toFixed(1)}</span></div>
              )}
              <div className="flex items-center gap-1.5 text-muted-foreground"><Download className="h-4 w-4" /><span>{(app.downloads || 0).toLocaleString()} downloads</span></div>
              {app.file_size && <div className="flex items-center gap-1.5 text-muted-foreground"><Hash className="h-4 w-4" /><span>{app.file_size}</span></div>}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-5">
              <button onClick={() => handleDownload()} className={cn('flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all')}>
                <Download className="h-4 w-4" /> Download
              </button>
              {app.link && (
                <a href={app.link} target="_blank" rel="noopener noreferrer" className={cn('flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold bg-muted text-foreground hover:bg-muted/80 transition-colors')}>
                  <ExternalLink className="h-4 w-4" /> Visit
                </a>
              )}
              <button onClick={() => { toggleFavorite(app.id); showToast(isFavorite(app.id) ? 'Removed from favorites' : 'Added to favorites', 'success'); }}
                className={cn('p-2.5 rounded-xl transition-colors', isFavorite(app.id) ? 'bg-rose-500/10 text-rose-500' : 'bg-muted text-muted-foreground hover:text-foreground')}>
                <Heart className={cn('h-5 w-5', isFavorite(app.id) && 'fill-current')} />
              </button>
              <ShareButton appName={app.name} appId={app.id} directLink={downloadLink || undefined} />
              {qrUrl && (
                <button onClick={() => setShowQr(!showQr)} className={cn('p-2.5 rounded-xl transition-colors', showQr ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')} title="QR Code">
                  <QrCode className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* QR Code */}
            {showQr && qrUrl && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-4 rounded-2xl bg-muted border border-border inline-flex flex-col items-center gap-2">
                <img src={qrUrl} alt="QR Code" className="h-36 w-36 rounded-xl" />
                <p className="text-xs text-muted-foreground">Scan to download</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ─── Screenshots ─── */}
        {screenshots.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mt-8">
            <ScreenshotsGallery screenshots={screenshots} appName={app.name} />
          </motion.div>
        )}

        {/* ─── About / Description ─── */}
        {app.description && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-8">
            <h2 className="text-lg font-semibold mb-3">About</h2>
            <div className="text-muted-foreground leading-relaxed">
              <LinkifyText text={app.description} />
            </div>
          </motion.div>
        )}

        {/* ─── Info Grid ─── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <InfoItem icon={<User className="h-4 w-4" />} label="Developer" value={app.developer || 'Unknown'} />
          <InfoItem icon={<Calendar className="h-4 w-4" />} label="Added" value={formatDate(app.created_at)} />
          <InfoItem icon={<Hash className="h-4 w-4" />} label="Size" value={app.file_size || 'N/A'} />
          <InfoItem icon={<Download className="h-4 w-4" />} label="Downloads" value={(app.downloads || 0).toLocaleString()} />
        </motion.div>

        {/* ─── Versions ─── */}
        {app.versions && app.versions.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-8">
            <button onClick={() => setShowVersions(!showVersions)} className="flex items-center justify-between w-full text-left">
              <h2 className="text-lg font-semibold">Versions ({app.versions.length})</h2>
              {showVersions ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {showVersions && (
              <div className="mt-3 space-y-2">
                {app.versions.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
                    <div><p className="font-medium">Version {v.version}</p><p className="text-xs text-muted-foreground">{formatDate(v.created_at)}</p></div>
                    <button onClick={() => handleDownload(v.direct_link)} className={cn('flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors')}>
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── Related ─── */}
        {relatedApps.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12">
            <h2 className="text-lg font-semibold mb-4">More from {app.category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedApps.map((a) => (
                <Link key={a.id} href={`/app/${a.id}/`} className="group flex flex-col items-center text-center p-3 rounded-2xl hover:bg-muted transition-colors">
                  {a.logo_url ? (
                    <img src={a.logo_url} alt={a.name} className="h-14 w-14 rounded-xl object-cover mb-2" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-lg mb-2">{a.name.charAt(0).toUpperCase()}</div>
                  )}
                  <p className="text-xs font-medium truncate w-full group-hover:text-primary transition-colors">{a.name}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      <footer className="border-t border-border py-8 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm text-muted-foreground">App Store — Built with Next.js & Supabase</p>
        </div>
      </footer>
    </div>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">{icon}<span className="text-xs">{label}</span></div>
      <p className="font-medium text-sm">{value}</p>
    </div>
  )
}
