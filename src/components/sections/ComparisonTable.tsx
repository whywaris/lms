import Link from 'next/link'

export default function ComparisonTable() {
  const features = [
    { label: 'Full Access to All Courses', monthly: true, lifetime: true },
    { label: 'New Courses Added Monthly', monthly: true, lifetime: true },
    { label: 'Direct Drive Links Access', monthly: true, lifetime: true },
    { label: 'Access to Future Courses', monthly: false, lifetime: true },
    { label: 'One-time Payment', monthly: false, lifetime: true },
    { label: 'Priority Support', monthly: false, lifetime: true },
    { label: 'Lifetime Updates', monthly: false, lifetime: true },
  ]

  return (
    <section style={{
      background: 'var(--color-surface)',
      padding: '96px 32px',
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
      }}>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
        }}>
          <p style={{
            fontSize: '11px',
            fontWeight: '500',
            color: 'var(--color-steel)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 12px',
          }}>
            Plans
          </p>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: '600',
            color: 'var(--color-ink-deep)',
            letterSpacing: '-0.5px',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 16px',
            lineHeight: '1.2',
          }}>
            Monthly vs Lifetime
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'var(--color-slate)',
            fontFamily: 'var(--font-sans)',
            margin: '0',
            lineHeight: '1.6',
          }}>
            Choose the plan that fits your learning goals
          </p>
        </div>

        {/* Table */}
        <div style={{
          background: 'var(--color-canvas)',
          border: '1px solid var(--color-hairline)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>

          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 160px 160px',
            borderBottom: '1px solid var(--color-hairline)',
          }}>
            <div style={{ padding: '20px 24px' }} />

            {/* Monthly Header */}
            <div style={{
              padding: '20px 16px',
              textAlign: 'center',
              borderLeft: '1px solid var(--color-hairline)',
            }}>
              <p style={{
                fontSize: '11px',
                fontWeight: '500',
                color: 'var(--color-steel)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 6px',
              }}>
                Monthly
              </p>
              <p style={{
                fontSize: '22px',
                fontWeight: '600',
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 2px',
              }}>
                $30
              </p>
              <p style={{
                fontSize: '12px',
                color: 'var(--color-steel)',
                fontFamily: 'var(--font-sans)',
                margin: '0',
              }}>
                / month
              </p>
            </div>

            {/* Lifetime Header */}
            <div style={{
              padding: '20px 16px',
              textAlign: 'center',
              borderLeft: '1px solid var(--color-hairline)',
              background: 'var(--color-tint-lavender)',
              position: 'relative',
            }}>
              {/* Popular Badge */}
              <div style={{
                position: 'absolute',
                top: '-1px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--color-primary)',
                color: 'var(--color-on-dark)',
                fontSize: '10px',
                fontWeight: '600',
                padding: '3px 10px',
                borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
                fontFamily: 'var(--font-sans)',
                whiteSpace: 'nowrap',
              }}>
                BEST VALUE
              </div>
              <p style={{
                fontSize: '11px',
                fontWeight: '500',
                color: 'var(--color-steel)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontFamily: 'var(--font-sans)',
                margin: '8px 0 6px',
              }}>
                Lifetime
              </p>
              <p style={{
                fontSize: '22px',
                fontWeight: '600',
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 2px',
              }}>
                $99
              </p>
              <p style={{
                fontSize: '12px',
                color: 'var(--color-steel)',
                fontFamily: 'var(--font-sans)',
                margin: '0',
              }}>
                one-time
              </p>
            </div>
          </div>

          {/* Feature Rows */}
          {features.map((feature, index) => (
            <div
              key={feature.label}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 160px 160px',
                borderBottom: index === features.length - 1
                  ? 'none'
                  : '1px solid var(--color-hairline-soft)',
              }}
            >
              {/* Feature Label */}
              <div style={{
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
              }}>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--color-charcoal)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0',
                }}>
                  {feature.label}
                </p>
              </div>

              {/* Monthly Check */}
              <div style={{
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderLeft: '1px solid var(--color-hairline)',
              }}>
                {feature.monthly ? (
                  <span style={{
                    fontSize: '18px',
                    color: '#27500A',
                  }}>✓</span>
                ) : (
                  <span style={{
                    fontSize: '18px',
                    color: 'var(--color-muted)',
                  }}>—</span>
                )}
              </div>

              {/* Lifetime Check */}
              <div style={{
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderLeft: '1px solid var(--color-hairline)',
                background: 'var(--color-tint-lavender)',
              }}>
                {feature.lifetime ? (
                  <span style={{
                    fontSize: '18px',
                    color: '#27500A',
                  }}>✓</span>
                ) : (
                  <span style={{
                    fontSize: '18px',
                    color: 'var(--color-muted)',
                  }}>—</span>
                )}
              </div>
            </div>
          ))}

          {/* CTA Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 160px 160px',
            borderTop: '1px solid var(--color-hairline)',
            padding: '20px 0',
          }}>
            <div />

            {/* Monthly CTA */}
            <div style={{
              padding: '0 16px',
              display: 'flex',
              justifyContent: 'center',
              borderLeft: '1px solid var(--color-hairline)',
            }}>
              <Link href="/signup" style={{
                background: 'var(--color-ink-deep)',
                color: 'var(--color-on-dark)',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: '500',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                textAlign: 'center',
                display: 'block',
                width: '100%',
              }}>
                Get Started
              </Link>
            </div>

            {/* Lifetime CTA */}
            <div style={{
              padding: '0 16px',
              display: 'flex',
              justifyContent: 'center',
              borderLeft: '1px solid var(--color-hairline)',
              background: 'var(--color-tint-lavender)',
            }}>
              <Link href="/signup" style={{
                background: 'var(--color-primary)',
                color: 'var(--color-on-dark)',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: '500',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                textAlign: 'center',
                display: 'block',
                width: '100%',
              }}>
                Buy Now
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
