import Link from 'next/link'

export default function FAQ() {
  const faqs = [
    {
      q: 'How do I get access after buying?',
      a: (
        <span>
          Instant dashboard access after purchase; courses are delivered via Mega / Google Drive links directly inside your member dashboard.
        </span>
      ),
    },
    {
      q: 'Is it a one-time payment?',
      a: (
        <span>
          Yes, the Lifetime plan is a one-time $99 payment with lifetime access. There are no recurring fees or hidden charges.
        </span>
      ),
    },
    {
      q: 'Do you offer refunds?',
      a: (
        <span>
          7-day money back, as stated in the comparison table. For full details, please review our{' '}
          <Link
            href="/refund-policy"
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'underline',
              fontWeight: 500,
            }}
          >
            Refund Policy
          </Link>
          .
        </span>
      ),
    },
    {
      q: 'Can I watch on any device?',
      a: (
        <span>
          Yes, access your courses on any device via your dashboard, whether on desktop, tablet, or smartphone.
        </span>
      ),
    },
    {
      q: 'How can I contact support?',
      a: (
        <span>
          Via the{' '}
          <Link
            href="/contact"
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'underline',
              fontWeight: 500,
            }}
          >
            Contact page
          </Link>{' '}
          and WhatsApp. Our team is available to assist you with any questions.
        </span>
      ),
    },
  ]

  return (
    <section
      style={{
        background: 'var(--color-surface)',
        padding: '80px 24px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
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
            FAQ
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
            Frequently Asked Questions
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--color-slate)',
              fontFamily: 'var(--font-sans)',
              margin: 0,
            }}
          >
            Everything you need to know about access, pricing, and support.
          </p>
        </div>

        {/* Accordion List using native <details> / <summary> */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, index) => (
            <details
              key={index}
              style={{
                background: 'white',
                border: '1px solid var(--color-hairline)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                transition: 'border-color 0.2s ease',
              }}
            >
              <summary
                style={{
                  padding: '20px 24px',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--color-ink-deep)',
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  userSelect: 'none',
                }}
              >
                <span>{faq.q}</span>
                <span
                  style={{
                    fontSize: '18px',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  +
                </span>
              </summary>
              <div
                style={{
                  padding: '0 24px 20px',
                  fontSize: '15px',
                  lineHeight: '1.65',
                  color: 'var(--color-slate)',
                  fontFamily: 'var(--font-sans)',
                  borderTop: '1px solid var(--color-hairline-soft)',
                  paddingTop: '16px',
                }}
              >
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
