import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'

export default function NotFound() {
  return (
    <main>
      <Navbar />
      <section style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 32px',
        background: 'var(--color-canvas)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>

          {/* Emoji */}
          <div style={{ fontSize: '64px', marginBottom: '24px', lineHeight: '1' }}>
            🔍
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: 'var(--color-ink-deep)',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 12px',
            letterSpacing: '-0.5px',
          }}>
            Oops, Nothing Here Yet!
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '16px',
            color: 'var(--color-slate)',
            fontFamily: 'var(--font-sans)',
            lineHeight: '1.7',
            margin: '0 0 8px',
          }}>
            Looks like this content is for Lifetime Members only.
          </p>
          <p style={{
            fontSize: '15px',
            color: 'var(--color-slate)',
            fontFamily: 'var(--font-sans)',
            lineHeight: '1.7',
            margin: '0 0 32px',
          }}>
            Grab lifetime access to 2000+ courses with a one-time payment.
          </p>

          {/* CTA Button */}
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
            ⭐ Get Started
          </Link>

          {/* Back Home */}
          <div style={{ marginTop: '20px' }}>
            <Link href="/" style={{
              fontSize: '13px',
              color: 'var(--color-steel)',
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
            }}>
              ← Back to Home
            </Link>
          </div>

        </div>
      </section>
      <Footer />
    </main>
  )
}
