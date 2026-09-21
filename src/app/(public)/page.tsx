import Navbar from '@/components/ui/Navbar'
import Hero from '@/components/sections/Hero'
import HowItWorks from '@/components/sections/HowItWorks'
import CoursesSection from '@/components/sections/CoursesSection'
import PricingTeaser from '@/components/sections/PricingTeaser'
import ReviewsCarousel from '@/components/sections/ReviewsCarousel'
import FAQ from '@/components/sections/FAQ'
import FinalCTA from '@/components/sections/FinalCTA'
import Footer from '@/components/sections/Footer'

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PandaCourses',
    url: 'https://pandacourses.com',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PandaCourses',
    url: 'https://pandacourses.com',
  },
]

export default function HomePage() {
  return (
    <main>
      {/* Structured Data: Organization and WebSite JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      {/* 1. Hero */}
      <Hero />

      {/* 2. Browse Our Courses */}
      <CoursesSection />

      {/* 3. How It Works */}
      <div id="how-it-works" className="defer-render">
        <HowItWorks />
      </div>

      {/* 4. PandaCourses vs. Others */}
      <section
        className="defer-render"
        style={{
          background: 'var(--color-surface)',
          padding: '80px 32px',
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--color-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '8px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              VS
            </p>
            <h2
              style={{
                fontSize: '36px',
                fontWeight: '600',
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 8px',
              }}
            >
              PandaCourses vs. Others
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--color-steel)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              See why students choose us
            </p>
          </div>

          <div
            className="comparison-table"
            style={{
              background: 'white',
              border: '1px solid var(--color-hairline)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            {/* Header Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                background: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-hairline)',
              }}
            >
              <div style={{ padding: '14px 20px' }}></div>
              <div
                style={{
                  padding: '14px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  textAlign: 'center',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                PandaCourses
              </div>
              <div
                style={{
                  padding: '14px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-ink-deep)',
                  textAlign: 'center',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Others
              </div>
            </div>

            {/* Feature Rows */}
            {[
              { label: 'Course Price', us: '$99 Lifetime', others: '$200+ each', usColor: 'var(--color-primary)' },
              { label: 'Lifetime Updates', us: '✓ Included', others: '✗ Extra Cost', usColor: '#27500A', otherColor: '#DC2626' },
              { label: 'Support', us: '✓ 24/7', others: '✗ Business Hours', usColor: '#27500A', otherColor: '#DC2626' },
              { label: 'Drive Access', us: '✓ Full Access', others: '✗ Limited', usColor: '#27500A', otherColor: '#DC2626' },
              { label: 'Money Back', us: '✓ 7 Days', others: '✗ No Refund', usColor: '#27500A', otherColor: '#DC2626' },
            ].map((row, i) => (
              <div
                key={row.label}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr',
                  borderBottom: i === 4 ? 'none' : '1px solid var(--color-hairline-soft)',
                  background: i % 2 === 0 ? 'white' : 'var(--color-surface-soft)',
                }}
              >
                <div
                  style={{
                    padding: '16px 20px',
                    fontSize: '14px',
                    color: 'var(--color-charcoal)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {row.label}
                </div>
                <div
                  style={{
                    padding: '16px 20px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: row.usColor,
                    textAlign: 'center',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {row.us}
                </div>
                <div
                  style={{
                    padding: '16px 20px',
                    fontSize: '14px',
                    color: row.otherColor || 'var(--color-slate)',
                    textAlign: 'center',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {row.others}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pricing Teaser (new) */}
      <div className="defer-render">
        <PricingTeaser />
      </div>

      {/* 6. Customer Reviews */}
      <div className="defer-render">
        <ReviewsCarousel />
      </div>

      {/* 7. FAQ (new) */}
      <div className="defer-render">
        <FAQ />
      </div>

      {/* 8. Final CTA band (new) */}
      <div className="defer-render">
        <FinalCTA />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}
