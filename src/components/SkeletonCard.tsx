'use client'

import { motion } from 'framer-motion'

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-card border border-border/50 p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-2xl bg-muted shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-3 w-1/2 rounded bg-muted" />
          <div className="h-3 w-2/3 rounded bg-muted" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-4/5 rounded bg-muted" />
      </div>
      <div className="mt-4 h-10 w-full rounded-xl bg-muted" />
    </div>
  )
}

export function SkeletonCompact() {
  return (
    <div className="flex flex-col items-center animate-pulse">
      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-muted" />
      <div className="mt-2 h-3 w-16 rounded bg-muted" />
      <div className="mt-1 h-2.5 w-10 rounded bg-muted" />
    </div>
  )
}

export function SkeletonList() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 animate-pulse">
      <div className="h-14 w-14 rounded-xl bg-muted shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
      </div>
      <div className="h-9 w-24 rounded-xl bg-muted shrink-0" />
    </div>
  )
}
