import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { FavoritesProvider } from '@/components/FavoritesProvider'
import { ToastContainer } from '@/components/Toast'
import { BackToTop } from '@/components/BackToTop'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'App Store',
  description: 'Discover and download amazing apps',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
