'use client'

import { motion } from 'framer-motion'
import { Package, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-muted mb-6">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="h-4 w-4" /> Go Home
          </Link>
          <button
            onClick={() => history.back()}
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  )
}
