'use client'

import { useState, useEffect } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let rafId: number | null = null

    const handleScroll = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        const shouldShow = window.scrollY > 600
        setVisible(shouldShow)
        rafId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <style>{`
        .site-back-to-top {
          position: fixed;
          bottom: calc(104px + env(safe-area-inset-bottom, 0px));
          right: 32px;
          width: 44px;
          height: 44px;
          background: var(--color-ink-deep, #1A1A2E);
          color: var(--color-canvas, #FFFFFF);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-full, 9999px);
          font-size: 18px;
          cursor: pointer;
          z-index: 99;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
          font-family: var(--font-sans);
          transition: opacity 0.25s ease, transform 0.25s ease, background 0.15s ease;
        }
        .site-back-to-top:hover {
          background: var(--color-primary, #6B4EFF);
        }
        @media (max-width: 768px) {
          .site-back-to-top {
            right: auto;
            left: 24px;
            bottom: calc(24px + env(safe-area-inset-bottom, 0px));
          }
        }
        @media print {
          .site-back-to-top {
            display: none !important;
          }
        }
      `}</style>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className="site-back-to-top"
        style={{
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </>
  )
}

