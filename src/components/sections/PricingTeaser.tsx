import Link from 'next/link'

export default function PricingTeaser() {
  const checklist = [
    'Instant dashboard access',
    'All courses included',
    'Lifetime updates',
    'Mega / Google Drive access',
  ]

  return (
    <section
      style={{
        background: 'var(--color-surface)',
        padding: '80px 24px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '8px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            PRICING
          </p>
          <h2
            style={{
              fontSize: 'clamp(30px, 4vw, 42px)',
              fontWeight: '600',
              color: 'var(--color-ink-deep)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 10px',
              letterSpacing: '-0.5px',
              lineHeight: 1.15,
            }}
          >
            One Price. Lifetime Access.
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--color-slate)',
              fontFamily: 'var(--font-sans)',
              margin: 0,
            }}
          >
            Pay once and unlock every course on the platform.
          </p>
        </div>

        {/* Centered Pricing Card */}
        <div
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            background: 'white',
            border: '1px solid rgba(107, 78, 255, 0.28)',
            borderRadius: '12px',
            padding: '36px 32px',
            boxShadow: '0 12px 32px rgba(107, 78, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Accent top gradient indicator */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, var(--color-primary), #A78BFA)',
              borderRadius: '12px 12px 0 0',
            }}
          />

          {/* Price Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                fontSize: '56px',
                fontWeight: '700',
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                lineHeight: 1,
                letterSpacing: '-1px',
                marginBottom: '6px',
              }}
            >
              $99
            </div>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-steel)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                margin: 0,
              }}
            >
              one-time · lifetime access
            </p>
          </div>

          {/* Checklist */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              marginBottom: '32px',
            }}
          >
            {checklist.map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '15px',
                  color: 'var(--color-charcoal)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#EAF3DE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#27500A',
                    fontSize: '12px',
                    fontWeight: '700',
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Primary CTA Button */}
          <Link
            href="/pricing"
            style={{
              background: 'var(--color-primary)',
              color: 'white',
              minHeight: '44px',
              padding: '14px 28px',
              borderRadius: 'var(--radius-md)',
              fontSize: '15px',
              fontWeight: '600',
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(107, 78, 255, 0.3)',
              transition: 'background 0.2s ease',
            }}
          >
            View Pricing →
          </Link>
        </div>
      </div>
    </section>
  )
}
