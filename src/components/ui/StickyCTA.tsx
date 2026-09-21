'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PRICE_USD } from '@/lib/siteConfig'

interface StickyCTAProps {
  courseName: string
  price?: number | string
}

export default function StickyCTA({ courseName, price = PRICE_USD }: StickyCTAProps) {
  const [scrolled, setScrolled] = useState(false)
  const [midCtaIntersecting, setMidCtaIntersecting] = useState(false)

  useEffect(() => {
    let rafId: number | null = null
    let lastScrolled = window.scrollY > 400
    setScrolled(lastScrolled)

    const handleScroll = () => {
      if (rafId !== null) return
      rafId = window.requestAnimationFrame(() => {
        const nextScrolled = window.scrollY > 400
        if (nextScrolled !== lastScrolled) {
          lastScrolled = nextScrolled
          setScrolled(nextScrolled)
        }
        rafId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const midCta = document.getElementById('mid-page-cta')
    if (!midCta) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setMidCtaIntersecting(entry.isIntersecting)
      },
      { threshold: 0.05 }
    )

    observer.observe(midCta)
    return () => observer.disconnect()
  }, [])

  const isVisible = scrolled && !midCtaIntersecting

  if (!isVisible) return null

  return (
    <>
      <style>{`
        .sticky-course-cta {
          position: fixed;
          left: 0;
          right: 0;
          z-index: 100;
          background: var(--color-canvas, #FFFFFF);
          box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.08));
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          gap: 16px;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        /* Desktop: fixed to top */
        @media (min-width: 769px) {
          .sticky-course-cta {
            top: 0;
            bottom: auto;
            border-bottom: 1px solid var(--color-hairline, #E8E8E5);
          }
        }

        /* Mobile (<769px): fixed to bottom with safe-area inset */
        @media (max-width: 768px) {
          .sticky-course-cta {
            top: auto;
            bottom: 0;
            border-top: 1px solid var(--color-hairline, #E8E8E5);
            padding-top: 12px;
            padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
            background: rgba(255, 255, 255, 0.96);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }
          .sticky-course-title {
            display: none;
          }
        }
      `}</style>

      <div className="sticky-course-cta">
        <div style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          {/* Course Info */}
          <div style={{ minWidth: 0, flex: 1 }}>
            <p
              className="sticky-course-title"
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {courseName}
            </p>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-slate)',
                fontFamily: 'var(--font-sans)',
                fontWeight: '500',
                margin: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ fontWeight: '700', color: 'var(--color-ink-deep)' }}>${price}</span>
              <span>·</span>
              <span>Lifetime Access</span>
            </p>
          </div>

          {/* CTA Button */}
          <div style={{ flexShrink: 0 }}>
            <Link
              href="/pricing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-primary, #6B4EFF)',
                color: '#FFFFFF',
                padding: '10px 22px',
                minHeight: '44px',
                borderRadius: 'var(--radius-md, 8px)',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                boxShadow: '0 3px 12px rgba(107, 78, 255, 0.3)',
                whiteSpace: 'nowrap',
                transition: 'opacity 0.15s ease',
              }}
            >
              Get Lifetime Access
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
