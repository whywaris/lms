export default function Features() {
  const features = [
    {
      icon: '⚡',
      title: 'Instant Access',
      description: 'Get instant dashboard access immediately after payment. No waiting times or manual approvals required.',
      tint: 'var(--color-tint-lavender)',
    },
    {
      icon: '📺',
      title: 'Stream Anywhere',
      description: 'Access your courses on any device, anytime. Download via Mega or Google Drive links for offline access.',
      tint: 'var(--color-tint-mint)',
    },
    {
      icon: '🔒',
      title: 'Safe & Secure',
      description: 'Your payment and personal data are fully protected. We use industry-standard security practices.',
      tint: 'var(--color-tint-peach)',
    },
    {
      icon: '❤️',
      title: 'We Care About You',
      description: 'Our support team is available 24/7. We are committed to your learning success every step of the way.',
      tint: 'var(--color-tint-sky)',
    },
  ]

  return (
    <section style={{
      background: 'var(--color-surface)',
      padding: '96px 32px',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
      }}>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '64px',
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
            Features
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
            Why Choose Us?
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'var(--color-slate)',
            fontFamily: 'var(--font-sans)',
            margin: '0',
            maxWidth: '480px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6',
          }}>
            We provide everything you need to succeed in your learning journey.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
        }}>
          {features.map((feature) => (
            <div key={feature.title} style={{
              background: feature.tint,
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
            }}>

              {/* Icon */}
              <div style={{
                fontSize: '32px',
                marginBottom: '16px',
                lineHeight: '1',
              }}>
                {feature.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '17px',
                fontWeight: '600',
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 10px',
                lineHeight: '1.3',
              }}>
                {feature.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '14px',
                color: 'var(--color-charcoal)',
                fontFamily: 'var(--font-sans)',
                margin: '0',
                lineHeight: '1.7',
              }}>
                {feature.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
