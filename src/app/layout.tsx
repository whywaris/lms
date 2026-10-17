import '@/styles/tokens.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import Clarity from '@/components/analytics/Clarity'
import SourceTracker from '@/components/analytics/SourceTracker'
import CookieConsent from '@/components/ui/CookieConsent'
import './globals.css'

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@700&family=Fredoka+One&family=Space+Mono:wght@400;700&family=Playfair+Display:wght@700;800&display=swap"
        />
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
      <body>
        {children}
        <GoogleAnalytics />
        <Clarity />
        <SourceTracker />
        <CookieConsent />
      </body>
    </html>
  )
}
