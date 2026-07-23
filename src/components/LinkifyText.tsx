'use client'

import { cn } from '@/lib/utils'

interface LinkifyTextProps {
  text: string
  className?: string
}

export function LinkifyText({ text, className }: LinkifyTextProps) {
  if (!text) return null
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)

  return (
    <span className={cn('whitespace-pre-line', className)}>
      {parts.map((part, i) => {
        if (part.match(/^https?:\/\/.+/)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}
