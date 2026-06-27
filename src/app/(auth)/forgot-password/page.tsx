'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleResetRequest(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!email) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm`,
    })
    setLoading(false)

    if (resetError) {
      setError(resetError.message)
    } else {
      setSuccess(true)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-surface)',
      padding: '24px',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'var(--color-canvas)',
        border: '1px solid var(--color-hairline)',
        borderRadius: '12px',
        padding: '36px 32px',
        boxSizing: 'border-box',
      }}>

        {/* Logo */}
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '20px', color: '#1a1a1a' }}>Panda</span>
            <span style={{ fontWeight: 400, fontSize: '20px', color: '#f97316' }}>Courses</span>
          </Link>
        </div>

        {/* Icon + Title */}
        <div style={{
          width: '44px', height: '44px',
          background: '#fff7ed',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '16px',
          fontSize: '20px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>🔑</div>

        <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-ink-deep)', margin: '0 0 6px', textAlign: 'center' }}>
          Reset your password
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--color-slate)', margin: '0 0 24px', lineHeight: 1.6, textAlign: 'center' }}>
          We will send you an email with a link to reset your password.
        </p>

        {success ? (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '14px 16px',
            fontSize: '13px',
            color: '#166534',
            textAlign: 'center',
            marginBottom: '16px',
          }}>
            ✓ Reset link sent! Please check your email inbox.
          </div>
        ) : (
          <form onSubmit={handleResetRequest}>
            {/* Email Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-slate)', display: 'block', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '14px',
                  border: '1px solid var(--color-hairline-strong)',
                  borderRadius: '8px',
                  background: 'var(--color-canvas)',
                  color: 'var(--color-ink)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>

            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '13px',
                color: '#b91c1c',
                marginBottom: '16px',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px',
                background: loading ? '#555' : '#111111',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
              }}
            >
              {loading ? 'Sending link...' : 'Send reset link'}
            </button>
          </form>
        )}

        <div style={{
          borderTop: '1px solid var(--color-hairline)',
          paddingTop: '16px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '13px',
            color: 'var(--color-slate)',
            margin: '0',
          }}>
            Remember your password?{' '}
            <Link href="/login" style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: '500',
            }}>
              Log in
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
