import Link from 'next/link'

export default function PlanCards() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '8px',
    }}>

      {/* Monthly Plan */}
      <div style={{
        background: 'var(--color-canvas)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-block',
          background: 'var(--color-badge-monthly-bg)',
          color: 'var(--color-badge-monthly-text)',
          fontSize: '11px',
          fontWeight: '500',
          padding: '3px 10px',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-sans)',
          marginBottom: '16px',
        }}>
          Monthly Plan
        </div>

        {/* Price */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '6px',
          marginBottom: '16px',
        }}>
          <span style={{
            fontSize: '28px',
            fontWeight: '600',
            color: 'var(--color-ink-deep)',
            fontFamily: 'var(--font-sans)',
          }}>
            $30
          </span>
          <span style={{
            fontSize: '13px',
            color: 'var(--color-steel)',
            fontFamily: 'var(--font-sans)',
          }}>
            / month
          </span>
        </div>

        {/* Features */}
        <div style={{ marginBottom: '20px' }}>
          {[
            'All current courses',
            'Direct drive links access',
            'New monthly course drops',
            'Cancel anytime',
          ].map((feature) => (
            <div key={feature} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}>
              <span style={{
                color: '#27500A',
                fontSize: '14px',
              }}>✓</span>
              <span style={{
                fontSize: '13px',
                color: 'var(--color-charcoal)',
                fontFamily: 'var(--font-sans)',
              }}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link href="/signup?plan=monthly" style={{
          display: 'block',
          background: 'var(--color-ink-deep)',
          color: 'var(--color-on-dark)',
          padding: '11px 20px',
          borderRadius: 'var(--radius-md)',
          fontSize: '14px',
          fontWeight: '500',
          textDecoration: 'none',
          fontFamily: 'var(--font-sans)',
          textAlign: 'center',
        }}>
          Join Monthly
        </Link>

      </div>

      {/* Lifetime Plan */}
      <div style={{
        background: 'var(--color-tint-lavender)',
        border: '2px solid var(--color-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        position: 'relative',
      }}>

        {/* Best Value Badge */}
        <div style={{
          position: 'absolute',
          top: '-1px',
          right: '16px',
          background: 'var(--color-primary)',
          color: 'var(--color-on-dark)',
          fontSize: '10px',
          fontWeight: '600',
          padding: '4px 12px',
          borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
          fontFamily: 'var(--font-sans)',
        }}>
          BEST VALUE
        </div>

        {/* Badge */}
        <div style={{
          display: 'inline-block',
          background: 'var(--color-badge-lifetime-bg)',
          color: 'var(--color-badge-lifetime-text)',
          fontSize: '11px',
          fontWeight: '500',
          padding: '3px 10px',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-sans)',
          marginBottom: '16px',
        }}>
          Lifetime Plan
        </div>

        {/* Price */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '6px',
          marginBottom: '16px',
        }}>
          <span style={{
            fontSize: '28px',
            fontWeight: '600',
            color: 'var(--color-ink-deep)',
            fontFamily: 'var(--font-sans)',
          }}>
            $99
          </span>
          <span style={{
            fontSize: '13px',
            color: 'var(--color-steel)',
            fontFamily: 'var(--font-sans)',
          }}>
            one time
          </span>
        </div>

        {/* Features */}
        <div style={{ marginBottom: '20px' }}>
          {[
            'All current courses',
            'Direct drive links access',
            'All future courses included',
            'Lifetime updates & access',
            'Priority community support',
            'One-time payment',
          ].map((feature) => (
            <div key={feature} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}>
              <span style={{
                color: '#27500A',
                fontSize: '14px',
              }}>✓</span>
              <span style={{
                fontSize: '13px',
                color: 'var(--color-charcoal)',
                fontFamily: 'var(--font-sans)',
              }}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link href="/signup?plan=lifetime" style={{
          display: 'block',
          background: 'var(--color-primary)',
          color: 'var(--color-on-dark)',
          padding: '11px 20px',
          borderRadius: 'var(--radius-md)',
          fontSize: '14px',
          fontWeight: '500',
          textDecoration: 'none',
          fontFamily: 'var(--font-sans)',
          textAlign: 'center',
        }}>
          Get Lifetime Access
        </Link>

      </div>

    </div>
  )
}
