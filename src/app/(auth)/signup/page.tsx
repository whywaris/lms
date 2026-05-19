'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'



export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [plan, setPlan] = useState<'monthly' | 'lifetime' | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignup() {
    setLoading(true)
    setError('')

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Profile banao
      const expiryDate = null

      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        email: email,
        plan: null,
        plan_expires_at: expiryDate,
        is_active: true,
      })
    }

    router.refresh()
    router.push('/dashboard')
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--color-surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            textDecoration: 'none',
            fontSize: '28px'
          }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: '#1a1a1a' }}>Panda</span>
            <span style={{ fontFamily: 'Fredoka One, cursive', fontWeight: 400, color: '#f97316' }}>Courses</span>
          </Link>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--color-canvas)',
          border: '1px solid var(--color-hairline)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
        }}>

          {/* Header */}
          <h1 style={{
            fontSize: '22px',
            fontWeight: '600',
            color: 'var(--color-ink-deep)',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 8px',
          }}>
            Create your account
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'var(--color-slate)',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 28px',
          }}>
            Enter your details below to create your account
          </p>

          {/* Error */}
          {error && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              marginBottom: '20px',
            }}>
              <p style={{
                fontSize: '13px',
                color: '#DC2626',
                fontFamily: 'var(--font-sans)',
                margin: '0',
              }}>
                {error}
              </p>
            </div>
          )}


          {/* Full Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-sans)',
              marginBottom: '6px',
            }}>
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                background: 'var(--color-canvas)',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-sans)',
              marginBottom: '6px',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                background: 'var(--color-canvas)',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-sans)',
              marginBottom: '6px',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                background: 'var(--color-canvas)',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Signup Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            style={{
              width: '100%',
              height: '44px',
              background: loading
                ? 'var(--color-muted)'
                : 'var(--color-primary)',
              color: 'var(--color-on-dark)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'var(--font-sans)',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          {/* Divider */}
          <div style={{
            borderTop: '1px solid var(--color-hairline)',
            paddingTop: '16px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '13px',
              color: 'var(--color-slate)',
              fontFamily: 'var(--font-sans)',
              margin: '0',
            }}>
              Already have an account?{' '}
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
    </main>
  )
}
