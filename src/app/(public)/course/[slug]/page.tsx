import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'
import StickyCTA from '@/components/ui/StickyCTA'
import ExpandableContent from '@/components/ui/ExpandableContent'
import ReviewsCarousel from '@/components/sections/ReviewsCarousel'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { autoLinkContent, AutoLinkTarget } from '@/lib/autoLinkContent'
import { PRICE_USD, REFUND_MODE } from '@/lib/siteConfig'

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: course } = await supabase
    .from('public_courses')
    .select('course_name, short_description, image_url')
    .eq('slug', slug)
    .single()

  const title = course?.course_name
    ? `${course.course_name} | PandaCourses`
    : 'Course | PandaCourses'
  const description = course?.short_description?.slice(0, 155) || 'Buy this course on PandaCourses and get instant Mega/Google Drive access.'
  const image = course?.image_url || 'https://pandacourses.com/og-default.jpg'
  const url = `https://pandacourses.com/course/${slug}`

  return {
    title,
    description,
    openGraph: {
      title: course?.course_name || 'Course',
      description,
      url,
      siteName: 'PandaCourses',
      images: [{ url: image }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: course?.course_name || 'Course',
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function CoursePage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>
}) {
  const params = await paramsPromise
  const supabase = await createClient()

  // 1. Fetch main course
  const { data: course } = await supabase
    .from('public_courses')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (!course) notFound()

  // 2. Run all remaining independent queries in parallel with try/catch
  const [courseCount, linkRules, allCourses, allPosts, relatedCourses] = await Promise.all([
    (async () => {
      try {
        const { count } = await supabase
          .from('public_courses')
          .select('id', { count: 'exact', head: true })
          .eq('is_published', true)
        return count || 0
      } catch {
        return 0
      }
    })(),
    (async () => {
      try {
        const { data } = await supabase
          .from('link_rules')
          .select('keyword, url, priority')
          .eq('is_active', true)
        return data || []
      } catch {
        return []
      }
    })(),
    (async () => {
      try {
        const { data } = await supabase
          .from('public_courses')
          .select('course_name, slug')
          .eq('is_published', true)
        return data || []
      } catch {
        return []
      }
    })(),
    (async () => {
      try {
        const { data } = await supabase
          .from('blog_posts')
          .select('title, slug')
          .eq('is_published', true)
        return data || []
      } catch {
        return []
      }
    })(),
    (async () => {
      try {
        let query = supabase
          .from('public_courses')
          .select('id, slug, image_url, course_name, category, mentor')
          .eq('is_published', true)
          .neq('slug', params.slug)
          .limit(3)

        if (course.category) {
          query = query.eq('category', course.category)
        }
        const { data } = await query
        return data || []
      } catch {
        return []
      }
    })(),
  ])

  const count = courseCount || 0

  const targets: AutoLinkTarget[] = [
    ...(linkRules || []).map((lr) => ({
      keyword: lr.keyword,
      url: lr.url,
      priority: lr.priority ?? 0,
    })),
    ...(allCourses || []).map((c) => ({
      keyword: c.course_name,
      slug: c.slug,
      type: 'course' as const,
      priority: 0,
    })),
    ...(allPosts || []).map((p) => ({
      keyword: p.title,
      slug: p.slug,
      type: 'blog' as const,
      priority: 0,
    })),
  ]

  const linkedDescription = autoLinkContent(course.description || '', targets, `/course/${params.slug}`, 6)

  // Existing Course Schema
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    'name': course.course_name,
    'description': course.short_description || course.description,
    'provider': {
      '@type': 'Organization',
      'name': 'PandaCourses',
      'url': 'https://pandacourses.com',
    },
    'image': course.image_url,
    'url': `https://pandacourses.com/course/${course.slug}`,
    ...(course.tags?.length ? { 'keywords': course.tags.join(', ') } : {}),
  }

  // BreadcrumbList JSON-LD Schema
  const breadcrumbElements = [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': 'https://pandacourses.com',
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Courses',
      'item': 'https://pandacourses.com/courses',
    },
  ]

  if (course.category) {
    breadcrumbElements.push({
      '@type': 'ListItem',
      'position': breadcrumbElements.length + 1,
      'name': course.category,
      'item': `https://pandacourses.com/courses?category=${encodeURIComponent(course.category)}`,
    })
  }

  breadcrumbElements.push({
    '@type': 'ListItem',
    'position': breadcrumbElements.length + 1,
    'name': course.course_name,
    'item': `https://pandacourses.com/course/${course.slug}`,
  })

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbElements,
  }

  return (
    <main className="course-page-root" style={{ background: 'var(--color-canvas)', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <style>{`
        /* Desktop: 2-column layout */
        .course-hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: stretch;
        }
        .hero-col-left {
          display: flex;
          flex-direction: column;
        }
        .hero-col-right {
          display: flex;
          flex-direction: column;
        }
        .hero-checks-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* Mobile (<769px): stack in order: thumbnail, title/desc, price card, checks */
        @media (max-width: 768px) {
          .course-hero-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 24px !important;
          }
          .hero-col-left,
          .hero-col-right {
            display: contents !important;
          }
          .hero-thumbnail-box {
            order: 1 !important;
          }
          .hero-info-box {
            order: 2 !important;
          }
          .hero-price-card {
            order: 3 !important;
          }
          .hero-checks-box {
            order: 4 !important;
            margin-top: 0 !important;
            flex: initial !important;
          }
          .related-courses-grid {
            grid-template-columns: 1fr !important;
          }
          .course-page-root {
            padding-bottom: 76px;
          }
        }
      `}</style>

      <Navbar />

      <StickyCTA
        courseName={course.course_name}
        price={PRICE_USD}
      />

      {/* BREADCRUMB */}
      <nav
        aria-label="Breadcrumb"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px',
          fontSize: '13px',
          color: 'var(--color-steel)',
          fontFamily: 'var(--font-sans)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Link href="/" style={{ color: 'var(--color-steel)', textDecoration: 'none', flexShrink: 0 }}>
          Home
        </Link>
        <span style={{ flexShrink: 0, opacity: 0.6 }}>/</span>
        <Link href="/courses" style={{ color: 'var(--color-steel)', textDecoration: 'none', flexShrink: 0 }}>
          Courses
        </Link>
        {course.category && (
          <>
            <span style={{ flexShrink: 0, opacity: 0.6 }}>/</span>
            <Link
              href={`/courses?category=${encodeURIComponent(course.category)}`}
              style={{ color: 'var(--color-steel)', textDecoration: 'none', flexShrink: 0 }}
            >
              {course.category}
            </Link>
          </>
        )}
        <span style={{ flexShrink: 0, opacity: 0.6 }}>/</span>
        <span
          style={{
            color: 'var(--color-slate)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '320px',
          }}
          title={course.course_name}
        >
          {course.course_name}
        </span>
      </nav>

      {/* 1. HERO — 2 Balanced Columns */}
      <section
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px 64px',
        }}
      >
        <div className="course-hero-grid">
          {/* Left Column: Thumbnail + 3 Checks list */}
          <div className="hero-col-left">
            {/* Thumbnail Box */}
            <div className="hero-thumbnail-box">
              {course.image_url ? (
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16 / 10',
                    background: 'var(--color-surface-soft)',
                    border: '1px solid var(--color-hairline)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {/* Tuning note: scale (1.12) and transform-origin (center 45%) can be adjusted to crop header/star strip baked into course images */}
                  <img
                    src={course.image_url}
                    alt={course.course_name}
                    loading="eager"
                    fetchPriority="high"
                    style={{
                      width: '100%',
                      height: '100%',
                      aspectRatio: '16 / 10',
                      objectFit: 'cover',
                      objectPosition: 'center 40%',
                      transform: 'scale(1.12)',
                      transformOrigin: 'center 45%',
                      display: 'block',
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16 / 10',
                    background: 'var(--color-surface-soft)',
                    border: '1px solid var(--color-hairline)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '48px' }}>📚</span>
                </div>
              )}
            </div>

            {/* Checklist Directly Under Thumbnail */}
            <div
              className="hero-checks-box"
              style={{
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '10px',
                padding: '16px 20px',
                background: 'var(--color-surface, #F7F7F5)',
                border: '1px solid var(--color-hairline, #E8E8E5)',
                borderRadius: '12px',
                flex: 1,
              }}
            >
              {[
                'Instant dashboard access',
                'Course files via Mega / Google Drive',
                'Lifetime access, new courses included',
              ].map((check) => (
                <div
                  key={check}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: 'var(--color-ink-deep, #0F0F0F)',
                    fontFamily: 'var(--font-sans)',
                    lineHeight: '1.4',
                  }}
                >
                  <span style={{ color: '#10B981', fontSize: '15px', fontWeight: 'bold', flexShrink: 0 }}>✓</span>
                  <span>{check}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Title/Mentor/Desc + Price Card */}
          <div className="hero-col-right">
            {/* Info Box */}
            <div className="hero-info-box">
              {/* Category Link */}
              {course.category && (
                <div style={{ marginBottom: '10px' }}>
                  <Link
                    href={`/courses?category=${encodeURIComponent(course.category)}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-hairline)',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: 'var(--color-steel)',
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {course.category}
                  </Link>
                </div>
              )}

              {/* H1 Title */}
              <h1
                style={{
                  fontSize: 'clamp(24px, 3vw, 34px)',
                  fontWeight: '700',
                  color: 'var(--color-ink-deep)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0 0 8px',
                  lineHeight: '1.25',
                  letterSpacing: '-0.5px',
                }}
              >
                {course.course_name}
              </h1>

              {/* Mentor */}
              {course.mentor && (
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-slate)',
                    fontFamily: 'var(--font-sans)',
                    margin: '0 0 12px',
                  }}
                >
                  by <span style={{ color: 'var(--color-ink-deep)', fontWeight: '500' }}>{course.mentor}</span>
                </p>
              )}

              {/* Lifetime Access Pill */}
              <div style={{ marginBottom: '16px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'var(--color-badge-lifetime-bg, #EAF3DE)',
                    color: 'var(--color-badge-lifetime-text, #27500A)',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <span>⭐</span>
                  <span>Included in Lifetime Access</span>
                </span>
              </div>

              {/* Short Description clamped to 5 lines with Read More anchor */}
              {course.short_description && (
                <div style={{ marginBottom: '24px' }}>
                  <p
                    style={{
                      fontSize: '15px',
                      color: 'var(--color-charcoal)',
                      fontFamily: 'var(--font-sans)',
                      lineHeight: '1.6',
                      margin: '0 0 6px',
                      display: '-webkit-box',
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {course.short_description}
                  </p>
                  <a
                    href="#course-details"
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-primary)',
                      fontWeight: '500',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-sans)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    Read more ↓
                  </a>
                </div>
              )}
            </div>

            {/* Price / CTA Card */}
            <div
              className="hero-price-card"
              style={{
                borderRadius: '12px',
                border: '1px solid var(--color-hairline)',
                background: 'linear-gradient(180deg, var(--color-tint-lavender, #F3F0FF) 0%, var(--color-surface, #F7F7F5) 100%)',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(107, 78, 255, 0.05)',
              }}
            >
              {/* Line 1: Price & One-time payment */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: 'var(--color-ink-deep)',
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: '-0.5px',
                  }}
                >
                  ${PRICE_USD}
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-slate)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  one-time payment
                </span>
              </div>

              {/* Line 2: Dynamic Count Copy */}
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--color-charcoal)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0 0 18px',
                  lineHeight: '1.5',
                }}
              >
                Get this course plus {count}+ more with Lifetime Access.
              </p>

              {/* Full Width Primary CTA Button */}
              <Link
                href="/pricing"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  minHeight: '48px',
                  background: 'var(--color-primary, #6B4EFF)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '15px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-sans)',
                  boxShadow: '0 4px 14px rgba(107, 78, 255, 0.35)',
                  marginBottom: '16px',
                  transition: 'opacity 0.15s ease',
                }}
              >
                Get Lifetime Access – ${PRICE_USD}
              </Link>

              {/* Refund policy line */}
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--color-slate, #5A5A5A)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0 0 16px',
                  textAlign: 'center',
                  lineHeight: '1.4',
                }}
              >
                {REFUND_MODE === '7day' ? (
                  <>
                    7-day money-back guarantee ·{' '}
                    <Link
                      href="/refund-policy"
                      style={{
                        color: 'var(--color-ink-deep, #0F0F0F)',
                        textDecoration: 'underline',
                        fontWeight: '500',
                      }}
                    >
                      Refund Policy
                    </Link>
                  </>
                ) : (
                  <>
                    All sales are final ·{' '}
                    <Link
                      href="/refund-policy"
                      style={{
                        color: 'var(--color-ink-deep, #0F0F0F)',
                        textDecoration: 'underline',
                        fontWeight: '500',
                      }}
                    >
                      Refund Policy
                    </Link>
                  </>
                )}
              </p>

              {/* Quiet WhatsApp text link */}
              <div style={{ textAlign: 'center' }}>
                <a
                  href="https://wa.me/+447729314114"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-slate, #5A5A5A)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-sans)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'color 0.15s ease',
                  }}
                >
                  <span>💬</span>
                  <span>Questions? Chat with us on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROOF SECTION (Rendered only if proof_image_url exists) */}
      {course.proof_image_url && (
        <section
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 32px 64px',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--color-steel)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 16px',
            }}
          >
            WHAT&apos;S INSIDE
          </p>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div
              style={{
                borderRadius: '12px',
                border: '1px solid var(--color-hairline)',
                overflow: 'hidden',
                background: 'var(--color-surface)',
              }}
            >
              <img
                src={course.proof_image_url}
                alt={`Course files preview: ${course.course_name}`}
                loading="lazy"
                decoding="async"
                width={960}
                height={540}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-steel)',
                fontFamily: 'var(--font-sans)',
                marginTop: '10px',
                textAlign: 'center',
              }}
            >
              Preview of the course materials.
            </p>
          </div>
        </section>
      )}

      {/* 3. DETAILS SECTION */}
      <section
        id="course-details"
        className="defer-render"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px 64px',
          scrollMarginTop: '80px',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--color-steel)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 16px',
          }}
        >
          Course Details
        </p>
        <ExpandableContent html={linkedDescription} collapsedMaxHeight={340} />
      </section>

      {/* 4. REVIEWS (Directly before mid-page CTA band, no duplicate heading) */}
      <section
        className="defer-render"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px 64px',
        }}
      >
        <ReviewsCarousel showHint={true} />
      </section>

      {/* 5. MID-PAGE CTA BAND */}
      <section
        id="mid-page-cta"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px 64px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, var(--color-brand-navy, #1A1A2E) 0%, #2D1B69 100%)',
            borderRadius: '12px',
            padding: '48px 32px',
            textAlign: 'center',
            color: '#FFFFFF',
            boxShadow: '0 8px 32px rgba(26, 26, 46, 0.25)',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(22px, 3.5vw, 32px)',
              fontWeight: '700',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 8px',
              letterSpacing: '-0.5px',
            }}
          >
            Get all {count}+ courses with one payment
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.75)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 28px',
            }}
          >
            Lifetime access. New courses included.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Link
              href="/pricing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '48px',
                padding: '12px 32px',
                background: 'var(--color-primary, #6B4EFF)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                fontSize: '15px',
                fontWeight: '600',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                boxShadow: '0 4px 18px rgba(107, 78, 255, 0.45)',
                transition: 'transform 0.15s ease, opacity 0.15s ease',
              }}
            >
              Get Lifetime Access – ${PRICE_USD}
            </Link>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.88)',
              fontFamily: 'var(--font-sans)',
              margin: 0,
            }}
          >
            {REFUND_MODE === '7day' ? (
              <>
                7-day money-back guarantee ·{' '}
                <Link href="/refund-policy" style={{ color: '#FFFFFF', textDecoration: 'underline' }}>
                  Refund Policy
                </Link>
              </>
            ) : (
              <>
                All sales are final ·{' '}
                <Link href="/refund-policy" style={{ color: '#FFFFFF', textDecoration: 'underline' }}>
                  Refund Policy
                </Link>
              </>
            )}
          </p>
        </div>
      </section>

      {/* 6. RELATED COURSES */}
      {relatedCourses && relatedCourses.length > 0 && (
        <section
          className="defer-render"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 32px 96px',
          }}
        >
          <h2
            style={{
              fontSize: '22px',
              fontWeight: '600',
              color: 'var(--color-ink-deep)',
              textAlign: 'center',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 32px',
            }}
          >
            Related Courses
          </h2>
          <div
            className="related-courses-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
            }}
          >
            {relatedCourses.map((related) => (
              <Link
                key={related.id}
                href={`/course/${related.slug}`}
                prefetch={false}
                style={{
                  textDecoration: 'none',
                  background: '#fff',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  display: 'block',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                {/* Thumbnail with 16/10 aspect ratio and matching zoom crop */}
                <div
                  style={{
                    aspectRatio: '16 / 10',
                    width: '100%',
                    background: 'var(--color-surface-soft)',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {related.image_url ? (
                    <img
                      src={related.image_url}
                      alt={related.course_name}
                      loading="lazy"
                      decoding="async"
                      width={360}
                      height={225}
                      style={{
                        width: '100%',
                        height: '100%',
                        aspectRatio: '16 / 10',
                        objectFit: 'cover',
                        objectPosition: 'center 40%',
                        transform: 'scale(1.12)',
                        transformOrigin: 'center 45%',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '32px' }}>📚</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '16px' }}>
                  {related.category && (
                    <span
                      style={{
                        display: 'inline-block',
                        background: 'var(--color-tint-lavender)',
                        color: 'var(--color-ink-deep)',
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        marginBottom: '8px',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {related.category}
                    </span>
                  )}
                  <p
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--color-ink-deep)',
                      fontFamily: 'var(--font-sans)',
                      margin: '0 0 4px',
                      lineHeight: '1.4',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {related.course_name}
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-steel)',
                      fontFamily: 'var(--font-sans)',
                      margin: '0',
                    }}
                  >
                    by {related.mentor || 'Adam'}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {course.category && (
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Link
                href={`/courses?category=${encodeURIComponent(course.category)}`}
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--color-primary)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-sans)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                View all {course.category} courses →
              </Link>
            </div>
          )}
        </section>
      )}

      <Footer />
    </main>
  )
}
