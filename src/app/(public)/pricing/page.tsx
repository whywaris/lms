import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'

export const metadata = { title: 'Pricing' }

export default function PricingPage() {
  const trustItems = [
    '120+ Students Enrolled',
    'New Courses Every Month',
    'Instant Access After Payment',
  ]

  const starterFeatures = [
    'Access all published courses',
    'New courses every month',
    'Mega/Gdrive links access',
    'Support 24/7',
    'Cancel anytime',
  ]

  const lifetimeFeatures = [
    'Everything in Starter',
    'Early access to new courses',
    'Request new courses',
    'Hidden and exclusive courses access',
    'Priority support',
    'One-time payment, never pay again',
    'Lifetime updates included',
  ]

  const faqs = [
    {
      q: 'Can I cancel my monthly plan anytime?',
      a: 'Yes — cancel anytime with no questions asked. You keep access until the end of your billing period.',
    },
    {
      q: 'Can I upgrade from monthly to lifetime?',
      a: 'Absolutely. Just purchase the lifetime plan and your access will be upgraded instantly.',
    },
    {
      q: 'How do I access courses after purchase?',
      a: 'After signup, log into your dashboard — all courses will be listed there with direct Mega/Gdrive links.',
    },
    {
      q: 'Is there a refund policy?',
      a: 'We offer a 7-day money back guarantee. Contact support within 7 days of purchase for a full refund.',
    },
  ]

  return (
    <main style={{ background: 'var(--color-canvas)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        background: 'var(--color-brand-navy)',
        padding: '80px 32px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: '600',
          color: 'white',
          margin: '0 0 16px',
          fontFamily: 'var(--font-sans)',
          lineHeight: '1.2',
          letterSpacing: '-1px',
        }}>
          One Price. Every Course. Forever.
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'var(--color-on-dark-muted)',
          maxWidth: '600px',
          margin: '0 auto',
          fontFamily: 'var(--font-sans)',
          lineHeight: '1.6',
        }}>
          Stop paying per course — get unlimited access to everything.
        </p>
      </section>

      {/* Trust Bar */}
      <section style={{
        background: 'white',
        borderBottom: '1px solid var(--color-hairline)',
        padding: '20px 32px',
      }}>
        <div className="trust-bar" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '48px',
          flexWrap: 'wrap',
        }}>
          {trustItems.map((item, i) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-slate)',
                fontFamily: 'var(--font-sans)',
              }}>
                {item}
              </span>
              {i < trustItems.length - 1 && (
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--color-hairline-strong)' }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Plan Cards Section */}
      <section style={{
        background: 'white',
        padding: '80px 32px',
      }}>
        <div className="pricing-grid" style={{
          maxWidth: '860px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}>
          
          {/* Monthly Card */}
          <div style={{
            background: 'white',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
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
              MONTHLY
            </p>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'var(--color-ink-deep)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 8px',
            }}>
              Starter
            </h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
              <span style={{ fontSize: '48px', fontWeight: '600', color: 'var(--color-ink-deep)', fontFamily: 'var(--font-sans)' }}>$30</span>
              <span style={{ fontSize: '14px', color: 'var(--color-steel)', fontFamily: 'var(--font-sans)' }}>/month</span>
            </div>
            <div style={{ height: '1px', background: 'var(--color-hairline)', margin: '24px 0' }} />
            <p style={{
              fontSize: '11px',
              fontWeight: '500',
              color: 'var(--color-steel)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 16px',
            }}>
              EVERYTHING INCLUDED
            </p>
            <div style={{ flex: 1 }}>
              {starterFeatures.map((feature) => (
                <div key={feature} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#27500A', fontWeight: '600', fontSize: '14px' }}>✓</span>
                  <span style={{ fontSize: '14px', color: 'var(--color-charcoal)', fontFamily: 'var(--font-sans)', lineHeight: '1.4' }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
            <Link 
              href={process.env.NEXT_PUBLIC_GUMROAD_MONTHLY_URL || '#'} 
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '48px',
                background: 'var(--color-ink-deep)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                marginTop: '24px',
              }}
            >
              Get Monthly Access
            </Link>
            <p style={{
              fontSize: '12px',
              color: 'var(--color-steel)',
              textAlign: 'center',
              marginTop: '12px',
              fontFamily: 'var(--font-sans)',
            }}>
              One-time purchase for 1 month access
            </p>
          </div>

          {/* Lifetime Card */}
          <div style={{
            background: 'var(--color-tint-lavender)',
            border: '2px solid var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              position: 'absolute',
              top: '-1px',
              right: '16px',
              background: 'var(--color-primary)',
              color: 'white',
              fontSize: '10px',
              fontWeight: '600',
              padding: '4px 12px',
              borderRadius: '0 0 6px 6px',
              fontFamily: 'var(--font-sans)',
            }}>
              ⭐ POPULAR
            </div>
            <p style={{
              fontSize: '11px',
              fontWeight: '500',
              color: 'var(--color-steel)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 12px',
            }}>
              LIFETIME
            </p>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'var(--color-ink-deep)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 8px',
            }}>
              All Access
            </h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
              <span style={{ fontSize: '48px', fontWeight: '600', color: 'var(--color-ink-deep)', fontFamily: 'var(--font-sans)' }}>$99</span>
              <span style={{ fontSize: '14px', color: 'var(--color-steel)', fontFamily: 'var(--font-sans)' }}>one time</span>
            </div>
            <div style={{ height: '1px', background: 'var(--color-hairline)', margin: '24px 0' }} />
            <p style={{
              fontSize: '11px',
              fontWeight: '500',
              color: 'var(--color-steel)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 16px',
            }}>
              EVERYTHING INCLUDED
            </p>
            <div style={{ flex: 1 }}>
              {lifetimeFeatures.map((feature) => (
                <div key={feature} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#27500A', fontWeight: '600', fontSize: '14px' }}>✓</span>
                  <span style={{ fontSize: '14px', color: 'var(--color-charcoal)', fontFamily: 'var(--font-sans)', lineHeight: '1.4' }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
            <Link 
              href={process.env.NEXT_PUBLIC_GUMROAD_LIFETIME_URL || '#'} 
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '48px',
                background: 'var(--color-primary)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                marginTop: '24px',
              }}
            >
              Get Lifetime Access
            </Link>
            <p style={{
              fontSize: '12px',
              color: 'var(--color-steel)',
              textAlign: 'center',
              marginTop: '12px',
              fontFamily: 'var(--font-sans)',
            }}>
              One-time payment grants lifetime access to everything
            </p>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section style={{
        background: 'var(--color-surface)',
        padding: '80px 32px',
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: 'var(--color-ink-deep)',
            textAlign: 'center',
            marginBottom: '40px',
            fontFamily: 'var(--font-sans)',
          }}>
            Frequently Asked Questions
          </h2>
          {faqs.map((faq, i) => (
            <div key={i} style={{
              background: 'white',
              border: '1px solid var(--color-hairline)',
              borderRadius: 'var(--radius-md)',
              padding: '20px 24px',
              marginBottom: '12px',
            }}>
              <p style={{
                fontSize: '15px',
                fontWeight: '500',
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 8px',
              }}>
                {faq.q}
              </p>
              <p style={{
                fontSize: '14px',
                color: 'var(--color-slate)',
                fontFamily: 'var(--font-sans)',
                lineHeight: '1.6',
                margin: '0',
              }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        background: 'var(--color-brand-navy)',
        padding: '64px 32px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: 'white',
          fontFamily: 'var(--font-sans)',
          margin: '0 0 12px',
        }}>
          Ready to start learning?
        </h2>
        <p style={{
          fontSize: '15px',
          color: 'var(--color-on-dark-muted)',
          fontFamily: 'var(--font-sans)',
          margin: '0 0 32px',
        }}>
          Join 120+ students already learning.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Link href="/signup" style={{
            background: 'var(--color-primary)',
            color: 'white',
            padding: '12px 28px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontWeight: '500',
            textDecoration: 'none',
            fontFamily: 'var(--font-sans)',
          }}>
            Get Started
          </Link>
          <Link href="/courses" style={{
            background: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '12px 28px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontWeight: '500',
            textDecoration: 'none',
            fontFamily: 'var(--font-sans)',
          }}>
            Browse Courses
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
