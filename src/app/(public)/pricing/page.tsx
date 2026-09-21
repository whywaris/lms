import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'
import ReviewsCarousel from '@/components/sections/ReviewsCarousel'
import MobileStickyBar from '@/components/ui/MobileStickyBar'
import { createClient } from '@/lib/supabase/server'
import {
  PRICE_USD,
  REFUND_MODE,
  SHOW_FREE_PLAN,
  FREE_FEATURES,
  LIFETIME_FEATURES,
} from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Pricing | PandaCourses',
  description: 'One-time $99 for lifetime access to every course on PandaCourses.',
}

export default async function PricingPage() {
  const supabase = await createClient()

  // Real published course count (head only)
  const { count: courseCount } = await supabase
    .from('public_courses')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)

  const count = courseCount || 0
  const checkoutUrl = process.env.NEXT_PUBLIC_GUMROAD_LIFETIME_URL || '#'
  const priceFormatted = `$${PRICE_USD}`

  const trustItems = [
    `${count}+ Courses`,
    'Instant Access After Payment',
    'Lifetime Updates',
  ]

  const faqs = [
    {
      q: 'How do I access courses after purchase?',
      a: (
        <span>
          After signup, log into your dashboard. All courses are listed there with direct Mega / Google Drive links.
        </span>
      ),
    },
    {
      q: 'Is it really a one-time payment?',
      a: (
        <span>
          Yes. One payment of {priceFormatted} gives you lifetime access. No subscriptions.
        </span>
      ),
    },
    {
      q: 'Will new courses be added?',
      a: (
        <span>
          Yes. Lifetime members get access to courses published on the platform, including new ones.
        </span>
      ),
    },
    {
      q: 'Can I request a course?',
      a: (
        <span>
          Yes. Lifetime members can request courses from our support team.
        </span>
      ),
    },
    {
      q: 'What is your refund policy?',
      a: (
        <span>
          {REFUND_MODE === '7day' ? (
            <>
              We offer a 7-day money-back guarantee. Contact support within 7 days of purchase for a full refund. Please read our{' '}
              <Link href="/refund-policy" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                Refund Policy
              </Link>{' '}
              for full details.
            </>
          ) : (
            <>
              All sales are final. Please read our{' '}
              <Link href="/refund-policy" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                Refund Policy
              </Link>{' '}
              before purchasing.
            </>
          )}
        </span>
      ),
    },
    {
      q: 'Which payment methods do you accept?',
      a: (
        <span>
          We accept Visa and Mastercard, processed securely by Stripe.
        </span>
      ),
    },
    {
      q: 'How can I contact support?',
      a: (
        <span>
          You can reach us anytime through our{' '}
          <Link href="/contact" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
            Contact page
          </Link>{' '}
          or via email. Our team typically responds within 24 hours.
        </span>
      ),
    },
  ]

  return (
    <main style={{ background: 'var(--color-canvas)', minHeight: '100vh', paddingBottom: '72px' }}>
      <Navbar />

      {/* A) HERO SECTION (Dark band, compact) */}
      <section
        style={{
          background: 'var(--color-brand-navy)',
          padding: '64px 24px 52px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle purple radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '460px',
            height: '220px',
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(107, 78, 255, 0.22) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '840px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#A78BFA',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '12px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            LIFETIME MEMBERSHIP
          </p>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 700,
              color: 'white',
              margin: '0 0 16px',
              fontFamily: 'var(--font-sans)',
              lineHeight: '1.18',
              letterSpacing: '-1px',
            }}
          >
            One Price. Every Course. Forever.
          </h1>
          <p
            style={{
              fontSize: '17px',
              color: 'var(--color-on-dark-muted)',
              maxWidth: '620px',
              margin: '0 auto',
              fontFamily: 'var(--font-sans)',
              lineHeight: '1.6',
            }}
          >
            Pay once. Get {count}+ premium courses and every new one we add.
          </p>
        </div>
      </section>

      {/* B) VALUE STRIP (Light, thin) */}
      <section
        style={{
          background: 'white',
          borderBottom: '1px solid var(--color-hairline)',
          padding: '16px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '36px',
            flexWrap: 'wrap',
          }}
        >
          {trustItems.map((item, i) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-ink-deep)',
                  fontFamily: 'var(--font-sans)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>✓</span> {item}
              </span>
              {i < trustItems.length - 1 && (
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'var(--color-hairline-strong)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* C) PRICING CARD SECTION */}
      <section
        style={{
          background: 'var(--color-canvas)',
          padding: '72px 24px',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: SHOW_FREE_PLAN ? 'row' : 'column',
              justifyContent: 'center',
              alignItems: 'stretch',
              gap: '32px',
              flexWrap: 'wrap',
            }}
          >
            {/* Optional Free Plan Card */}
            {SHOW_FREE_PLAN && (
              <div
                style={{
                  flex: '1 1 360px',
                  maxWidth: '440px',
                  background: 'white',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: '12px',
                  padding: '36px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                }}
              >
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-steel)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-sans)',
                    margin: '0 0 8px',
                  }}
                >
                  FREE
                </p>
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    color: 'var(--color-ink-deep)',
                    fontFamily: 'var(--font-sans)',
                    margin: '0 0 16px',
                  }}
                >
                  Free Account
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '48px', fontWeight: 700, color: 'var(--color-ink-deep)', fontFamily: 'var(--font-sans)' }}>$0</span>
                  <span style={{ fontSize: '14px', color: 'var(--color-steel)', fontFamily: 'var(--font-sans)' }}>free forever</span>
                </div>

                <div style={{ height: '1px', background: 'var(--color-hairline)', margin: '0 0 24px' }} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                  {FREE_FEATURES.map((feature) => (
                    <div key={feature} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ color: 'var(--color-slate)', fontWeight: 600, fontSize: '14px' }}>✓</span>
                      <span style={{ fontSize: '14px', color: 'var(--color-charcoal)', fontFamily: 'var(--font-sans)', lineHeight: '1.4' }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/signup"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    minHeight: '48px',
                    background: 'transparent',
                    color: 'var(--color-ink-deep)',
                    border: '1px solid var(--color-hairline-strong)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '15px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  Create Free Account
                </Link>
              </div>
            )}

            {/* Lifetime Card (Featured) */}
            <div
              style={{
                flex: '1 1 420px',
                maxWidth: '520px',
                margin: SHOW_FREE_PLAN ? '0' : '0 auto',
                width: '100%',
                background: 'white',
                border: '2px solid var(--color-primary)',
                borderRadius: '12px',
                padding: '40px 36px',
                boxShadow: '0 16px 40px rgba(107, 78, 255, 0.12), 0 0 0 1px rgba(107, 78, 255, 0.08)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* BEST VALUE Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '-1px',
                  right: '28px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '5px 14px',
                  borderRadius: '0 0 8px 8px',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  boxShadow: '0 2px 8px rgba(107, 78, 255, 0.3)',
                }}
              >
                ⭐ BEST VALUE
              </div>

              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-sans)',
                  margin: '0 0 8px',
                }}
              >
                LIFETIME
              </p>

              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: 'var(--color-ink-deep)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0 0 16px',
                  letterSpacing: '-0.5px',
                }}
              >
                All Access
              </h2>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '56px',
                    fontWeight: 700,
                    color: 'var(--color-ink-deep)',
                    fontFamily: 'var(--font-sans)',
                    lineHeight: 1,
                    letterSpacing: '-1px',
                  }}
                >
                  {priceFormatted}
                </span>
                <span
                  style={{
                    fontSize: '15px',
                    color: 'var(--color-steel)',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 500,
                  }}
                >
                  one-time payment
                </span>
              </div>

              {/* Per-course value calculation */}
              {count > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      background: 'rgba(107, 78, 255, 0.08)',
                      border: '1px solid rgba(107, 78, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    🔥 Just ${(PRICE_USD / count).toFixed(2)} per course today
                  </span>
                </div>
              )}

              <div style={{ height: '1px', background: 'var(--color-hairline)', margin: '28px 0' }} />

              <p
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--color-steel)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-sans)',
                  margin: '0 0 16px',
                }}
              >
                EVERYTHING INCLUDED
              </p>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                {LIFETIME_FEATURES.map((feature) => (
                  <div key={feature} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="none"
                      style={{ flexShrink: 0, marginTop: '2px' }}
                    >
                      <circle cx="10" cy="10" r="10" fill="#EDE9FE" />
                      <path
                        d="M6 10.5L8.5 13L14 7.5"
                        stroke="#6B4EFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      style={{
                        fontSize: '14px',
                        color: 'var(--color-charcoal)',
                        fontFamily: 'var(--font-sans)',
                        lineHeight: '1.5',
                        fontWeight: 500,
                      }}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Primary CTA button */}
              <Link
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  minHeight: '52px',
                  padding: '14px 28px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '16px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontFamily: 'var(--font-sans)',
                  boxShadow: '0 4px 18px rgba(107, 78, 255, 0.35)',
                  transition: 'opacity 0.2s',
                  boxSizing: 'border-box',
                }}
              >
                Get Lifetime Access – {priceFormatted}
              </Link>

              {/* Refund guarantee note */}
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--color-slate)',
                  textAlign: 'center',
                  marginTop: '14px',
                  marginBottom: '20px',
                  fontFamily: 'var(--font-sans)',
                  lineHeight: '1.5',
                }}
              >
                {REFUND_MODE === '7day' ? (
                  <>
                    7-day money-back guarantee ·{' '}
                    <Link
                      href="/refund-policy"
                      style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
                    >
                      See Refund Policy
                    </Link>
                  </>
                ) : (
                  <>
                    All sales are final ·{' '}
                    <Link
                      href="/refund-policy"
                      style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
                    >
                      See Refund Policy
                    </Link>
                  </>
                )}
              </p>

              {/* Small payment badges row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--color-hairline)',
                  flexWrap: 'wrap',
                }}
              >
                {/* Visa Badge */}
                <div
                  style={{
                    background: '#1A1F71',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    letterSpacing: '1px',
                    fontFamily: 'sans-serif',
                    lineHeight: '16px',
                  }}
                >
                  VISA
                </div>

                {/* Mastercard Badge */}
                <div
                  style={{
                    background: 'white',
                    border: '1px solid var(--color-hairline-strong)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    lineHeight: '16px',
                  }}
                >
                  <div style={{ display: 'flex' }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#EB001B',
                        marginRight: '-5px',
                      }}
                    />
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#F79E1B',
                        opacity: 0.9,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#1a1a1a',
                      fontFamily: 'sans-serif',
                    }}
                  >
                    mastercard
                  </span>
                </div>

                {/* Stripe Badge */}
                <div
                  style={{
                    background: '#635BFF',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-sans)',
                    lineHeight: '14px',
                  }}
                >
                  ⚡ Powered by Stripe
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* D) VALUE COMPARISON (Compact card/table) */}
      <section
        style={{
          background: 'white',
          padding: '72px 24px',
          borderTop: '1px solid var(--color-hairline)',
          borderBottom: '1px solid var(--color-hairline)',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '8px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              VALUE COMPARISON
            </p>
            <h2
              style={{
                fontSize: 'clamp(24px, 4vw, 32px)',
                fontWeight: 700,
                color: 'var(--color-ink-deep)',
                margin: '0 0 10px',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.5px',
              }}
            >
              Buying Separately vs. PandaCourses Lifetime
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: 'var(--color-slate)',
                fontFamily: 'var(--font-sans)',
                margin: 0,
              }}
            >
              See why one lifetime membership delivers exponentially more value.
            </p>
          </div>

          {/* 2-Column Comparison Box */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              alignItems: 'stretch',
            }}
          >
            {/* Left: Buying Separately */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-hairline)',
                borderRadius: '12px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-steel)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontFamily: 'var(--font-sans)',
                  marginBottom: '8px',
                }}
              >
                Other Platforms
              </span>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--color-ink-deep)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0 0 14px',
                }}
              >
                Buying One by One
              </h3>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#DC2626',
                  fontFamily: 'var(--font-sans)',
                  marginBottom: '16px',
                }}
              >
                $200+ each
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                <div style={{ display: 'flex', gap: '10px', fontSize: '14px', color: 'var(--color-slate)', fontFamily: 'var(--font-sans)' }}>
                  <span style={{ color: '#DC2626', fontWeight: 700 }}>✗</span>
                  <span>Costs thousands to build a complete skill stack</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '14px', color: 'var(--color-slate)', fontFamily: 'var(--font-sans)' }}>
                  <span style={{ color: '#DC2626', fontWeight: 700 }}>✗</span>
                  <span>Scattered logins, links, and expired access</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '14px', color: 'var(--color-slate)', fontFamily: 'var(--font-sans)' }}>
                  <span style={{ color: '#DC2626', fontWeight: 700 }}>✗</span>
                  <span>Pay full price again for any future course or revision</span>
                </div>
              </div>
            </div>

            {/* Right: PandaCourses Lifetime */}
            <div
              style={{
                background: '#FBF9FF',
                border: '2px solid var(--color-primary)',
                borderRadius: '12px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 8px 24px rgba(107, 78, 255, 0.08)',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontFamily: 'var(--font-sans)',
                  marginBottom: '8px',
                }}
              >
                PandaCourses
              </span>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--color-ink-deep)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0 0 14px',
                }}
              >
                All Access Lifetime
              </h3>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-sans)',
                  marginBottom: '16px',
                }}
              >
                {priceFormatted} once for {count}+ courses
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                <div style={{ display: 'flex', gap: '10px', fontSize: '14px', color: 'var(--color-charcoal)', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
                  <span style={{ color: '#16A34A', fontWeight: 700 }}>✓</span>
                  <span>Instant access to every single course today</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '14px', color: 'var(--color-charcoal)', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
                  <span style={{ color: '#16A34A', fontWeight: 700 }}>✓</span>
                  <span>Centralized dashboard with direct Mega & Google Drive links</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '14px', color: 'var(--color-charcoal)', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
                  <span style={{ color: '#16A34A', fontWeight: 700 }}>✓</span>
                  <span>All future course releases included at zero extra cost</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* E) REVIEWS (Reusing existing components/sections/ReviewsCarousel.tsx) */}
      <div className="defer-render">
        <ReviewsCarousel />
      </div>

      {/* F) FAQ SECTION (Native <details>/<summary>, max-width ~760px) */}
      <section
        className="defer-render"
        style={{
          background: 'var(--color-surface)',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '8px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              GOT QUESTIONS?
            </p>
            <h2
              style={{
                fontSize: 'clamp(26px, 4vw, 36px)',
                fontWeight: 700,
                color: 'var(--color-ink-deep)',
                margin: 0,
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.5px',
              }}
            >
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                style={{
                  background: 'white',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px 24px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <summary
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-ink-deep)',
                    fontFamily: 'var(--font-sans)',
                    cursor: 'pointer',
                    outline: 'none',
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
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                </summary>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-slate)',
                    fontFamily: 'var(--font-sans)',
                    lineHeight: '1.65',
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--color-hairline)',
                  }}
                >
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* G) FINAL CTA BAND (Dark, subtle purple gradient) */}
      <section
        id="final-cta-band"
        className="defer-render"
        style={{
          background: 'linear-gradient(180deg, var(--color-brand-navy) 0%, #15132A 100%)',
          padding: '72px 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 38px)',
              fontWeight: 700,
              color: 'white',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 12px',
              letterSpacing: '-0.5px',
            }}
          >
            Ready to Get Lifetime Access?
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--color-on-dark-muted)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 32px',
              lineHeight: '1.6',
            }}
          >
            One payment. All courses. Yours forever.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <Link
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '48px',
                padding: '14px 36px',
                background: 'var(--color-primary)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                boxShadow: '0 4px 18px rgba(107, 78, 255, 0.4)',
              }}
            >
              Get Lifetime Access – {priceFormatted}
            </Link>

            <Link
              href="/courses"
              style={{
                fontSize: '13px',
                color: 'var(--color-on-dark-muted)',
                fontFamily: 'var(--font-sans)',
                textDecoration: 'underline',
              }}
            >
              or browse courses first
            </Link>
          </div>
        </div>
      </section>

      {/* H) MOBILE STICKY CTA */}
      <MobileStickyBar
        price={priceFormatted}
        href={checkoutUrl}
        targetId="final-cta-band"
        ctaText="Get Access"
      />

      <Footer />
    </main>
  )
}
