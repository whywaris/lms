import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

interface Props {
  params: Promise<{ keyword: string }>
}

// Static params generate karo — SEO ke liye
export async function generateStaticParams() {
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabase.from('landing_pages').select('keyword')
  return (data || []).map((row) => ({ keyword: row.keyword }))
}

// Dynamic metadata — title + meta description per keyword
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { keyword } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('landing_pages')
    .select('title, meta_description')
    .eq('keyword', keyword)
    .single()

  if (!data) return {}

  return {
    title: data.title,
    description: data.meta_description,
    openGraph: {
      title: data.title,
      description: data.meta_description,
    },
  }
}

// FAQ — unique per page type (can be extended later)
const FAQS = [
  { q: 'What courses are included in the membership?', a: 'You get access to our full library — programming, marketing, AI, e-commerce, freelancing, and more. New courses are added regularly.' },
  { q: 'What is the difference between Monthly and Lifetime access?', a: 'Monthly gives you full access as long as your plan is active. Lifetime is a one-time payment — you own access forever, including all future courses added.' },
  { q: 'Can I access courses on mobile?', a: 'Yes. The platform is fully mobile responsive. Learn from any device, anytime.' },
  { q: 'Is there a refund policy?', a: 'Yes. We offer a refund within 7 days if you are not satisfied with your purchase.' },
]

