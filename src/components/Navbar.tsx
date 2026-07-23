'use client'

import { useState } from 'react'
import { Package, Menu, X, ChevronDown, Github, Heart, Code2, ExternalLink, LayoutGrid } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { CATEGORIES } from '@/lib/types'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [desktopCatOpen, setDesktopCatOpen] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-50 w-full glass">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                <Package className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight">App Store</span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6">
              <a href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</a>
              <a href="/favorites/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Favorites</a>
              <a href="/request/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Request</a>

              {/* Desktop Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDesktopCatOpen(!desktopCatOpen)}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Categories
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', desktopCatOpen && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {desktopCatOpen && (
                    <>
                      <div className="fixed inset-0 z-[60]" onClick={() => setDesktopCatOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 p-2 rounded-2xl bg-card border border-border shadow-xl z-[70] max-h-[70vh] overflow-y-auto"
                      >
                        {CATEGORIES.map((cat) => (
                          <a
                            key={cat.name}
                            href={`/category/${encodeURIComponent(cat.name)}/`}
                            onClick={() => setDesktopCatOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground"
                          >
                            <LayoutGrid className="h-3.5 w-3.5" />
                            {cat.name}
                          </a>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={() => setAboutOpen(true)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</button>
              <ThemeToggle />
            </div>

            {/* Mobile: ThemeToggle + Hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle className="scale-90" />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — Slide-in Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-[280px] max-w-[85vw] bg-background border-l border-border shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Package className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">Menu</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                <a
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors font-medium"
                >
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Home
                </a>
                <a
                  href="/favorites/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors font-medium"
                >
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  Favorites
                </a>
                <a
                  href="/request/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors font-medium"
                >
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  Request App
                </a>

                {/* Categories */}
                <div className="pt-2">
                  <button
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-muted transition-colors font-medium"
                  >
                    <span className="flex items-center gap-3">
                      <Code2 className="h-4 w-4 text-muted-foreground" />
                      Categories
                    </span>
                    <ChevronDown className={cn('h-4 w-4 transition-transform', categoriesOpen && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {categoriesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mt-1 space-y-0.5">
                          {CATEGORIES.map((cat) => (
                            <a
                              key={cat.name}
                              href={`/category/${encodeURIComponent(cat.name)}/`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block px-4 py-2.5 rounded-xl hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground"
                            >
                              {cat.name}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => { setAboutOpen(true); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors font-medium text-left"
                >
                  <Github className="h-4 w-4 text-muted-foreground" />
                  About
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* About Modal */}
      {aboutOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" onClick={() => setAboutOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div onClick={(e) => e.stopPropagation()} className={cn('relative w-full max-w-sm p-8 rounded-3xl bg-card border border-border shadow-2xl text-center')}>
            <button onClick={() => setAboutOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted transition-colors"><X className="h-4 w-4" /></button>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground mx-auto mb-5"><Package className="h-8 w-8" /></div>
            <h2 className="text-2xl font-bold text-foreground">App Store</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-6">Your one-stop destination for discovering amazing applications.</p>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                <Code2 className="h-5 w-5 text-primary shrink-0" />
                <div><p className="text-sm font-medium">Developed By</p><p className="text-sm text-muted-foreground">Shishir</p></div>
              </div>
              <a href="https://github.com/SHISHIR-S-R/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors group">
                <Github className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0"><p className="text-sm font-medium">GitHub</p><p className="text-sm text-muted-foreground truncate">github.com/SHISHIR-S-R</p></div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </a>
            </div>
            <div className="mt-6 pt-5 border-t border-border">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">Made with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> by Shishir</p>
              <p className="text-xs text-muted-foreground mt-1">Built with Next.js & Supabase</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
