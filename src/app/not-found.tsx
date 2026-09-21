import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'
import NotFoundIllustration from '@/components/ui/NotFoundIllustration'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Page Not Found | PandaCourses',
  robots: {
    index: false,
    follow: true,
  },
}

export default async function NotFound() {
  let categories: { category: string; count: number }[] = []
  let latestCourses: {
    id: string
    course_name: string
    slug: string
    image_url: string | null
    mentor: string | null
  }[] = []

  // Wrap all Supabase queries in try/catch so the 404 page never crashes
  try {
    const supabase = await createClient()

    // 1. Popular categories: group by category on published courses
    const { data: coursesData } = await supabase
      .from('public_courses')
      .select('category')
      .eq('is_published', true)

    if (coursesData && coursesData.length > 0) {
      const counts: Record<string, number> = {}
      for (const item of coursesData) {
        if (item.category && item.category.trim()) {
          const cat = item.category.trim()
          counts[cat] = (counts[cat] || 0) + 1
        }
      }

      categories = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([category, count]) => ({ category, count }))
    }

    // 2. Latest courses: 4 most recent published courses
    const { data: latestData } = await supabase
      .from('public_courses')
      .select('id, course_name, slug, image_url, mentor')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(4)

    if (latestData) {
      latestCourses = latestData
    }
  } catch (err) {
    console.error('Error loading 404 page courses data:', err)
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <style>{`
        .notfound-courses-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 768px) {
          .notfound-courses-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        .notfound-course-card:hover {
          transform: translateY(-2px);
          border-color: var(--color-primary);
          box-shadow: 0 6px 18px rgba(107, 78, 255, 0.12);
        }
      `}</style>

      <section
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 24px 80px',
          background: 'var(--color-canvas)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '840px', width: '100%', margin: '0 auto' }}>
          {/* Panda 404 Illustration */}
          <div style={{ marginBottom: '28px' }}>
            <NotFoundIllustration />
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(28px, 4vw, 36px)',
              fontWeight: '700',
              color: 'var(--color-ink-deep)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 10px',
              letterSpacing: '-0.5px',
            }}
          >
            Page not found
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontSize: '16px',
              color: 'var(--color-slate)',
              fontFamily: 'var(--font-sans)',
              lineHeight: '1.6',
              maxWidth: '460px',
              margin: '0 auto 28px',
            }}
          >
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>

          {/* Plain GET Search Form (no JS needed) */}
          <form
            action="/courses"
            method="GET"
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              maxWidth: '520px',
              margin: '0 auto 24px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-hairline-strong)',
              background: 'var(--color-canvas)',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div
              style={{
                paddingLeft: '16px',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--color-steel)',
                flexShrink: 0,
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
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              name="search"
              type="text"
              placeholder="Search courses..."
              style={{
                flex: 1,
                height: '48px',
                border: 'none',
                background: 'transparent',
                padding: '0 12px',
                fontSize: '15px',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                minWidth: 0,
              }}
            />
            <button
              type="submit"
              style={{
                height: '48px',
                padding: '0 22px',
                background: 'var(--color-primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                transition: 'background 0.15s ease',
              }}
            >
              Search
            </button>
          </form>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: categories.length > 0 || latestCourses.length > 0 ? '48px' : '36px',
            }}
          >
            <Link
              href="/courses"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-primary)',
                color: '#FFFFFF',
                height: '44px',
                padding: '0 24px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                boxShadow: '0 3px 12px rgba(107, 78, 255, 0.28)',
                transition: 'all 0.15s ease',
              }}
            >
              Browse All Courses
            </Link>

            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                color: 'var(--color-ink)',
                border: '1px solid var(--color-hairline-strong)',
                height: '44px',
                padding: '0 22px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.15s ease',
              }}
            >
              Back to Home
            </Link>
          </div>

          {/* Popular Categories Chips */}
          {categories.length > 0 && (
            <div style={{ marginBottom: latestCourses.length > 0 ? '48px' : '36px' }}>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-steel)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0 0 14px',
                }}
              >
                Popular Categories
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.category}
                    href={`/courses?category=${encodeURIComponent(cat.category)}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-hairline)',
                      borderRadius: 'var(--radius-full)',
                      padding: '7px 14px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'var(--color-ink)',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-sans)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{cat.category}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-steel)',
                        background: 'var(--color-hairline)',
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {cat.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Latest Courses Section */}
          {latestCourses.length > 0 && (
            <div
              style={{
                width: '100%',
                marginBottom: '48px',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <h2
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--color-ink-deep)',
                    fontFamily: 'var(--font-sans)',
                    margin: 0,
                  }}
                >
                  Latest courses
                </h2>
                <Link
                  href="/courses"
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  View all →
                </Link>
              </div>

              <div className="notfound-courses-grid">
                {latestCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/course/${course.slug}`}
                    prefetch={false}
                    className="notfound-course-card"
                    style={{
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-hairline)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    {/* Thumbnail 16/10 */}
                    <div
                      style={{
                        width: '100%',
                        aspectRatio: '16/10',
                        background: 'var(--color-surface-soft)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {course.image_url ? (
                        <img
                          src={course.image_url}
                          alt={course.course_name}
                          loading="lazy"
                          decoding="async"
                          width={280}
                          height={175}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '28px' }}>📚</span>
                      )}
                    </div>

                    {/* Content */}
                    <div
                      style={{
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: 'var(--color-ink-deep)',
                          fontFamily: 'var(--font-sans)',
                          margin: '0 0 6px',
                          lineHeight: '1.4',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {course.course_name}
                      </h3>

                      {course.mentor && (
                        <p
                          style={{
                            fontSize: '12px',
                            color: 'var(--color-steel)',
                            fontFamily: 'var(--font-sans)',
                            margin: 'auto 0 0',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          by {course.mentor}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Support Link */}
          <p
            style={{
              fontSize: '13px',
              color: 'var(--color-steel)',
              fontFamily: 'var(--font-sans)',
              margin: '0',
            }}
          >
            Think this is a mistake?{' '}
            <Link
              href="/contact"
              style={{
                color: 'var(--color-primary)',
                textDecoration: 'underline',
                fontWeight: '500',
              }}
            >
              Contact support
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
