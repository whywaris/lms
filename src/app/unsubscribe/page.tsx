import { Metadata } from 'next'
import Link from 'next/link'
import { verifyUnsubscribeToken } from '@/lib/email/unsubscribe'
import UnsubscribeConfirmation from '@/components/email/UnsubscribeConfirmation'

export const metadata: Metadata = {
  title: 'Unsubscribe | PandaCourses',
  description: 'Unsubscribe from marketing emails.',
  robots: {
    index: false,
    follow: false,
  },
}

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function UnsubscribePage({ searchParams }: PageProps) {
  const params = await searchParams
  const token = params.token

  let isValid = false
  let errorMessage = ''

  if (!token) {
    errorMessage = 'No unsubscribe token was provided.'
  } else {
    // Only verify the token — NEVER change any data on GET!
    const { valid } = await verifyUnsubscribeToken(token)
    if (valid) {
      isValid = true
    } else {
      errorMessage = 'This unsubscribe link is invalid or has expired. If you need help, please contact support.'
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--color-canvas, #0D0C1D)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '40px 32px',
          textAlign: 'center',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              fontSize: '26px',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: '#FFFFFF' }}>
              Panda
            </span>
            <span style={{ fontFamily: 'Fredoka One, cursive', fontWeight: 400, color: '#F97316' }}>
              Courses
            </span>
          </Link>
        </div>

        {isValid && token ? (
          <UnsubscribeConfirmation token={token} />
        ) : (
          <div>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#EF4444',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                marginBottom: '20px',
              }}
            >
              !
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
              Unable to Unsubscribe
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
              {errorMessage}
            </p>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                padding: '12px 28px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Go to Homepage
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