export default async function KeywordLandingPage({ params }: Props) {
  const { keyword } = await params
  const supabase = await createClient()

  // Fetch landing page data
  const { data: page } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('keyword', keyword)
    .single()

  if (!page) notFound()

  // Fetch published courses — shuffled via random()
  const { data: courses } = await supabase
    .from('public_courses')
    .select('id, course_name, mentor, image_url, price, slug, category')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(12)

  // Shuffle courses client-side via sort random
  const shuffled = (courses || []).sort(() => Math.random() - 0.5)

  return (
    <>
      <main style={{ fontFamily: 'var(--font-sans, system-ui)', color: 'var(--color-ink, #1a1a1a)' }}>

        {/* Hero Section */}
        <section style={{
          background: '#0f0f0f',
          color: '#fff',
          padding: '80px 24px',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <span style={{
              display: 'inline-block',
              background: '#f97316',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              padding: '4px 14px',
              borderRadius: '99px',
              marginBottom: '24px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Premium Courses
            </span>
            <h1 style={{
              fontSize: 'clamp(28px, 5vw, 52px)',
              fontWeight: 700,
              lineHeight: 1.15,
              margin: '0 0 20px',
              letterSpacing: '-0.5px',
            }}>
              {page.heading}
            </h1>
            <p style={{
              fontSize: '18px',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.6,
              margin: '0 0 36px',
              maxWidth: '560px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              {page.meta_description}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="#courses" style={{
                background: '#f97316',
                color: '#fff',
                padding: '14px 28px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
              }}>
                Browse Courses
              </Link>
              <Link href="/pricing" style={{
                background: 'transparent',
                color: '#fff',
                padding: '14px 28px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 500,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.25)',
              }}>
                Get Membership
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section style={{
          borderBottom: '1px solid var(--color-hairline, #e5e5e5)',
          padding: '24px',
        }}>
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap',
          }}>
            {[
              { icon: '🎓', label: '500+ Students' },
              { icon: '📚', label: '2,000+ Courses' },
              { icon: '♾️', label: 'Lifetime Access' },
              { icon: '🌍', label: 'Worldwide Access' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-slate, #555)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Courses Grid */}
        <section id="courses" style={{ padding: '64px 24px', maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-steel, #888)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
            Course Library
          </p>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, margin: '0 0 32px', letterSpacing: '-0.3px' }}>
            Explore Premium Courses
          </h2>

          {shuffled.length === 0 ? (
            <p style={{ color: 'var(--color-slate, #888)', fontSize: '15px' }}>Courses coming soon. Check back shortly.</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}>
              {shuffled.map((course) => (
                <Link
                  key={course.id}
                  href={`/course/${course.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{
                    background: 'var(--color-canvas, #fff)',
                    border: '1px solid var(--color-hairline, #e5e5e5)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s',
                  }}>
                    {course.image_url ? (
                      <img
                        src={course.image_url}
                        alt={course.course_name}
                        style={{ width: '100%', height: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        aspectRatio: '1/1',
                        background: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        color: '#aaa',
                      }}>
                        No Image
                      </div>
                    )}
                    <div style={{ padding: '14px' }}>
                      {course.category && (
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#f97316',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          display: 'block',
                          marginBottom: '6px',
                        }}>
                          {course.category}
                        </span>
                      )}
                      <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px', lineHeight: 1.4 }}>
                        {course.course_name}
                      </p>
                      {course.mentor && (
                        <p style={{ fontSize: '12px', color: 'var(--color-steel, #888)', margin: '0 0 10px' }}>
                          {course.mentor}
                        </p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
<span style={{
                          fontSize: '12px',
                          background: '#0f0f0f',
                          color: '#fff',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontWeight: 500,
                        }}>
                          View
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <Link href="/courses" style={{
              display: 'inline-block',
              border: '1px solid #1a1a1a',
              color: '#1a1a1a',
              padding: '12px 28px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
            }}>
              View All Courses →
            </Link>
          </div>
        </section>

        {/* Membership Section */}
        <section style={{
          background: '#f9f9f9',
          padding: '64px 24px',
          borderTop: '1px solid var(--color-hairline, #e5e5e5)',
          borderBottom: '1px solid var(--color-hairline, #e5e5e5)',
        }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-steel, #888)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
              Membership
            </p>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, margin: '0 0 12px', letterSpacing: '-0.3px' }}>
              Unlock Everything. Learn Anything.
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--color-slate, #666)', margin: '0 0 40px', lineHeight: 1.6 }}>
              One membership. Full access to every course — past, present, and future.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              textAlign: 'left',
            }}>
              {/* Monthly Plan */}
              <div style={{
                background: '#fff',
                border: '1px solid var(--color-hairline, #e5e5e5)',
                borderRadius: '12px',
                padding: '28px',
              }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>Monthly</p>
                <p style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 4px' }}>$30<span style={{ fontSize: '16px', fontWeight: 400, color: '#888' }}>/mo</span></p>
                <p style={{ fontSize: '14px', color: '#888', margin: '0 0 20px' }}>Cancel anytime</p>
                {['Full course library access', 'New courses every month', 'Mobile & desktop access'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ color: '#22c55e', fontSize: '16px' }}>✓</span>
                    <span style={{ fontSize: '14px', color: '#444' }}>{f}</span>
                  </div>
                ))}
                <Link href="/pricing" style={{
                  display: 'block',
                  textAlign: 'center',
                  marginTop: '24px',
                  border: '1px solid #1a1a1a',
                  color: '#1a1a1a',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}>
                  Get Started
                </Link>
              </div>

              {/* Lifetime Plan */}
              <div style={{
                background: '#0f0f0f',
                border: '2px solid #f97316',
                borderRadius: '12px',
                padding: '28px',
                color: '#fff',
                position: 'relative',
              }}>
                <span style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#f97316',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 14px',
                  borderRadius: '99px',
                  whiteSpace: 'nowrap',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Best Value
                </span>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>Lifetime</p>
                <p style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 4px' }}>$99<span style={{ fontSize: '16px', fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}> one-time</span></p>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: '0 0 20px' }}>Pay once, learn forever</p>
                {['Everything in Monthly', 'All future courses free', 'Priority support', 'Lifetime updates'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ color: '#f97316', fontSize: '16px' }}>✓</span>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>{f}</span>
                  </div>
                ))}
                <Link href="/pricing" style={{
                  display: 'block',
                  textAlign: 'center',
                  marginTop: '24px',
                  background: '#f97316',
                  color: '#fff',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}>
                  Get Lifetime Access
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{
          padding: '64px 24px',
          background: '#f9f9f9',
          borderTop: '1px solid var(--color-hairline, #e5e5e5)',
        }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-steel, #888)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
              FAQ
            </p>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, margin: '0 0 32px', letterSpacing: '-0.3px' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {FAQS.map((faq) => (
                <div key={faq.q} style={{
                  background: '#fff',
                  border: '1px solid var(--color-hairline, #e5e5e5)',
                  borderRadius: '10px',
                  padding: '18px 20px',
                }}>
                  <p style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 8px', color: '#1a1a1a' }}>{faq.q}</p>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section style={{
          background: '#0f0f0f',
          color: '#fff',
          padding: '64px 24px',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, margin: '0 0 16px', letterSpacing: '-0.3px' }}>
              Ready to Start Learning?
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', margin: '0 0 32px', lineHeight: 1.6 }}>
              Join hundreds of students already learning with PandaCourses.
            </p>
            <Link href="/pricing" style={{
              display: 'inline-block',
              background: '#f97316',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
            }}>
              Get Membership Now
            </Link>
          </div>
        </section>

      </main>

    </>
  )
}
