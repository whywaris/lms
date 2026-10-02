'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'signup_source'
const COOKIE_NAME = 'signup_source'

export default function SourceTracker() {
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return

      const urlParams = new URLSearchParams(window.location.search)
      const ref = urlParams.get('ref')?.trim()
      const utmSource = urlParams.get('utm_source')?.trim()
      const detectedSource = ref || utmSource

      // If source found in URL, persist it
      if (detectedSource) {
        const cleaned = detectedSource.toLowerCase().slice(0, 50)
        localStorage.setItem(STORAGE_KEY, cleaned)
        document.cookie = `${COOKIE_NAME}=${encodeURIComponent(cleaned)}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
      } else {
        // If not already in localStorage, set default 'direct'
        if (!localStorage.getItem(STORAGE_KEY)) {
          localStorage.setItem(STORAGE_KEY, 'direct')
        }
      }
    } catch {
      // Ignore storage/cookie access errors
    }
  }, [])

  return null
}
