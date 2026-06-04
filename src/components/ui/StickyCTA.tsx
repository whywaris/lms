'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface StickyCTAProps {
  courseName: string
  lifetimePrice: string
}

export default function StickyCTA({ courseName, lifetimePrice }: StickyCTAProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: 100,
      background: 'var(--color-canvas)',
      borderBottom: '1px solid var(--color-hairline)',
      padding: '12px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-md)',
      flexWrap: 'wrap',
      gap: '12px',
    }}>

      {/* Course Info */}
      <div>
        <p style={{
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--color-ink-deep)',
          fontFamily: 'var(--font-sans)',
          margin: '0 0 2px',
        }}>
          {courseName}
        </p>
        <p style={{
          fontSize: '12px',
          color: 'var(--color-slate)',
          fontFamily: 'var(--font-sans)',
          margin: '0',
        }}>
          $99 lifetime
        </p>
      </div>

      {/* CTA Buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
      }}>
        <Link href="/signup?plan=lifetime" style={{
          background: 'var(--color-primary)',
          color: 'var(--color-on-dark)',
          padding: '9px 20px',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          fontWeight: '500',
          textDecoration: 'none',
          fontFamily: 'var(--font-sans)',
        }}>
          Lifetime
        </Link>
      </div>

    </div>
  )
}
