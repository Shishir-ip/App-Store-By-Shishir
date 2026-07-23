'use client'

import { motion } from 'framer-motion'
import { Package, Heart, Search, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  type?: 'no-apps' | 'no-favorites' | 'no-results' | 'no-requests'
  title?: string
  description?: string
  className?: string
}

const configs = {
  'no-apps': {
    icon: Package,
    title: 'No apps found',
    description: 'Try adjusting your search or category filter.',
  },
  'no-favorites': {
    icon: Heart,
    title: 'No favorites yet',
    description: 'Star your favorite apps and they will appear here.',
  },
  'no-results': {
    icon: Search,
    title: 'No results',
    description: 'We could not find anything matching your search.',
  },
  'no-requests': {
    icon: Inbox,
    title: 'No requests yet',
    description: 'Be the first to request an app!',
  },
}

export function EmptyState({ type = 'no-apps', title, description, className }: EmptyStateProps) {
  const config = configs[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center py-20 text-center', className)}
    >
      <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center mb-5">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">
        {title || config.title}
      </h3>
      <p className="text-muted-foreground mt-1 max-w-xs">
        {description || config.description}
      </p>
    </motion.div>
  )
}
