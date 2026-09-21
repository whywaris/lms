'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Props {
  token: string
}

export default function UnsubscribeConfirmation({ token }: Props) {
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleConfirm() {
    setLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await res.json().catch(() => null)

      if (res.ok && data?.ok) {
        setIsSuccess(true)
      } else {
        setErrorMsg(
          data?.error ||
            'We encountered an issue updating your preferences. Please try again or contact support.'
        )
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'An error occurred while updating your preferences.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(100, 220, 150, 0.15)',
            color: '#64DC96',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            marginBottom: '20px',
          }}
        >
          ✓
        </div>
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 600,
            color: '#FFFFFF',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 12px',
          }}
        >
          Unsubscribed Successfully
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: 1.6,
            fontFamily: 'var(--font-sans)',
            margin: '0 0 28px',
          }}
        >
          You’ve been unsubscribed from marketing emails. You will still receive important account emails.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            background: 'var(--color-primary, #6B4EFF)',
            color: '#FFFFFF',
            padding: '12px 28px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Back to PandaCourses
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(107, 78, 255, 0.15)',
          color: 'var(--color-primary, #6B4EFF)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          marginBottom: '20px',
        }}
      >
        ✉️
      </div>

      <h1
        style={{
          fontSize: '22px',
          fontWeight: 600,
          color: '#FFFFFF',
          fontFamily: 'var(--font-sans)',
          margin: '0 0 12px',
        }}
      >
        Unsubscribe from marketing emails?
      </h1>

      <p
        style={{
          fontSize: '15px',
          color: 'rgba(255, 255, 255, 0.7)',
          lineHeight: 1.6,
          fontFamily: 'var(--font-sans)',
          margin: '0 0 28px',
        }}
      >
        Click below to confirm that you want to stop receiving promotional updates and announcements. You will still receive essential account emails.
      </p>

      {errorMsg && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#EF4444',
            fontSize: '13px',
            marginBottom: '20px',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {errorMsg}
        </div>
      )}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={loading}
        style={{
          display: 'inline-block',
          width: '100%',
          maxWidth: '260px',
          background: 'var(--color-primary, #6B4EFF)',
          color: '#FFFFFF',
          padding: '14px 28px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '15px',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          fontFamily: 'var(--font-sans)',
          transition: 'background 0.2s ease, opacity 0.2s ease',
        }}
      >
        {loading ? 'Unsubscribing...' : 'Confirm unsubscribe'}
      </button>

      <div style={{ marginTop: '20px' }}>
        <Link
          href="/"
          style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.5)',
            textDecoration: 'none',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Cancel and return to homepage
        </Link>
      </div>
    </div>
  )
}
