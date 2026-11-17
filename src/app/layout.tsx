import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { FavoritesProvider } from '@/components/FavoritesProvider'
import { ToastContainer } from '@/components/Toast'
import { BackToTop } from '@/components/BackToTop'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'App Store by Shishir',
  description: 'App Store by Shishir — Discover and download amazing apps, APKs, and tools. Your one-stop destination for the best apps.',
  keywords: ['app store by shishir', 'appstore by shishir', 'apxtore', 'shishir app store', 'shishir appstore', 'appstore by shohidul islam shishir', 'app store', 'download apps', 'apk store'],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'App Store by Shishir',
    description: 'Discover and download amazing apps, APKs, and tools.',
    url: 'https://app-store-by-shishir.vercel.app',
    siteName: 'App Store by Shishir',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <FavoritesProvider>
            {children}
            <ToastContainer />
            <BackToTop />
            <Analytics />
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
