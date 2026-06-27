'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const supabase = createClient()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleReset() {
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
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
      }}>

        {/* Logo */}
        <div style={{ marginBottom: '28px' }}>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '20px', color: '#1a1a1a' }}>Panda</span>
          <span style={{ fontWeight: 400, fontSize: '20px', color: '#f97316' }}>Courses</span>
        </div>

        {/* Icon + Title */}
        <div style={{
          width: '44px', height: '44px',
          background: '#fff7ed',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '16px',
          fontSize: '20px',
        }}>🔐</div>

        <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-ink-deep)', margin: '0 0 6px' }}>
          Set new password
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--color-slate)', margin: '0 0 24px', lineHeight: 1.6 }}>
          Choose a strong password for your account.
        </p>

        {success ? (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '14px 16px',
            fontSize: '13px',
            color: '#166534',
          }}>
            ✓ Password updated! Redirecting to login...
          </div>
        ) : (
          <>
            {/* New Password */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-slate)', display: 'block', marginBottom: '6px' }}>
                New Password
              </label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
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
              />
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-slate)', display: 'block', marginBottom: '6px' }}>
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-enter password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
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
              onClick={handleReset}
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
              }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
