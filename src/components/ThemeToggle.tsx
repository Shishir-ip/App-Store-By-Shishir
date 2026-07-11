'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={cn('w-9 h-9 rounded-lg bg-muted animate-pulse', className)} />
    )
  }

  const currentTheme = theme || 'system'

  return (
    <div className={cn('flex items-center gap-1 rounded-lg bg-muted p-1', className)}>
      <button
        onClick={() => setTheme('light')}
        className={cn(
          'p-1.5 rounded-md transition-all duration-200',
          currentTheme === 'light'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
        title="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={cn(
          'p-1.5 rounded-md transition-all duration-200',
          currentTheme === 'system'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
        title="System preference"
      >
        <Monitor className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          'p-1.5 rounded-md transition-all duration-200',
          currentTheme === 'dark'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
        title="Dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  )
}
