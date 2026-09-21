import Link from 'next/link'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'
import ReviewsCarousel from '@/components/sections/ReviewsCarousel'
import MobileStickyBar from '@/components/ui/MobileStickyBar'

const PRICE = '$99'
const REFUND_MODE: 'none' | '7day' = 'none' // set this to match my refund policy
const DASHBOARD_SCREENSHOT: string = '' // R2 image URL; if empty, hide that section

export const metadata: Metadata = {
  title: 'How to Buy | PandaCourses',
  description: `Get lifetime access to premium courses for a one-time ${PRICE}. See how it works in 4 simple steps.`,
}

export default async function HowToBuyPage() {
  const supabase = await createClient()
  const { count } = await supabase
    .from('public_courses')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)

  const courseCount = count || 0

  const steps = [
    {
      num: '01',
      title: 'Browse Courses',
      description: `Explore ${courseCount}+ courses across categories and find the skills you want to master.`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      num: '02',
      title: 'Choose Lifetime Plan',
      description: `One-time ${PRICE}, access to everything on the platform, forever. No recurring charges.`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Sign Up & Pay',
      description: 'Create your account and pay securely by card via Stripe with complete peace of mind.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
    },
    {
      num: '04',
      title: 'Start Learning',
      description: 'Your dashboard unlocks instantly with direct Mega.nz and Google Drive links to all courses.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      ),
    },
  ]

  const benefits = [
    {
      title: 'All Courses Included',
      description: 'Every published course on the platform is unlocked for you from day one.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
    {
      title: 'One-Time Payment',
      description: `Pay once (${PRICE}) and never see another bill or recurring subscription charge.`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
          <line x1="12" y1="6" x2="12" y2="8" />
          <line x1="12" y1="16" x2="12" y2="18" />
        </svg>
      ),
    },
    {
      title: 'Lifetime Access',
      description: 'Your membership and course links never expire. Learn at your own pace.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      title: 'New Courses Added',
      description: 'Lifetime members get access to newly published courses without paying extra.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      title: 'Instant Dashboard Access',
      description: 'Your student account unlocks automatically the moment your payment completes.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    {
      title: 'Request Courses',
      description: 'Looking for a specific course? Lifetime members can request courses from support.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ]

  const faqs = [
    {
      q: 'How do I get access after paying?',
      a: 'Your student dashboard unlocks instantly after payment. All course links are inside your dashboard.',
    },
    {
      q: 'Where are the courses stored?',
      a: 'Courses are delivered through Mega.nz and Google Drive links inside your dashboard.',
    },
    {
      q: 'Is it really a one-time payment?',
      a: `Yes. The Lifetime plan is a single ${PRICE} payment with lifetime access. No subscriptions.`,
    },
    {
      q: 'Will I get new courses in the future?',
      a: 'Yes. Lifetime members get access to courses published on the platform, including new ones.',
    },
    {
      q: 'Can I request a course?',
      a: 'Yes. Lifetime members can request courses by contacting our support team.',
    },
    {
      q: 'What is your refund policy?',
      a:
        REFUND_MODE === 'none' ? (
          <span>
            All sales are final. Please read our{' '}
            <Link href="/refund-policy" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
              Refund Policy
            </Link>{' '}
            before purchasing.
          </span>
        ) : (
          <span>
            We offer a 7-day money-back guarantee. Please read our{' '}
            <Link href="/refund-policy" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
              Refund Policy
            </Link>{' '}
            for details.
          </span>
        ),
    },
    {
      q: 'A Mega link is slow or limited. What can I do?',
      a: 'Install the free Mega desktop app and import the folder to your Mega account. If a link does not load, try a private/incognito window or disable ad blockers. Contact support if the problem continues.',
    },
    {
      q: 'How can I contact support?',
      a: (
        <span>
          Use the{' '}
          <Link href="/contact" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
            Contact page
          </Link>{' '}
          or WhatsApp.
        </span>
      ),
    },
  ]

  return (
    <main className="how-to-buy-page" style={{ background: 'var(--color-canvas)', minHeight: '100vh' }}>
      <Navbar />

      {/* 1. HERO (compact, dark band) */}
      <section
        style={{
          background: 'var(--color-brand-navy)',
          padding: '60px 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '480px',
            height: '240px',
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(107, 78, 255, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#A78BFA',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '12px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            LIFETIME ENROLLMENT GUIDE
          </p>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 50px)',
              fontWeight: '700',
              color: 'white',
              letterSpacing: '-1px',
              margin: '0 0 14px',
              lineHeight: 1.15,
              fontFamily: 'var(--font-sans)',
            }}
          >
            How to Get Lifetime Access
          </h1>
          <p
            style={{
              fontSize: '17px',
              color: 'var(--color-on-dark-muted)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 28px',
              lineHeight: 1.6,
            }}
          >
            Get {courseCount}+ premium courses for a one-time {PRICE}, in 4 simple steps.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/pricing"
              style={{
                background: 'var(--color-primary)',
                color: 'white',
                minHeight: '44px',
                padding: '12px 28px',
                borderRadius: 'var(--radius-md)',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                display: 'inline-flex',
                alignItems: 'center',
                boxShadow: '0 4px 16px rgba(107, 78, 255, 0.35)',
              }}
            >
              Get Lifetime Access – {PRICE}
            </Link>

            <Link
              href="/courses"
              style={{
                background: 'transparent',
                color: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                minHeight: '44px',
                padding: '12px 24px',
                borderRadius: 'var(--radius-md)',
                fontSize: '15px',
                fontWeight: 500,
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FOUR STEPS */}
      <section
        style={{
          background: 'var(--color-canvas)',
          padding: '80px 24px',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
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
              HOW IT WORKS
            </p>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 38px)',
                fontWeight: 600,
                color: 'var(--color-ink-deep)',
                letterSpacing: '-0.5px',
                fontFamily: 'var(--font-sans)',
                margin: 0,
              }}
            >
              Follow These 4 Simple Steps
            </h2>
          </div>

          {/* 4 Cards with responsive grid */}
          <div className="how-to-buy-steps-grid" style={{ marginBottom: '48px', position: 'relative' }}>
            {steps.map((step) => (
              <div
                key={step.num}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {/* Step number badge & icon */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      fontFamily: "'Space Mono', monospace",
                      color: 'var(--color-primary)',
                      background: 'rgba(107, 78, 255, 0.12)',
                      border: '1px solid rgba(107, 78, 255, 0.25)',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    STEP {step.num}
                  </span>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'white',
                      border: '1px solid var(--color-hairline)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-primary)',
                    }}
                  >
                    {step.icon}
                  </div>
                </div>

                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: 'var(--color-ink-deep)',
                    fontFamily: 'var(--font-sans)',
                    margin: '0 0 10px',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-slate)',
                    lineHeight: '1.6',
                    fontFamily: 'var(--font-sans)',
                    margin: 0,
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Centered CTA button after 4 cards */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link
              href="/pricing"
              style={{
                background: 'var(--color-primary)',
                color: 'white',
                minHeight: '44px',
                padding: '14px 32px',
                borderRadius: 'var(--radius-md)',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                display: 'inline-flex',
                alignItems: 'center',
                boxShadow: '0 4px 16px rgba(107, 78, 255, 0.3)',
              }}
            >
              Get Lifetime Access – {PRICE}
            </Link>
          </div>
        </div>
      </section>

      {/* 3. WHAT YOU GET */}
      <section
        style={{
          background: 'var(--color-surface)',
          padding: '80px 24px',
          borderTop: '1px solid var(--color-hairline)',
          borderBottom: '1px solid var(--color-hairline)',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
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
              MEMBERSHIP PERKS
            </p>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 38px)',
                fontWeight: 600,
                color: 'var(--color-ink-deep)',
                letterSpacing: '-0.5px',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 10px',
              }}
            >
              Everything Included in Lifetime Access
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--color-slate)',
                fontFamily: 'var(--font-sans)',
                margin: 0,
              }}
            >
              A single payment gives you unrestricted access to all current and future courses.
            </p>
          </div>

          {/* 6 Benefit Cards */}
          <div className="how-to-buy-benefits-grid">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                style={{
                  background: 'white',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px',
                    background: 'var(--color-tint-lavender)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)',
                  }}
                >
                  {benefit.icon}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '17px',
                      fontWeight: 600,
                      color: 'var(--color-ink-deep)',
                      fontFamily: 'var(--font-sans)',
                      margin: '0 0 6px',
                    }}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--color-slate)',
                      lineHeight: '1.6',
                      fontFamily: 'var(--font-sans)',
                      margin: 0,
                    }}
                  >
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. AFTER YOU PAY (only if DASHBOARD_SCREENSHOT is not empty) */}
      {DASHBOARD_SCREENSHOT && DASHBOARD_SCREENSHOT.trim() !== '' && (
        <section
          style={{
            background: 'var(--color-canvas)',
            padding: '80px 24px',
          }}
        >
          <div
            style={{
              maxWidth: '1120px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            {/* Left */}
            <div>
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
                INSTANT ACCESS
              </p>
              <h2
                style={{
                  fontSize: 'clamp(28px, 4vw, 36px)',
                  fontWeight: 600,
                  color: 'var(--color-ink-deep)',
                  letterSpacing: '-0.5px',
                  fontFamily: 'var(--font-sans)',
                  margin: '0 0 20px',
                }}
              >
                What happens after you pay
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { title: 'Account created instantly', desc: 'Your credentials are generated and you are automatically logged in.' },
                  { title: 'Dashboard unlocked', desc: 'Immediate access to the complete course library.' },
                  { title: 'Course links available', desc: 'Direct Mega.nz and Google Drive links ready to stream or download.' },
                ].map((bullet, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#EAF3DE',
                        color: '#27500A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      ✓
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-ink-deep)', fontFamily: 'var(--font-sans)' }}>
                        {bullet.title}
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--color-slate)', fontFamily: 'var(--font-sans)', marginTop: '2px' }}>
                        {bullet.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Dashboard screenshot frame */}
            <div
              style={{
                borderRadius: '12px',
                border: '1px solid var(--color-hairline-strong)',
                overflow: 'hidden',
                background: '#0d0b1a',
                boxShadow: '0 16px 36px rgba(0,0,0,0.12)',
              }}
            >
              <img
                src={DASHBOARD_SCREENSHOT}
                alt="Student dashboard preview"
                loading="lazy"
                decoding="async"
                width={800}
                height={440}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '440px',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* 5. PRICE CARD */}
      <section
        style={{
          background: 'var(--color-canvas)',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
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
            ONE SIMPLE PLAN
          </p>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 36px)',
              fontWeight: 600,
              color: 'var(--color-ink-deep)',
              letterSpacing: '-0.5px',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 36px',
            }}
          >
            Start Learning Today
          </h2>

          {/* Centered card */}
          <div
            style={{
              maxWidth: '480px',
              margin: '0 auto',
              background: 'white',
              border: '2px solid rgba(107, 78, 255, 0.35)',
              borderRadius: '12px',
              padding: '36px 32px',
              boxShadow: '0 12px 36px rgba(107, 78, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                fontSize: '56px',
                fontWeight: 700,
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                lineHeight: 1,
                marginBottom: '6px',
                letterSpacing: '-1px',
              }}
            >
              {PRICE}
            </div>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-slate)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 24px',
              }}
            >
              one-time payment · lifetime access
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '28px',
                textAlign: 'left',
              }}
            >
              {[
                'All courses included',
                'New courses added',
                'Instant dashboard access',
                'Mega / Google Drive links',
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: 'var(--color-charcoal)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <Link
              href="/pricing"
              style={{
                background: 'var(--color-primary)',
                color: 'white',
                minHeight: '44px',
                padding: '14px 28px',
                borderRadius: 'var(--radius-md)',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(107, 78, 255, 0.3)',
                marginBottom: '14px',
              }}
            >
              Get Lifetime Access
            </Link>

            {/* Refund note based on REFUND_MODE */}
            <p
              style={{
                fontSize: '12px',
                color: 'var(--color-slate)',
                fontFamily: 'var(--font-sans)',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {REFUND_MODE === 'none' ? (
                <span>
                  All sales are final. See our{' '}
                  <Link href="/refund-policy" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                    Refund Policy
                  </Link>
                  .
                </span>
              ) : (
                <span>
                  7-day money-back guarantee. See our{' '}
                  <Link href="/refund-policy" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                    Refund Policy
                  </Link>
                  .
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* 6. SECURE PAYMENT (compact) */}
      <section
        style={{
          background: 'var(--color-surface)',
          padding: '44px 24px',
          borderTop: '1px solid var(--color-hairline)',
          borderBottom: '1px solid var(--color-hairline)',
        }}
      >
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-ink-deep)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 16px',
            }}
          >
            Secure checkout via Stripe
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '20px',
              flexWrap: 'wrap',
            }}
          >
            {/* Visa */}
            <div
              style={{
                background: '#1A1F71',
                color: 'white',
                fontSize: '16px',
                fontWeight: 700,
                fontStyle: 'italic',
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                letterSpacing: '1px',
                fontFamily: 'sans-serif',
              }}
            >
              VISA
            </div>

            {/* Mastercard */}
            <div
              style={{
                background: 'white',
                border: '1px solid var(--color-hairline)',
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex' }}>
                <div style={{ width: '15px', height: '15px', borderRadius: '50%', background: '#EB001B', marginRight: '-6px' }} />
                <div style={{ width: '15px', height: '15px', borderRadius: '50%', background: '#F79E1B', opacity: 0.9 }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', fontFamily: 'sans-serif' }}>mastercard</span>
            </div>

            {/* Stripe */}
            <div
              style={{
                background: '#635BFF',
                color: 'white',
                fontSize: '13px',
                fontWeight: 600,
                padding: '9px 18px',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              ⚡ Powered by Stripe
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              fontSize: '13px',
              color: 'var(--color-slate)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <span>✓ Instant Access After Payment</span>
            <span>🛡️ Secure Checkout</span>
          </div>
        </div>
      </section>

      {/* 7. REVIEWS (reusing ReviewsCarousel) */}
      <div className="defer-render">
        <ReviewsCarousel />
      </div>

      {/* 8. FAQ (native details/summary accordion) */}
      <section
        className="defer-render"
        style={{
          background: 'var(--color-canvas)',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
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
              FAQ
            </p>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 38px)',
                fontWeight: 600,
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 10px',
                letterSpacing: '-0.5px',
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
              Got questions? Here is everything you need to know before buying.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                style={{
                  background: 'white',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <summary
                  style={{
                    padding: '18px 20px',
                    fontSize: '15px',
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
                    padding: '0 20px 18px',
                    fontSize: '14px',
                    lineHeight: '1.65',
                    color: 'var(--color-slate)',
                    fontFamily: 'var(--font-sans)',
                    borderTop: '1px solid var(--color-hairline-soft)',
                    paddingTop: '14px',
                  }}
                >
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA BAND */}
      <section
        id="final-cta-band"
        className="defer-render"
        style={{
          background: 'linear-gradient(180deg, #0d0b1a 0%, var(--color-brand-navy) 100%)',
          padding: '88px 24px',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
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

        <div style={{ maxWidth: '760px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              fontSize: 'clamp(30px, 4.5vw, 44px)',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-1px',
              lineHeight: 1.15,
              margin: '0 0 14px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Ready to Get Lifetime Access?
          </h2>

          <p
            style={{
              fontSize: '16px',
              color: 'var(--color-on-dark-muted)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 28px',
              lineHeight: 1.6,
            }}
          >
            One payment. All courses. Yours forever.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
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
              }}
            >
              Get Lifetime Access – {PRICE}
            </Link>

            <Link
              href="/courses"
              style={{
                fontSize: '14px',
                color: 'var(--color-on-dark-muted)',
                textDecoration: 'underline',
                fontFamily: 'var(--font-sans)',
              }}
            >
              or browse courses first
            </Link>
          </div>
        </div>
      </section>

      {/* 10. MOBILE STICKY CTA */}
      <MobileStickyBar price={PRICE} targetId="final-cta-band" />

      <Footer />
    </main>
  )
}
