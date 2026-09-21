'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Props {
  price: string
  href?: string
  targetId?: string
  ctaText?: string
}

export default function MobileStickyBar({
  price,
  href = '/pricing',
  targetId = 'final-cta-band',
  ctaText = 'Get Access',
}: Props) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHidden(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [targetId])

  if (hidden) return null

  const isExternal = href.startsWith('http://') || href.startsWith('https://')

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .mobile-sticky-cta {
            display: none !important;
          }
        }
      `}</style>
      <div
        className="mobile-sticky-cta"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 99,
          background: 'rgba(26, 26, 46, 0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '12px 20px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: 'white',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {price}{' '}
          </span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--color-on-dark-muted)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            · Lifetime Access
          </span>
        </div>

        <Link
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          style={{
            background: 'var(--color-primary)',
            color: 'white',
            minHeight: '44px',
            padding: '0 20px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
            fontFamily: 'var(--font-sans)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 10px rgba(107, 78, 255, 0.4)',
          }}
        >
          {ctaText}
        </Link>
      </div>
    </>
  )
}
