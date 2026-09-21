'use client'

import { useState } from 'react'

interface Props {
  text: string
}

export default function DashboardAnnouncementBar({ text }: Props) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || !text) return null

  return (
    <div
      style={{
        background: 'var(--color-brand-navy)',
        color: 'var(--color-on-dark)',
        padding: '10px 48px 10px 32px',
        textAlign: 'center',
        fontSize: '13px',
        fontWeight: '500',
        fontFamily: 'var(--font-sans)',
        lineHeight: '1.5',
        position: 'relative',
        width: '100%',
      }}
    >
      <span>{text}</span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'transparent',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.7)',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          transition: 'color 0.15s ease',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
