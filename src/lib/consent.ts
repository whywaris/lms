export type ConsentStatus = 'granted' | 'denied'

export const COOKIE_CONSENT_NAME = 'cookie_consent'
const MAX_AGE_SECONDS = 180 * 24 * 60 * 60 // 180 days = 15,552,000s

export function getConsent(): ConsentStatus | null {
  if (typeof document === 'undefined') return null

  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_CONSENT_NAME}=([^;]+)`)
  )
  const val = match ? decodeURIComponent(match[1]) : null
  if (val === 'granted' || val === 'denied') {
    return val
  }
  return null
}

export function setConsent(value: ConsentStatus): void {
  if (typeof document === 'undefined') return

  document.cookie = `${COOKIE_CONSENT_NAME}=${value}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('consent-changed', {
        detail: { granted: value === 'granted' },
      })
    )
  }
}
