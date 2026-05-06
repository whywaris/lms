import Link from 'next/link'

export default function NoPlanPage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-canvas)',
      padding: '32px',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '480px' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔒</div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: 'var(--color-ink-deep)',
          fontFamily: 'var(--font-sans)',
          margin: '0 0 12px',
        }}>
          No Active Plan
        </h1>
        <p style={{
          fontSize: '15px',
          color: 'var(--color-slate)',
          fontFamily: 'var(--font-sans)',
          lineHeight: '1.7',
          margin: '0 0 32px',
        }}>
          You need an active plan to access courses. 
          Get lifetime access to 2000+ courses with a one-time payment.
        </p>
        <Link href="/pricing" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--color-primary)',
          color: 'white',
          padding: '13px 28px',
          borderRadius: 'var(--radius-md)',
          fontSize: '15px',
          fontWeight: '500',
          textDecoration: 'none',
          fontFamily: 'var(--font-sans)',
        }}>
          ⭐ View Plans
        </Link>
      </div>
    </main>
  )
}
