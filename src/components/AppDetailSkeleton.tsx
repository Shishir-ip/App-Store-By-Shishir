'use client'

import { motion } from 'framer-motion'

/* ─── Ice shimmer keyframes injected as a <style> block ─── */
function ShimmerStyle() {
  return (
    <style>{`
      @keyframes ice-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      .ice-shimmer {
        background: linear-gradient(
          90deg,
          hsl(var(--muted)) 0%,
          hsl(var(--muted-foreground) / 0.08) 25%,
          hsl(var(--muted)) 50%,
          hsl(var(--muted-foreground) / 0.08) 75%,
          hsl(var(--muted)) 100%
        );
        background-size: 200% 100%;
        animation: ice-shimmer 1.6s ease-in-out infinite;
      }
    `}</style>
  )
}

function Bar({ className }: { className: string }) {
  return <div className={`ice-shimmer rounded ${className}`} />
}

function Circle({ className }: { className: string }) {
  return <div className={`ice-shimmer rounded-full ${className}`} />
}

function Rounded({ className }: { className: string }) {
  return <div className={`ice-shimmer rounded-2xl ${className}`} />
}

/* ─── Section wrapper with staggered fade ─── */
function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
    >
      {children}
    </motion.div>
  )
}

export function AppDetailSkeleton() {
  return (
    <>
      <ShimmerStyle />
      <div className="min-h-screen bg-background">
        {/* Navbar already rendered by layout — skip skeleton */}

        <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-6 pb-20">
          {/* Back link skeleton */}
          <Section delay={0}>
            <Bar className="h-5 w-32 rounded-lg mb-4" />
          </Section>

          {/* ═══ Hero Card ═══ */}
          <Section delay={0.05}>
            <div className="rounded-3xl bg-card border border-border overflow-hidden">
              {/* Banner */}
              <div className="relative h-40 sm:h-52">
                <Bar className="h-full w-full rounded-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative px-6 pb-6 -mt-16 sm:-mt-20">
                <div className="flex items-end gap-4 sm:gap-5">
                  {/* Logo placeholder */}
                  <Rounded className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 border-4 border-card shadow-xl" />

                  <div className="flex-1 min-w-0 pb-1 space-y-2">
                    {/* Title */}
                    <Bar className="h-8 w-48 sm:w-64 rounded-lg" />
                    {/* Category */}
                    <Bar className="h-4 w-24 rounded-md" />
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 mt-4 flex-wrap">
                  <Bar className="h-5 w-16 rounded-md" />
                  <Bar className="h-5 w-28 rounded-md" />
                  <Bar className="h-5 w-20 rounded-md" />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 mt-5 flex-wrap">
                  <Bar className="h-10 w-28 rounded-xl" />
                  <Bar className="h-10 w-20 rounded-xl" />
                  <Circle className="h-10 w-10" />
                  <Circle className="h-10 w-10" />
                  <Circle className="h-10 w-10" />
                </div>
              </div>
            </div>
          </Section>

          {/* ═══ Video Preview (always show skeleton — optional content) ═══ */}
          <Section delay={0.1}>
            <div className="mt-8">
              <Bar className="h-6 w-36 rounded-lg mb-3" />
              <Rounded className="h-48 sm:h-64 w-full border border-border" />
            </div>
          </Section>

          {/* ═══ Screenshots ═══ */}
          <Section delay={0.15}>
            <div className="mt-8">
              <Bar className="h-6 w-28 rounded-lg mb-3" />
              <div className="flex gap-3 overflow-hidden">
                <Rounded className="h-32 w-56 shrink-0" />
                <Rounded className="h-32 w-56 shrink-0" />
                <Rounded className="h-32 w-56 shrink-0 hidden sm:block" />
              </div>
            </div>
          </Section>

          {/* ═══ About ═══ */}
          <Section delay={0.2}>
            <div className="mt-8 space-y-2">
              <Bar className="h-6 w-20 rounded-lg mb-3" />
              <Bar className="h-4 w-full rounded-md" />
              <Bar className="h-4 w-5/6 rounded-md" />
              <Bar className="h-4 w-4/5 rounded-md" />
              <Bar className="h-4 w-3/4 rounded-md" />
            </div>
          </Section>

          {/* ═══ Info Grid ═══ */}
          <Section delay={0.25}>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Rounded key={i} className="h-20 w-full p-4 space-y-2">
                  <Bar className="h-3 w-16 rounded-md" />
                  <Bar className="h-4 w-20 rounded-md" />
                </Rounded>
              ))}
            </div>
          </Section>

          {/* ═══ Versions ═══ */}
          <Section delay={0.3}>
            <div className="mt-8 space-y-3">
              <Bar className="h-6 w-32 rounded-lg" />
              <Rounded className="h-16 w-full" />
              <Rounded className="h-16 w-full" />
            </div>
          </Section>

          {/* ═══ Related Apps ═══ */}
          <Section delay={0.35}>
            <div className="mt-12">
              <Bar className="h-6 w-40 rounded-lg mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center animate-pulse">
                    <Rounded className="h-14 w-14 mb-2" />
                    <Bar className="h-3 w-16 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-8 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Bar className="h-4 w-56 mx-auto rounded-md" />
          </div>
        </footer>
      </div>
    </>
  )
}
