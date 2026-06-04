'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

export default function GoogleAnalytics() {
  const pathname = usePathname()
  
  // Do not track admin and dashboard paths
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')) {
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
