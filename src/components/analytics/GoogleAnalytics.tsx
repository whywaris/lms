'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { getConsent } from '@/lib/consent'

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    // Check initial consent state
    setHasConsent(getConsent() === 'granted')

    const handleConsentChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ granted: boolean }>
      setHasConsent(Boolean(customEvent.detail?.granted))
    }

    window.addEventListener('consent-changed', handleConsentChanged)
    return () => {
      window.removeEventListener('consent-changed', handleConsentChanged)
    }
  }, [])

  // Do not track admin and dashboard paths
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')) {
    return null
  }

  // Only load Google Analytics once consent is granted
  if (!hasConsent) {
    return null
  }

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-V36V4Q9PFV"
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-V36V4Q9PFV');
        `}
      </Script>
    </>
  )
}
