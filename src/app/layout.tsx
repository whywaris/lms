import '@/styles/tokens.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import Clarity from '@/components/analytics/Clarity'
import CookieConsent from '@/components/ui/CookieConsent'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Panda Courses – One Spot for Premium Courses',
  description: 'The ultimate learning management system for students and creators.',
}

function getOrigin(url?: string): string | null {
  if (!url) return null
  try {
    return new URL(url).origin
  } catch {
    return null
  }
}

const supabaseOrigin = getOrigin(process.env.NEXT_PUBLIC_SUPABASE_URL)
const r2Origin =
  getOrigin(process.env.NEXT_PUBLIC_IMAGE_ORIGIN) ||
  'https://pub-1972d57ee4d5423d824c280f20c21211.r2.dev'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {supabaseOrigin && (
          <>
            <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={supabaseOrigin} />
          </>
        )}
        {r2Origin && (
          <>
            <link rel="preconnect" href={r2Origin} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={r2Origin} />
          </>
        )}
      </head>
      <body className={inter.className}>
        {children}
        <GoogleAnalytics />
        <Clarity />
        <CookieConsent />
      </body>
    </html>
  )
}
