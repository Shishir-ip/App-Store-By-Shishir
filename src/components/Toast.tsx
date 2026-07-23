'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

let toastId = 0
const listeners: ((toasts: Toast[]) => void)[] = []
let toasts: Toast[] = []

function notifyListeners() {
  listeners.forEach((l) => l([...toasts]))
}

export function showToast(message: string, type: ToastType = 'success') {
  const id = ++toastId
  toasts = [...toasts, { id, message, type }]
  notifyListeners()
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
    notifyListeners()
  }, 3000)
}

export function ToastContainer() {
  const [activeToasts, setActiveToasts] = useState<Toast[]>([])

  useEffect(() => {
    listeners.push(setActiveToasts)
    return () => {
      const idx = listeners.indexOf(setActiveToasts)
      if (idx > -1) listeners.splice(idx, 1)
    }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
      <AnimatePresence>
        {activeToasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg',
              'bg-card border border-border backdrop-blur-xl',
              toast.type === 'success' && 'border-success/30',
              toast.type === 'error' && 'border-destructive/30',
              toast.type === 'info' && 'border-primary/30'
            )}
          >
            {toast.type === 'success' && <Check className="h-4 w-4 text-success shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="h-4 w-4 text-destructive shrink-0" />}
            {toast.type === 'info' && <Info className="h-4 w-4 text-primary shrink-0" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
