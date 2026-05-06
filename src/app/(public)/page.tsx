import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import HowItWorks from '@/components/sections/HowItWorks'
import Features from '@/components/sections/Features'
import CoursesSection from '@/components/sections/CoursesSection'
import Footer from '@/components/sections/Footer'
import Testimonials from '@/components/sections/Testimonials'

export default function HomePage() {
  return (
    <main>
      <Navbar />

      {/* SECTION 1 — Hero */}
      <section style={{
        background: 'var(--color-brand-navy)',
        padding: '80px 32px',
        overflow: 'hidden',
        position: 'relative',
      }}>

        {/* Background Glow */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '0',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(107,78,255,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          right: '200px',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(107,78,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="hero-grid" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '64px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}>

          {/* Left Side */}
          <div>
            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(107,78,255,0.15)',
              border: '1px solid rgba(107,78,255,0.4)',
              color: '#A78BFA',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              fontWeight: '500',
              marginBottom: '24px',
            }}>
              <span>⭐</span>
              <span>2000+ Premium Courses For Low Price</span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(36px, 4.5vw, 58px)',
              fontWeight: '700',
              color: 'white',
              lineHeight: '1.08',
              letterSpacing: '-2px',
              margin: '0 0 20px',
              fontFamily: 'var(--font-sans)',
            }}>
              Learn from the{' '}
              <span style={{
                background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Best Mentors
              </span>{' '}
              With Affordable Prices
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '17px',
              color: 'var(--color-on-dark-muted)',
              lineHeight: '1.7',
              margin: '0 0 28px',
              fontFamily: 'var(--font-sans)',
              maxWidth: '480px',
            }}>
              Invest in Learning 🧠 — it always gives the highest returns.
            </p>

            {/* Trust Badges */}
            <div style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              marginBottom: '32px',
            }}>
              {[
                '✓ Trusted by 2000+ learners',
                '✓ 4.9★ Average Rating',
                '✓ Lifetime Access Available',
              ].map((badge) => (
                <div key={badge} style={{
                  fontSize: '13px',
                  color: 'var(--color-on-dark-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-sans)',
                }}>
                  <span style={{ color: '#10B981', fontWeight: '600' }}>
                    {badge.split(' ')[0]}
                  </span>
                  {badge.split(' ').slice(1).join(' ')}
                </div>
              ))}
            </div>

            {/* Student Avatars + Count */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '32px',
            }}>
              <div style={{ display: 'flex' }}>
                {[
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Student"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      border: '2px solid var(--color-brand-navy)',
                      marginLeft: i === 0 ? '0' : '-10px',
                      objectFit: 'cover',
                    }}
                  />
                ))}
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'white',
                  fontFamily: 'var(--font-sans)',
                }}>
                  2000+ Students
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--color-on-dark-muted)',
                  fontFamily: 'var(--font-sans)',
                }}>
                  already learning
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/courses" style={{
                background: 'var(--color-primary)',
                color: 'white',
                padding: '13px 28px',
                borderRadius: 'var(--radius-md)',
                fontSize: '15px',
                fontWeight: '500',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                Explore All Courses →
              </Link>
              <Link href="/how-to-buy" style={{
                background: 'white',
                color: 'var(--color-ink-deep)',
                padding: '13px 28px',
                borderRadius: 'var(--radius-md)',
                fontSize: '15px',
                fontWeight: '500',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                How to Buy
              </Link>
            </div>
          </div>

          {/* Right Side — Framed Image */}
          <div className="hero-image" style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '44px 36px',
          }}>

            {/* Frame wrapper — cards are relative to this */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '440px',
            }}>

              {/* Ambient purple glow behind frame */}
              <div style={{
                position: 'absolute',
                inset: '-44px',
                background: 'radial-gradient(ellipse 85% 70% at 50% 58%, rgba(107,78,255,0.28) 0%, rgba(124,58,237,0.1) 38%, transparent 68%)',
                filter: 'blur(36px)',
                borderRadius: '50%',
                zIndex: 0,
                pointerEvents: 'none',
              }} />

              {/* Floating Card — Top Left */}
              <div style={{
                position: 'absolute',
                top: '14px',
                left: '-28px',
                background: 'rgba(8,6,20,0.88)',
                backdropFilter: 'blur(18px)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: '16px',
                padding: '14px 20px',
                zIndex: 4,
              }}>
                <p style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: 'white',
                  margin: '0 0 4px',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '-0.5px',
                  lineHeight: 1,
                }}>2000+</p>
                <p style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.42)',
                  margin: '0',
                  fontFamily: 'var(--font-sans)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.09em',
                }}>Premium Courses</p>
              </div>

              {/* Floating Card — Bottom Right */}
              <div style={{
                position: 'absolute',
                bottom: '54px',
                right: '-28px',
                background: 'rgba(8,6,20,0.88)',
                backdropFilter: 'blur(18px)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: '16px',
                padding: '14px 20px',
                zIndex: 4,
              }}>
                <p style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#64dc96',
                  margin: '0 0 4px',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '-0.5px',
                  lineHeight: 1,
                }}>$99</p>
                <p style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.42)',
                  margin: '0',
                  fontFamily: 'var(--font-sans)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.09em',
                }}>Lifetime Access</p>
              </div>

              {/* Gradient-border frame */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                borderRadius: '24px',
                padding: '1.5px',
                background: 'linear-gradient(148deg, rgba(124,58,237,0.72) 0%, rgba(168,85,247,0.28) 48%, rgba(255,255,255,0.06) 100%)',
              }}>
                <div style={{
                  borderRadius: '22.5px',
                  overflow: 'hidden',
                  background: '#0d0b1a',
                  position: 'relative',
                }}>
                  {/* Student image */}
                  <img
                    src="https://pub-e028033287554cb7a1aa9e5cd747f106.r2.dev/hero%20image.png.webp"
                    alt="Student"
                    style={{
                      width: '100%',
                      maxHeight: '560px',
                      objectFit: 'contain',
                      objectPosition: 'bottom center',
                      display: 'block',
                    }}
                  />
                  {/* Bottom fade — blends student into frame */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '36%',
                    background: 'linear-gradient(to top, #0d0b1a 0%, transparent 100%)',
                    pointerEvents: 'none',
                  }} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>



      {/* SECTION 5 — Courses Grid */}
      <CoursesSection />

      {/* SECTION 3 — How It Works */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* SECTION 6 — Comparison Table */}
      <section style={{
        background: 'var(--color-surface)',
        padding: '80px 32px',
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '8px',
              fontFamily: 'var(--font-sans)',
            }}>VS</p>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '600',
              color: 'var(--color-ink-deep)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 8px',
            }}>PandaCourses vs. Others</h2>
            <p style={{
              fontSize: '16px',
              color: 'var(--color-steel)',
              fontFamily: 'var(--font-sans)',
            }}>See why students choose us</p>
          </div>

          <div className="comparison-table" style={{
            background: 'white',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}>
            {/* Header Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              background: 'var(--color-surface)',
              borderBottom: '1px solid var(--color-hairline)',
            }}>
              <div style={{ padding: '14px 20px' }}></div>
              <div style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>PandaCourses</div>
              <div style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink-deep)', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>Others</div>
            </div>

            {/* Feature Rows */}
            {[
              { label: 'Course Price', us: '$99 Lifetime', others: '$200+ each', usColor: 'var(--color-primary)' },
              { label: 'Lifetime Updates', us: '✓ Included', others: '✗ Extra Cost', usColor: '#27500A', otherColor: '#DC2626' },
              { label: 'Support', us: '✓ 24/7', others: '✗ Business Hours', usColor: '#27500A', otherColor: '#DC2626' },
              { label: 'Drive Access', us: '✓ Full Access', others: '✗ Limited', usColor: '#27500A', otherColor: '#DC2626' },
              { label: 'Money Back', us: '✓ 7 Days', others: '✗ No Refund', usColor: '#27500A', otherColor: '#DC2626' },
            ].map((row, i) => (
              <div key={row.label} style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                borderBottom: i === 4 ? 'none' : '1px solid var(--color-hairline-soft)',
                background: i % 2 === 0 ? 'white' : 'var(--color-surface-soft)',
              }}>
                <div style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--color-charcoal)', fontFamily: 'var(--font-sans)' }}>{row.label}</div>
                <div style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 500, color: row.usColor, textAlign: 'center', fontFamily: 'var(--font-sans)' }}>{row.us}</div>
                <div style={{ padding: '16px 20px', fontSize: '14px', color: row.otherColor || 'var(--color-slate)', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>{row.others}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — Features */}
      <Features />

      {/* SECTION 7 — Reviews */}
      <Testimonials />


      <Footer />
    </main>
  )
}
