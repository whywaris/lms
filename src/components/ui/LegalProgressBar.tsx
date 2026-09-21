'use client'

import { useState, useEffect } from 'react'

export default function LegalProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let rafId: number | null = null

    const updateProgress = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollY / docHeight) * 100))
        setProgress(pct)
      }
    }

    const onScroll = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        updateProgress()
        rafId = null
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updateProgress()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      className="legal-progress-bar"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${progress}%`,
        background: 'var(--color-primary, #6B4EFF)',
        zIndex: 9999,
        transition: 'width 0.1s ease-out',
        pointerEvents: 'none',
      }}
    />
  )
}
