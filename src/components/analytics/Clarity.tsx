'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { getConsent } from '@/lib/consent'

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void
  }
}

const EXCLUDED_PREFIXES = [
  '/admin',
  '/dashboard',
  '/login',
  '/signup',
  '/auth',
  '/unsubscribe',
  '/api',
]

export default function Clarity() {
  const pathname = usePathname()
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    // Check initial consent state
    setHasConsent(getConsent() === 'granted')

    const handleConsentChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ granted: boolean }>
      const granted = Boolean(customEvent.detail?.granted)
      setHasConsent(granted)

      if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
        if (granted) {
          window.clarity('consentv2', {
            ad_Storage: 'denied',
            analytics_Storage: 'granted',
          })
        } else {
          window.clarity('consentv2', {
            ad_Storage: 'denied',
            analytics_Storage: 'denied',
          })
          window.clarity('consent', false)
        }
      }
    }

    window.addEventListener('consent-changed', handleConsentChanged)
    return () => {
      window.removeEventListener('consent-changed', handleConsentChanged)
    }
  }, [])

  // If no project ID is configured, do not render anything
  if (!projectId) {
    return null
  }

  // Check if current route is excluded from tracking
  const isExcluded = pathname
    ? EXCLUDED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
      )
    : false

  if (isExcluded) {
    return null
  }

  // Only load and initialize script once consent has been granted
  if (!hasConsent) {
    return null
  }

  return (
    <Script
      id="clarity-script"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${projectId}");`,
      }}
      onLoad={() => {
        if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
          window.clarity('consentv2', {
            ad_Storage: 'denied',
            analytics_Storage: 'granted',
          })
        }
      }}
    />
  )
}
