'use client'

import { useState } from 'react'
import { Package, Menu, X, ChevronDown, Github, Heart, Code2, ExternalLink } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { CATEGORIES } from '@/lib/types'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

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

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border px-4 py-3 space-y-1 bg-background/95 backdrop-blur-xl">
            <a href="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg hover:bg-muted transition-colors font-medium">Home</a>
            <a href="/favorites/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg hover:bg-muted transition-colors font-medium">Favorites</a>
            <a href="/request/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg hover:bg-muted transition-colors font-medium">Request App</a>
            <button onClick={() => setCategoriesOpen(!categoriesOpen)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted transition-colors font-medium">
              <span>Categories</span><ChevronDown className={cn('h-4 w-4 transition-transform', categoriesOpen && 'rotate-180')} />
            </button>
            {categoriesOpen && (
              <div className="ml-4 space-y-0.5">
                {CATEGORIES.map((cat) => (
                  <a key={cat.name} href={`/category/${encodeURIComponent(cat.name)}/`} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground">{cat.name}</a>
                ))}
              </div>
            )}
            <button onClick={() => { setAboutOpen(true); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted transition-colors font-medium">About</button>
          </div>
        )}
      </nav>

      {aboutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setAboutOpen(false)}>
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
