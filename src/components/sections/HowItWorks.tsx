export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Purchase a Plan',
      description: 'Select a Monthly or Lifetime plan that suits your needs. Enroll once to unlock access to all available courses on the platform.',
      tint: 'var(--color-tint-lavender)',
    },
    {
      number: '02',
      title: 'Access Your Dashboard',
      description: 'Log in to your personalized dashboard where you\'ll find a complete list of courses tailored to your active plan.',
      tint: 'var(--color-tint-mint)',
    },
    {
      number: '03',
      title: 'Start Learning',
      description: 'Select your preferred course, access learning materials via secure Drive links, and start building real-world projects.',
      tint: 'var(--color-tint-peach)',
    },
  ]

  return (
    <section style={{
      background: 'var(--color-canvas)',
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
            How It Works
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
            Start Your Journey in Three Easy Steps
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
            No complications — just enroll and start your learning journey immediately.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="steps-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {steps.map((step) => (
            <div key={step.number} style={{
              background: step.tint,
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              position: 'relative',
            }}>

              {/* Step Number */}
              <p style={{
                fontSize: '48px',
                fontWeight: '600',
                color: 'var(--color-hairline-strong)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 24px',
                lineHeight: '1',
                letterSpacing: '-1px',
              }}>
                {step.number}
              </p>

              {/* Title */}
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 12px',
                lineHeight: '1.3',
              }}>
                {step.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '14px',
                color: 'var(--color-charcoal)',
                fontFamily: 'var(--font-sans)',
                margin: '0',
                lineHeight: '1.7',
              }}>
                {step.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
