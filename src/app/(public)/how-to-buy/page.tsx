import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'

export const metadata = { title: 'How to Buy' }

export default function HowToBuyPage() {
  const steps = [
    {
      num: '01',
      icon: '🔍',
      title: 'Browse Our Courses',
      description: 'Visit our courses page and explore 2000+ premium courses across multiple categories. Find the one that matches your learning goals.',
    },
    {
      num: '02',
      icon: '💳',
      title: 'Choose Your Plan',
      description: 'Select between our Monthly Plan ($30/month) or Lifetime Plan ($99 one-time). The Lifetime Plan gives you access to everything — forever.',
    },
    {
      num: '03',
      icon: '✅',
      title: 'Sign Up & Pay Securely',
      description: 'Create your account and complete your payment securely via Stripe. We accept Visa and Mastercard. Your data is protected with 256-bit SSL encryption.',
    },
    {
      num: '04',
      icon: '🚀',
      title: 'Access Your Dashboard',
      description: 'Instantly access your student dashboard after payment. All courses with their Mega/Gdrive links will be available immediately — no waiting.',
    },
  ]

  const faqs = [
    {
      q: 'Do I get access to all courses with a VIP membership?',
      a: 'Yes — both Monthly and Lifetime members get access to all published courses on the platform. Lifetime members also get access to future courses and exclusive hidden content.',
    },
    {
      q: 'Where are the courses stored?',
      a: 'All courses are stored on Mega.nz or Google Drive. After purchase, you will find direct download/access links in your student dashboard.',
    },
    {
      q: 'How do I download from Mega.nz and bypass download limits?',
      a: 'You can use the Mega desktop app to bypass browser download limits. Simply install the app, click the link, and import it directly to your Mega account for unlimited access.',
    },
    {
      q: 'A link shows href.li and will not load — what do I do?',
      a: 'href.li is a link redirect service we use. If it does not load, try opening it in a private/incognito browser window or disable any ad blockers. The link will redirect you to the correct course file.',
    },
    {
      q: 'Can I request a course?',
      a: 'Lifetime members can request courses directly. Monthly members can upgrade to Lifetime to unlock this feature. Contact our support team with your request.',
    },
    {
      q: 'What is your refund policy?',
      a: 'We do not offer refunds. You joined for a reason — so make the most of it and start downloading the courses! If you have any issues with access, our support team is available 24/7.',
    },
    {
      q: 'Can I upgrade from Monthly to Lifetime?',
      a: 'Yes — you can upgrade anytime. Simply purchase the Lifetime plan and your access will be upgraded instantly. Contact support if you need any assistance.',
    },
  ]

  return (
    <main style={{ background: 'var(--color-canvas)', minHeight: '100vh' }}>
      <Navbar />

      {/* SECTION 1 — Hero */}
      <section style={{
        background: 'var(--color-brand-navy)',
        padding: '64px 32px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '600',
          color: 'white',
          letterSpacing: '-1px',
          margin: '0 0 12px',
          fontFamily: 'var(--font-sans)',
        }}>
          How to Buy
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'var(--color-on-dark-muted)',
          fontFamily: 'var(--font-sans)',
          margin: '0',
        }}>
          Get access to 2000+ premium courses in just a few simple steps.
        </p>
      </section>

      {/* SECTION 2 — Steps */}
      <section style={{
        background: 'var(--color-canvas)',
        padding: '80px 32px',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: 'var(--color-ink-deep)',
            textAlign: 'center',
            marginBottom: '48px',
            fontFamily: 'var(--font-sans)',
          }}>
            Follow These Simple Steps
          </h2>
          
          <div>
            {steps.map((step) => (
              <div key={step.num} style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start',
                marginBottom: '40px',
              }}>
                <div style={{
                  fontSize: '48px',
                  fontWeight: '600',
                  color: 'var(--color-primary)',
                  opacity: 0.3,
                  lineHeight: 1,
                  minWidth: '64px',
                  fontFamily: 'var(--font-sans)',
                }}>
                  {step.num}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '24px' }}>{step.icon}</span>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: 'var(--color-ink-deep)',
                      fontFamily: 'var(--font-sans)',
                      margin: '0',
                    }}>
                      {step.title}
                    </h3>
                  </div>
                  <p style={{
                    fontSize: '15px',
                    color: 'var(--color-slate)',
                    lineHeight: '1.7',
                    fontFamily: 'var(--font-sans)',
                    margin: '0',
                  }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--color-hairline)', marginTop: '48px' }} />
        </div>
      </section>

      {/* SECTION 3 — Payment & Security */}
      <section style={{
        background: 'var(--color-surface)',
        padding: '64px 32px',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '600',
            color: 'var(--color-ink-deep)',
            marginBottom: '8px',
            fontFamily: 'var(--font-sans)',
          }}>
            Secure Payment
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'var(--color-slate)',
            marginBottom: '32px',
            fontFamily: 'var(--font-sans)',
          }}>
            All transactions are encrypted and secure.
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
            flexWrap: 'wrap',
          }}>
            {/* Visa */}
            <div style={{
              background: '#1A1F71',
              color: 'white',
              fontSize: '18px',
              fontWeight: 700,
              fontStyle: 'italic',
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              letterSpacing: '1px',
              fontFamily: 'sans-serif',
            }}>
              VISA
            </div>
            {/* Mastercard */}
            <div style={{
              background: 'white',
              border: '1px solid var(--color-hairline)',
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#EB001B', marginRight: '-6px' }} />
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#F79E1B', opacity: 0.9 }} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', fontFamily: 'sans-serif' }}>mastercard</span>
            </div>
            {/* Stripe */}
            <div style={{
              background: '#635BFF',
              color: 'white',
              fontSize: '13px',
              fontWeight: 600,
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-sans)',
            }}>
              ⚡ Powered by Stripe
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
          }}>
            {[
              '🔒 256-bit SSL Encryption',
              '✓ Instant Access After Payment',
              '🛡️ Secure Checkout',
            ].map((badge) => (
              <div key={badge} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: 'var(--color-slate)',
                fontFamily: 'var(--font-sans)',
              }}>
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — FAQ */}
      <section style={{
        background: 'var(--color-canvas)',
        padding: '80px 32px',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
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
          
          <div>
            {faqs.map((faq, i) => (
              <div key={i} style={{
                border: '1px solid var(--color-hairline)',
                borderRadius: 'var(--radius-md)',
                padding: '20px 24px',
                marginBottom: '12px',
                background: 'white',
              }}>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--color-ink-deep)',
                  marginBottom: '8px',
                  fontFamily: 'var(--font-sans)',
                  margin: '0 0 8px',
                }}>
                  Q: {faq.q}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--color-slate)',
                  lineHeight: '1.7',
                  fontFamily: 'var(--font-sans)',
                  margin: '0',
                }}>
                  A: {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — CTA */}
      <section style={{
        background: 'var(--color-brand-navy)',
        padding: '64px 32px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '600',
          color: 'white',
          marginBottom: '12px',
          fontFamily: 'var(--font-sans)',
          margin: '0 0 12px',
        }}>
          Ready to Get Started?
        </h2>
        <p style={{
          fontSize: '15px',
          color: 'var(--color-on-dark-muted)',
          marginBottom: '32px',
          fontFamily: 'var(--font-sans)',
        }}>
          Join 2000+ students already learning.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link 
            href={process.env.NEXT_PUBLIC_GUMROAD_LIFETIME_URL || '#'} 
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'var(--color-primary)',
              color: 'white',
              padding: '13px 28px',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Get Lifetime Access
          </Link>
          <Link href="/courses" style={{
            background: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '13px 28px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
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
