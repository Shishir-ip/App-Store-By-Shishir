'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/Navbar'
import { Send, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { showToast } from '@/components/Toast'
import { createRequest } from '@/lib/supabase'

export default function RequestPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', category: '', description: '', link: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSending(true)
    try {
      const result = await createRequest({
        name: form.name.trim(),
        category: form.category.trim() || null,
        description: form.description.trim() || null,
        link: form.link.trim() || null,
      })
      if (result) {
        setSubmitted(true)
        showToast('Request submitted successfully!', 'success')
      } else {
        showToast('Something went wrong', 'error')
      }
    } catch {
      showToast('Something went wrong', 'error')
    }
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-center mb-2">Request an App</h1>
          <p className="text-muted-foreground text-center mb-8">Can not find what you are looking for? Let us know!</p>

          {submitted ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4"><CheckCircle className="h-8 w-8 text-success" /></div>
              <h2 className="text-xl font-semibold">Request Submitted!</h2>
              <p className="text-muted-foreground mt-2">We will review your request and add the app soon.</p>
              <button onClick={() => { setSubmitted(false); setForm({ name: '', category: '', description: '', link: '' }); }} className="mt-6 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Submit Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">App Name <span className="text-destructive">*</span></label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all" placeholder="e.g. Spotify Premium" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all" placeholder="e.g. Music" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea value={form.description} rows={3} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all resize-none" placeholder="Why do you want this app?" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Link (optional)</label>
                <input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-muted border border-border focus:bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all" placeholder="https://..." />
              </div>
              <button type="submit" disabled={sending} className={cn('w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground font-medium transition-colors', sending && 'opacity-50 cursor-not-allowed')}>
                <Send className="h-4 w-4" />{sending ? 'Sending...' : 'Submit Request'}
              </button>
            </form>
          )}
        </motion.div>
      </main>
    </div>
  )
}
