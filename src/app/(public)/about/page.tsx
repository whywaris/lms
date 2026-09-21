import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { PRICE_USD as CONFIG_PRICE_USD, LIFETIME_FEATURES } from '@/lib/siteConfig'

/* ═══════════════════════════════════════════════════
   CONSTANTS (Editable)
   ═══════════════════════════════════════════════════ */
const BUSINESS_NAME = 'PandaCourses'
const SUPPORT_EMAIL = 'support@pandacourses.com'
const WHATSAPP_URL = '' // if empty, reuses exact WhatsApp URL used on course pages
const FOUNDED_YEAR = '' // e.g. '2026'; if empty, never mention a founding year
const STORY: string[] = [
  'PandaCourses is an online library of premium courses from top mentors, available with a single one-time payment.',
  'Instead of buying courses one by one, members get lifetime access to the whole library, including new courses as they are added.',
]
const EXTRA_STATS: { value: string; label: string }[] = [] // only add stats I can prove; shown after the live stats
const TEAM: { name: string; role: string; bio?: string; photoUrl?: string }[] = [] // real people only; if empty, hide the whole team section
const SOCIALS: { label: string; url: string }[] = [] // used for sameAs and the contact block; if empty, hide
const SHOW_MEMBER_COUNT = false

const PRICE_USD = CONFIG_PRICE_USD || 99
const DEFAULT_WHATSAPP_URL = 'https://wa.me/447729314114?text=Hello!%20I%20have%20a%20Question.'
const FINAL_WHATSAPP_URL = WHATSAPP_URL || DEFAULT_WHATSAPP_URL

/* ═══════════════════════════════════════════════════
   SUPABASE ANON CLIENT (Cookie-free, Edge-compatible)
   ═══════════════════════════════════════════════════ */
function getAnonClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}

/* ═══════════════════════════════════════════════════
   METADATA
   ═══════════════════════════════════════════════════ */
export async function generateMetadata(): Promise<Metadata> {
  const supabase = getAnonClient()
  let count = 0
  try {
    const { count: c } = await supabase
      .from('public_courses')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)
    count = c || 0
  } catch {}

  const title = 'About PandaCourses | One Price. Every Course.'
  const description = `PandaCourses gives you lifetime access to ${count}+ premium courses from top mentors with one payment.`

  return {
    title,
    description,
    alternates: {
      canonical: 'https://pandacourses.com/about',
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: 'https://pandacourses.com/about',
      siteName: BUSINESS_NAME,
      type: 'website',
    },
  }
}

/* ═══════════════════════════════════════════════════
   ABOUT PAGE (Server Component)
   ═══════════════════════════════════════════════════ */
