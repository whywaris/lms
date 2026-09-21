import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #0d0b1a 0%, var(--color-brand-navy) 100%)',
        padding: '88px 24px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '560px',
          height: '320px',
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(107, 78, 255, 0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '760px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700,
            color: 'white',
            letterSpacing: '-1px',
            lineHeight: 1.15,
            margin: '0 0 16px',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Get Lifetime Access for $99
        </h2>

        <p
          style={{
            fontSize: '17px',
            color: 'var(--color-on-dark-muted)',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 32px',
            lineHeight: 1.6,
          }}
        >
          Start learning from top mentors today.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link
            href="/pricing"
            style={{
              background: 'var(--color-primary)',
              color: 'white',
              minHeight: '44px',
              padding: '14px 36px',
              borderRadius: 'var(--radius-md)',
              fontSize: '16px',
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(107, 78, 255, 0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            View Pricing →
          </Link>
        </div>
      </div>
    </section>
  )
}
