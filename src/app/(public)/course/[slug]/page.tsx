import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'
import StickyCTA from '@/components/ui/StickyCTA'
import PlanCards from '@/components/ui/PlanCards'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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

  const { data: course } = await supabase
    .from('public_courses')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (!course) notFound()

  // Related courses logic
  let query = supabase
    .from('public_courses')
    .select('*')
    .eq('is_published', true)
    .neq('slug', params.slug)
    .limit(3)

  if (course.category) {
    query = query.eq('category', course.category)
  }

  const { data: relatedCourses } = await query

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

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <Navbar />
      <StickyCTA
        courseName={course.course_name}
        monthlyPrice="$30"
        lifetimePrice="$99"
      />

      {/* Breadcrumb */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px 24px',
        fontSize: '13px',
        color: 'var(--color-steel)',
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexWrap: 'nowrap',
        overflow: 'hidden',
      }}>
        <Link href="/" style={{ color: 'var(--color-steel)', textDecoration: 'none', flexShrink: 0 }}>
          Home
        </Link>
        <span style={{ flexShrink: 0 }}>/</span>
        <Link href="/courses" style={{ color: 'var(--color-steel)', textDecoration: 'none', flexShrink: 0 }}>
          Courses
        </Link>
        <span style={{ flexShrink: 0 }}>/</span>
        <span style={{ flexShrink: 0 }}>...</span>
        <span style={{ flexShrink: 0 }}>/</span>
        <span style={{
          color: 'var(--color-slate)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0,
        }}>
          {course.course_name}
        </span>
      </div>

      {/* Hero — 2 Column */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 32px 64px',
      }}>
        <div className="course-hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'start',
        }}>

          {/* Left — Thumbnail */}
          <div>
            {course.image_url ? (
              <div style={{
                width: '100%',
                aspectRatio: '1/1',
                background: '#fff',
                border: '1px solid var(--color-hairline)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '16px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img
                  src={course.image_url}
                  alt={course.course_name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            ) : (
              <div style={{
                width: '100%',
                aspectRatio: '1/1',
                background: 'var(--color-surface-soft)',
                border: '1px solid var(--color-hairline)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <span style={{ fontSize: '48px' }}>📚</span>
              </div>
            )}

          </div>

          {/* Right — Info */}
          <div>

            {/* Category + Plan Badge */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '12px',
              flexWrap: 'wrap',
            }}>
              {course.category && (
                <Link
                  href={`/courses/category/${course.category.toLowerCase().replace(/\s+/g, '-')}`}
                  style={{ textDecoration: 'none' }}
                >
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '500',
                    color: 'var(--color-steel)',
                    fontFamily: 'var(--font-sans)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                  }}>
                    {course.category}
                  </span>
                </Link>
              )}
            </div>


            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: '600',
              color: 'var(--color-ink-deep)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 12px',
              lineHeight: '1.3',
              letterSpacing: '-0.5px',
            }}>
              {course.course_name}
            </h1>

            {/* Mentor */}
            {course.mentor && (
              <p style={{
                fontSize: '14px',
                color: 'var(--color-slate)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 24px',
              }}>
                by {course.mentor}
              </p>
            )}

            {/* Short Description */}
            {course.short_description && (
              <div style={{
                fontSize: '15px',
                color: 'var(--color-charcoal)',
                fontFamily: 'var(--font-sans)',
                lineHeight: '1.7',
                margin: '0 0 32px',
              }}>
                {course.short_description}
              </div>
            )}

            {/* WhatsApp Contact Button */}
            <a
              href="https://wa.me/+447729314114"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '14px',
                background: '#25D366',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                fontSize: '15px',
                fontWeight: '500',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                marginBottom: '32px',
              }}
            >
              💬 Want this course? Contact us on WhatsApp
            </a>

          </div>
        </div>
      </section>

      {/* Proof Image */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 32px 64px',
      }}>
        <p style={{
          fontSize: '11px',
          fontWeight: '500',
          color: 'var(--color-steel)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-sans)',
          margin: '0 0 16px',
        }}>
          Course Proof
        </p>
        {course.proof_image_url ? (
          <img
            src={course.proof_image_url}
            alt="Course Proof"
            style={{
              width: '100%',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-hairline)',
            }}
          />
        ) : (
          <div style={{
            background: 'var(--color-surface-soft)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-lg)',
            height: '240px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '48px' }}>📊</span>
          </div>
        )}
      </section>

      {/* Course Details */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 32px 64px',
      }}>
        <p style={{
          fontSize: '11px',
          fontWeight: '500',
          color: 'var(--color-steel)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-sans)',
          margin: '0 0 16px',
        }}>
          Course Details
        </p>
        <div
          className="course-description"
          dangerouslySetInnerHTML={{ __html: course.description || '' }}
        />
      </section>

      {/* Related Courses */}
      {relatedCourses && relatedCourses.length > 0 && (
        <section style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '48px 32px 96px',
        }}>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '600',
            color: 'var(--color-ink-deep)',
            textAlign: 'center',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 32px',
          }}>
            Related Courses
          </h2>
          <div className="related-courses-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}>
            {relatedCourses.map((related) => (
              <Link 
                key={related.id} 
                href={`/course/${related.slug}`} 
                style={{
                  textDecoration: 'none',
                  background: '#fff',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  display: 'block',
                }}
              >
                {/* Thumbnail */}
                <div style={{ aspectRatio: '1/1', width: '100%', background: 'var(--color-surface-soft)', overflow: 'hidden' }}>
                  {related.image_url ? (
                    <img
                      src={related.image_url}
                      alt={related.course_name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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
                    <span style={{
                      display: 'inline-block',
                      background: 'var(--color-tint-lavender)',
                      color: 'var(--color-badge-monthly-text)',
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      marginBottom: '8px',
                      fontFamily: 'var(--font-sans)',
                    }}>
                      {related.category}
                    </span>
                  )}
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--color-ink-deep)',
                    fontFamily: 'var(--font-sans)',
                    margin: '0 0 4px',
                    lineHeight: '1.4',
                  }}>
                    {related.course_name}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--color-steel)',
                    fontFamily: 'var(--font-sans)',
                    margin: '0',
                  }}>
                    by {related.mentor || 'Adam'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