export default async function AboutPage() {
  const supabase = getAnonClient()

  // Run independent queries concurrently with Promise.all and try/catch
  const countPromise = (async () => {
    try {
      const { count } = await supabase
        .from('public_courses')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)
      return count || 0
    } catch {
      return 0
    }
  })()

  const categoriesPromise = (async () => {
    try {
      const { data } = await supabase
        .from('public_courses')
        .select('category')
        .eq('is_published', true)
      if (!data) return []
      const counts: Record<string, number> = {}
      for (const row of data) {
        const cat = (row.category || '').trim()
        if (cat) {
          counts[cat] = (counts[cat] || 0) + 1
        }
      }
      return Object.entries(counts)
        .map(([category, n]) => ({ category, n }))
        .sort((a, b) => b.n - a.n)
    } catch {
      return []
    }
  })()

  const collagePromise = (async () => {
    try {
      const { data } = await supabase
        .from('public_courses')
        .select('id, course_name, slug, image_url')
        .eq('is_published', true)
        .eq('show_in_hero', true)
        .not('image_url', 'is', null)
        .limit(10)
      if (!data || data.length === 0) return []
      // Server-side Fisher-Yates shuffle
      const shuffled = [...data]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled.slice(0, 3)
    } catch {
      return []
    }
  })()

  const memberCountPromise = (async () => {
    if (!SHOW_MEMBER_COUNT) return null
    try {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      return count || null
    } catch {
      return null
    }
  })()

  const [count, categories, collage, memberCount] = await Promise.all([
    countPromise,
    categoriesPromise,
    collagePromise,
    memberCountPromise,
  ])

  const categoryCount = categories.length

  // JSON-LD AboutPage & Organization
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About PandaCourses',
    url: 'https://pandacourses.com/about',
    mainEntity: {
      '@type': 'Organization',
      name: BUSINESS_NAME,
      url: 'https://pandacourses.com',
      email: SUPPORT_EMAIL,
      ...(SOCIALS.length > 0 ? { sameAs: SOCIALS.map((s) => s.url) } : {}),
    },
  }

  // Benefit claims
  const defaultBenefits = [
    'One clear price - pay once, no subscriptions',
    'Instant dashboard access after payment',
    'Course files via Mega / Google Drive',
    'New courses included',
    'Request courses',
    'Support when you need it',
  ]
  const benefits =
    LIFETIME_FEATURES && LIFETIME_FEATURES.length > 0
      ? LIFETIME_FEATURES.slice(0, 6)
      : defaultBenefits

  return (
    <main style={{ background: 'var(--color-canvas, #FFFFFF)', minHeight: '100vh' }}>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <style>{`
        .about-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .about-two-col {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 56px;
          align-items: center;
        }
        .about-how-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .about-category-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .about-benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .about-contact-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 48px;
          align-items: start;
        }
        .about-cat-card {
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .about-cat-card:hover {
          transform: translateY(-2px);
          border-color: var(--color-primary, #6B4EFF) !important;
          box-shadow: 0 8px 20px rgba(107, 78, 255, 0.08);
        }
        .about-btn:focus-visible,
        .about-cat-card:focus-visible,
        a:focus-visible {
          outline: 2px solid var(--color-primary, #6B4EFF);
          outline-offset: 2px;
        }
        @media (max-width: 1023px) {
          .about-two-col {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .about-category-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .about-benefits-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .about-contact-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
        @media (max-width: 768px) {
          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          .about-how-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .about-category-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .about-benefits-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 420px) {
          .about-category-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════
          1. HERO (Dark navy band, compact ~360px)
          ═══════════════════════════════════════════════════ */}
      <section
        style={{
          background:
            'radial-gradient(circle at 80% 20%, rgba(107, 78, 255, 0.22) 0%, transparent 60%), radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), var(--color-brand-navy, #1A1A2E)',
          backgroundSize: '100% 100%, 24px 24px, 100% 100%',
          padding: '72px 24px 96px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#C4B5FD',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 12px',
            }}
          >
            ABOUT PANDACOURSES
          </p>

          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 600,
              color: 'var(--color-on-dark, #FFFFFF)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 16px',
              letterSpacing: '-0.6px',
              lineHeight: 1.15,
            }}
          >
            Premium courses.{' '}
            <span style={{ color: 'var(--color-primary, #6B4EFF)' }}>One simple price.</span>
          </h1>

          <p
            style={{
              fontSize: '16px',
              color: 'var(--color-on-dark-muted, rgba(255, 255, 255, 0.75))',
              fontFamily: 'var(--font-sans)',
              maxWidth: '640px',
              margin: '0 auto 32px',
              lineHeight: 1.6,
            }}
          >
            Lifetime access to {count}+ courses from top mentors across {categoryCount} categories,
            with a single one-time payment.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/pricing"
              className="about-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '46px',
                padding: '12px 30px',
                background: 'var(--color-primary, #6B4EFF)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-md, 8px)',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                boxShadow: '0 4px 18px rgba(107, 78, 255, 0.4)',
                transition: 'opacity 0.15s ease',
              }}
            >
              Get Lifetime Access – ${PRICE_USD}
            </Link>

            <Link
              href="/courses"
              prefetch={false}
              className="about-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '46px',
                padding: '12px 28px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 'var(--radius-md, 8px)',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                transition: 'background 0.15s ease',
              }}
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          2. LIVE STATS STRIP (Overlaps hero bottom edge)
          ═══════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: '1120px',
          width: '100%',
          margin: '-44px auto 0',
          padding: '0 24px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--color-hairline, #E8E8E5)',
            borderRadius: '12px',
            padding: '28px 32px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div className="about-stats-grid">
            <div>
              <div
                style={{
                  fontSize: 'clamp(28px, 4vw, 36px)',
                  fontWeight: 700,
                  color: 'var(--color-ink-deep, #0F0F0F)',
                  fontFamily: 'var(--font-sans)',
                  lineHeight: 1.1,
                }}
              >
                {count}+
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-slate, #5A5A5A)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginTop: '6px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Courses
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 'clamp(28px, 4vw, 36px)',
                  fontWeight: 700,
                  color: 'var(--color-ink-deep, #0F0F0F)',
                  fontFamily: 'var(--font-sans)',
                  lineHeight: 1.1,
                }}
              >
                {categoryCount}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-slate, #5A5A5A)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginTop: '6px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Categories
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 'clamp(28px, 4vw, 36px)',
                  fontWeight: 700,
                  color: 'var(--color-ink-deep, #0F0F0F)',
                  fontFamily: 'var(--font-sans)',
                  lineHeight: 1.1,
                }}
              >
                ${PRICE_USD}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-slate, #5A5A5A)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginTop: '6px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                One-time payment
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 'clamp(28px, 4vw, 36px)',
                  fontWeight: 700,
                  color: 'var(--color-primary, #6B4EFF)',
                  fontFamily: 'var(--font-sans)',
                  lineHeight: 1.1,
                }}
              >
                Instant
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-slate, #5A5A5A)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginTop: '6px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Dashboard access
              </div>
            </div>

            {SHOW_MEMBER_COUNT && memberCount !== null && (
              <div>
                <div
                  style={{
                    fontSize: 'clamp(28px, 4vw, 36px)',
                    fontWeight: 700,
                    color: 'var(--color-ink-deep, #0F0F0F)',
                    fontFamily: 'var(--font-sans)',
                    lineHeight: 1.1,
                  }}
                >
                  {memberCount}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-slate, #5A5A5A)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginTop: '6px',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  Members
                </div>
              </div>
            )}

            {EXTRA_STATS.map((st, idx) => (
              <div key={idx}>
                <div
                  style={{
                    fontSize: 'clamp(28px, 4vw, 36px)',
                    fontWeight: 700,
                    color: 'var(--color-ink-deep, #0F0F0F)',
                    fontFamily: 'var(--font-sans)',
                    lineHeight: 1.1,
                  }}
                >
                  {st.value}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-slate, #5A5A5A)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginTop: '6px',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. WHAT WE DO (Two columns, light background)
          ═══════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '88px 24px',
        }}
      >
        <div className="about-two-col">
          <div>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-primary, #6B4EFF)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 8px',
              }}
            >
              {FOUNDED_YEAR ? `SINCE ${FOUNDED_YEAR}` : 'OUR STORY'}
            </p>

            <h2
              style={{
                fontSize: 'clamp(26px, 3.5vw, 34px)',
                fontWeight: 600,
                color: 'var(--color-ink-deep, #0F0F0F)',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.4px',
                margin: '0 0 20px',
                lineHeight: 1.25,
              }}
            >
              Everything in one library
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
              {STORY.map((p, idx) => (
                <p
                  key={idx}
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.75',
                    color: 'var(--color-charcoal, #2F2F2F)',
                    fontFamily: 'var(--font-sans)',
                    margin: 0,
                  }}
                >
                  {p}
                </p>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['Lifetime access', 'Instant dashboard access', 'New courses included'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'var(--color-tint-lavender, #F3F0FF)',
                    color: 'var(--color-primary, #6B4EFF)',
                    borderRadius: 'var(--radius-full, 9999px)',
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M13.485 3.515a1.2 1.2 0 0 1 0 1.697L6.7 11.9a1.2 1.2 0 0 1-1.697 0L2.515 9.414a1.2 1.2 0 1 1 1.697-1.697l1.646 1.646 5.93-5.848a1.2 1.2 0 0 1 1.697 0z" />
                  </svg>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Collage (Shown only if >= 2 thumbnails) */}
          {collage.length >= 2 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                position: 'relative',
              }}
            >
              {collage.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'var(--color-surface, #F7F7F5)',
                    border: '1px solid var(--color-hairline, #E8E8E5)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                    transform: idx === 1 ? 'translateX(16px)' : 'none',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      aspectRatio: '16 / 10',
                      width: '100%',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={item.image_url!}
                      alt={item.course_name}
                      loading="lazy"
                      decoding="async"
                      width={480}
                      height={300}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center 40%',
                        transform: 'scale(1.12)',
                        transformOrigin: 'center 45%',
                        display: 'block',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. HOW IT WORKS (3 cards, inline SVG icons)
          ═══════════════════════════════════════════════════ */}
      <section
        className="defer-render"
        style={{
          background: 'var(--color-surface, #F7F7F5)',
          padding: '80px 24px',
          borderTop: '1px solid var(--color-hairline, #E8E8E5)',
          borderBottom: '1px solid var(--color-hairline, #E8E8E5)',
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-primary, #6B4EFF)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 8px',
              }}
            >
              HOW IT WORKS
            </p>
            <h2
              style={{
                fontSize: 'clamp(26px, 3.5vw, 34px)',
                fontWeight: 600,
                color: 'var(--color-ink-deep, #0F0F0F)',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.4px',
                margin: 0,
              }}
            >
              Three simple steps to start learning
            </h2>
          </div>

          <div className="about-how-grid">
            {/* Step 1 */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--color-hairline, #E8E8E5)',
                borderRadius: '12px',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'var(--color-tint-lavender, #F3F0FF)',
                  color: 'var(--color-primary, #6B4EFF)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--color-ink-deep, #0F0F0F)',
                  fontFamily: 'var(--font-sans)',
                  margin: 0,
                }}
              >
                1. Choose Lifetime Access
              </h3>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--color-slate, #5A5A5A)',
                  fontFamily: 'var(--font-sans)',
                  lineHeight: '1.6',
                  margin: 0,
                }}
              >
                One payment of ${PRICE_USD} unlocks the whole library.
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--color-hairline, #E8E8E5)',
                borderRadius: '12px',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'var(--color-tint-lavender, #F3F0FF)',
                  color: 'var(--color-primary, #6B4EFF)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--color-ink-deep, #0F0F0F)',
                  fontFamily: 'var(--font-sans)',
                  margin: 0,
                }}
              >
                2. Sign in to your dashboard
              </h3>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--color-slate, #5A5A5A)',
                  fontFamily: 'var(--font-sans)',
                  lineHeight: '1.6',
                  margin: 0,
                }}
              >
                Your account unlocks right after payment.
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--color-hairline, #E8E8E5)',
                borderRadius: '12px',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'var(--color-tint-lavender, #F3F0FF)',
                  color: 'var(--color-primary, #6B4EFF)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--color-ink-deep, #0F0F0F)',
                  fontFamily: 'var(--font-sans)',
                  margin: 0,
                }}
              >
                3. Start learning
              </h3>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--color-slate, #5A5A5A)',
                  fontFamily: 'var(--font-sans)',
                  lineHeight: '1.6',
                  margin: 0,
                }}
              >
                Open any course and use the Mega / Google Drive links inside.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link
              href="/how-to-buy"
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--color-primary, #6B4EFF)',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              See the full guide →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          5. BROWSE BY CATEGORY
          ═══════════════════════════════════════════════════ */}
      <section
        className="defer-render"
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '88px 24px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <h2
            style={{
              fontSize: 'clamp(26px, 3.5vw, 34px)',
              fontWeight: 600,
              color: 'var(--color-ink-deep, #0F0F0F)',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '-0.4px',
              margin: '0 0 8px',
            }}
          >
            Explore the library
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--color-slate, #5A5A5A)',
              fontFamily: 'var(--font-sans)',
              margin: 0,
            }}
          >
            {count}+ courses across {categoryCount} categories.
          </p>
        </div>

        <div className="about-category-grid">
          {categories.map(({ category, n }) => (
            <Link
              key={category}
              href={`/courses?category=${encodeURIComponent(category)}`}
              prefetch={false}
              className="about-cat-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                background: '#FFFFFF',
                border: '1px solid var(--color-hairline, #E8E8E5)',
                borderRadius: '12px',
                textDecoration: 'none',
                color: 'inherit',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-ink-deep, #0F0F0F)',
                    marginBottom: '2px',
                  }}
                >
                  {category}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-slate, #5A5A5A)',
                  }}
                >
                  {n} {n === 1 ? 'course' : 'courses'}
                </div>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-steel, #8A8A8A)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          6. WHY MEMBERS CHOOSE US (6 Benefit cards)
          ═══════════════════════════════════════════════════ */}
      <section
        className="defer-render"
        style={{
          background: 'var(--color-surface, #F7F7F5)',
          padding: '88px 24px',
          borderTop: '1px solid var(--color-hairline, #E8E8E5)',
          borderBottom: '1px solid var(--color-hairline, #E8E8E5)',
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-primary, #6B4EFF)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 8px',
              }}
            >
              BENEFITS
            </p>
            <h2
              style={{
                fontSize: 'clamp(26px, 3.5vw, 34px)',
                fontWeight: 600,
                color: 'var(--color-ink-deep, #0F0F0F)',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.4px',
                margin: 0,
              }}
            >
              Why members choose PandaCourses
            </h2>
          </div>

          <div className="about-benefits-grid">
            {benefits.map((claim, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--color-hairline, #E8E8E5)',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--color-tint-lavender, #F3F0FF)',
                    color: 'var(--color-primary, #6B4EFF)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: 500,
                    color: 'var(--color-ink-deep, #0F0F0F)',
                    fontFamily: 'var(--font-sans)',
                    lineHeight: '1.5',
                    margin: 0,
                  }}
                >
                  {claim}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          7. TEAM (Render only if TEAM.length > 0)
          ═══════════════════════════════════════════════════ */}
      {TEAM.length > 0 && (
        <section
          className="defer-render"
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '88px 24px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2
              style={{
                fontSize: 'clamp(26px, 3.5vw, 34px)',
                fontWeight: 600,
                color: 'var(--color-ink-deep, #0F0F0F)',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.4px',
                margin: 0,
              }}
            >
              The people behind PandaCourses
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            {TEAM.map((m, idx) => {
              const initials = m.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()

              return (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid var(--color-hairline, #E8E8E5)',
                    borderRadius: '12px',
                    padding: '28px 24px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {m.photoUrl ? (
                    <img
                      src={m.photoUrl}
                      alt={m.name}
                      loading="lazy"
                      decoding="async"
                      width={96}
                      height={96}
                      style={{
                        width: '96px',
                        height: '96px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginBottom: '16px',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '96px',
                        height: '96px',
                        borderRadius: '50%',
                        background: 'var(--color-tint-lavender, #F3F0FF)',
                        color: 'var(--color-primary, #6B4EFF)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-sans)',
                        marginBottom: '16px',
                      }}
                    >
                      {initials}
                    </div>
                  )}
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: 'var(--color-ink-deep, #0F0F0F)',
                      fontFamily: 'var(--font-sans)',
                      margin: '0 0 4px',
                    }}
                  >
                    {m.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-primary, #6B4EFF)',
                      fontWeight: 500,
                      fontFamily: 'var(--font-sans)',
                      margin: '0 0 8px',
                    }}
                  >
                    {m.role}
                  </p>
                  {m.bio && (
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'var(--color-slate, #5A5A5A)',
                        fontFamily: 'var(--font-sans)',
                        lineHeight: '1.5',
                        margin: 0,
                      }}
                    >
                      {m.bio}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          8. CONTACT AND TRUST (Two columns)
          ═══════════════════════════════════════════════════ */}
      <section
        className="defer-render"
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '88px 24px',
        }}
      >
        <div className="about-contact-grid">
          <div>
            <h2
              style={{
                fontSize: 'clamp(24px, 3vw, 30px)',
                fontWeight: 600,
                color: 'var(--color-ink-deep, #0F0F0F)',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.3px',
                margin: '0 0 12px',
              }}
            >
              Questions before you buy? We&apos;re happy to help.
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: 'var(--color-slate, #5A5A5A)',
                fontFamily: 'var(--font-sans)',
                lineHeight: '1.6',
                margin: '0 0 28px',
              }}
            >
              Have a question about course access, links or formats? Reach out to our team directly.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--color-primary, #6B4EFF)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {SUPPORT_EMAIL}
              </a>

              <a
                href={FINAL_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#16A34A',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
                Chat on WhatsApp
              </a>

              {SOCIALS.length > 0 && (
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                  {SOCIALS.map((soc, idx) => (
                    <a
                      key={idx}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '14px',
                        color: 'var(--color-slate, #5A5A5A)',
                        textDecoration: 'underline',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {soc.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Trust Links Card */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--color-hairline, #E8E8E5)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-steel, #8A8A8A)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 14px',
              }}
            >
              Legal &amp; Trust
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Refund Policy', href: '/refund-policy' },
                { label: 'Contact', href: '/contact' },
              ].map((lnk) => (
                <Link
                  key={lnk.href}
                  href={lnk.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'var(--color-ink-deep, #0F0F0F)',
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'var(--font-sans)',
                    background: 'var(--color-surface, #F7F7F5)',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <span>{lnk.label}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-steel, #8A8A8A)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          9. FINAL CTA BAND (Dark navy with subtle purple gradient)
          ═══════════════════════════════════════════════════ */}
      <section
        className="defer-render"
        style={{
          maxWidth: '1120px',
          margin: '0 auto 80px',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, var(--color-brand-navy, #1A1A2E) 0%, #251D4A 100%)',
            borderRadius: '16px',
            padding: '56px 24px',
            textAlign: 'center',
            color: '#FFFFFF',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(26px, 4vw, 36px)',
              fontWeight: 600,
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '-0.4px',
              margin: '0 0 10px',
            }}
          >
            Ready to get lifetime access?
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--color-on-dark-muted, rgba(255, 255, 255, 0.75))',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 28px',
            }}
          >
            One payment. Every course. New courses included.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Link
              href="/pricing"
              className="about-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '46px',
                padding: '14px 34px',
                background: 'var(--color-primary, #6B4EFF)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-md, 8px)',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                boxShadow: '0 4px 18px rgba(107, 78, 255, 0.4)',
                transition: 'opacity 0.15s ease',
              }}
            >
              Get Lifetime Access – ${PRICE_USD}
            </Link>
            <Link
              href="/courses"
              prefetch={false}
              style={{
                fontSize: '13px',
                color: 'var(--color-on-dark-muted, rgba(255, 255, 255, 0.7))',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              or browse courses first
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
