'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getConsent, setConsent } from '@/lib/consent'

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const existing = getConsent()
    if (!existing) {
      setVisible(true)
    }
  }, [])

  if (!mounted || !visible) {
    return null
  }

  function handleChoice(granted: boolean) {
    setConsent(granted ? 'granted' : 'denied')
    setVisible(false)
  }

  return (
    <aside
      role="region"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        zIndex: 1001,
        fontFamily: 'var(--font-sans)',
      }}
      className="cookie-consent-container"
    >
      <style>{`
        .cookie-consent-container {
          left: 24px;
          bottom: calc(24px + env(safe-area-inset-bottom, 0px));
          width: calc(100% - 48px);
          max-width: 420px;
        }
        @media (max-width: 640px) {
          .cookie-consent-container {
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .cookie-consent-box {
            border-radius: 16px 16px 0 0 !important;
            border-bottom: none !important;
            padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px)) !important;
          }
        }
      `}</style>

      <div
        className="cookie-consent-box"
        style={{
          background: 'rgba(11, 16, 29, 0.98)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '14px',
          padding: '20px 22px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
          color: '#F1F5F9',
        }}
      >
        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.55,
            margin: '0 0 16px',
            color: '#CBD5E1',
          }}
        >
          We use cookies to keep you signed in and to understand how the site is
          used. You can accept or reject analytics cookies.{' '}
          <Link
            href="/privacy"
            style={{
              color: '#A78BFA',
              textDecoration: 'underline',
            }}
          >
            Privacy Policy
          </Link>
          .
        </p>

        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <button
            type="button"
            onClick={() => handleChoice(false)}
            style={{
              flex: 1,
              minHeight: '40px',
              padding: '10px 16px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s ease, border-color 0.15s ease',
            }}
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => handleChoice(true)}
            style={{
              flex: 1,
              minHeight: '40px',
              padding: '10px 16px',
              borderRadius: '8px',
              background: 'var(--color-primary, #6B4EFF)',
              border: '1px solid var(--color-primary, #6B4EFF)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 2px 8px rgba(107, 78, 255, 0.35)',
              transition: 'opacity 0.15s ease',
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </aside>
  )
}
