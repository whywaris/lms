import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface CourseItem {
  id: string
  course_name: string
  slug: string
  image_url: string
}

const TILE_STYLES = [
  {
    bg: 'rgba(107, 78, 255, 0.2)',
    border: 'rgba(167, 139, 250, 0.4)',
    rotate: '-2deg',
    translateY: '-6px',
  },
  {
    bg: 'rgba(56, 189, 248, 0.2)',
    border: 'rgba(56, 189, 248, 0.4)',
    rotate: '2.5deg',
    translateY: '10px',
  },
  {
    bg: 'rgba(16, 185, 129, 0.2)',
    border: 'rgba(16, 185, 129, 0.4)',
    rotate: '1.5deg',
    translateY: '-4px',
  },
  {
    bg: 'rgba(245, 158, 11, 0.2)',
    border: 'rgba(245, 158, 11, 0.4)',
    rotate: '-2deg',
    translateY: '8px',
  },
]

// Server-side Fisher-Yates shuffle
function fisherYatesShuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default async function Hero() {
  const supabase = await createClient()

  const [coursesRes, countRes] = await Promise.all([
    supabase
      .from('public_courses')
      .select('id, course_name, slug, image_url')
      .eq('is_published', true)
      .eq('show_in_hero', true)
      .not('image_url', 'is', null),
    supabase
      .from('public_courses')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true),
  ])

  const allEligibleCourses: CourseItem[] = (coursesRes.data || []) as CourseItem[]
  const shuffled = fisherYatesShuffle(allEligibleCourses)
  const courses: CourseItem[] = shuffled.slice(0, 4)
  const showCollage = courses.length >= 2
  const courseCount = countRes.count || allEligibleCourses.length || 0

  return (
    <section
      className="hero-section"
      style={{
        background: 'var(--color-brand-navy)',
        padding: '52px 24px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Subtle Background Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          right: '-50px',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(107,78,255,0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-80px',
          left: '10%',
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="hero-grid"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: showCollage ? '1.15fr 0.85fr' : '1fr',
          gap: '48px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left Column (Content) */}
        <div>
          {/* Eyebrow */}
          <p
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#A78BFA',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#A78BFA',
                boxShadow: '0 0 8px #A78BFA',
                display: 'inline-block',
              }}
            />
            Premium courses from top mentors
          </p>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(32px, 4.4vw, 54px)',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              margin: '0 0 18px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Premium Courses.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              One Price.
            </span>{' '}
            Lifetime Access.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '17px',
              color: 'var(--color-on-dark-muted)',
              lineHeight: 1.6,
              margin: '0 0 22px',
              fontFamily: 'var(--font-sans)',
              maxWidth: '520px',
            }}
          >
            Get top mentor courses for a one-time $99, with instant Drive access.
          </p>

          {/* 3 Check-mark Benefits */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px 20px',
              marginBottom: '28px',
            }}
          >
            {[
              'Instant dashboard access',
              'Lifetime updates',
              'Full Mega / Google Drive access',
            ].map((benefit) => (
              <div
                key={benefit}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Row */}
          <div
            style={{
              display: 'flex',
              gap: '14px',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: '24px',
            }}
          >
            <Link
              href="/courses"
              style={{
                background: 'var(--color-primary)',
                color: 'white',
                padding: '13px 28px',
                borderRadius: 'var(--radius-md)',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 16px rgba(107, 78, 255, 0.35)',
                minHeight: '44px',
              }}
            >
              Explore All Courses →
            </Link>

            <Link
              href="/how-to-buy"
              style={{
                background: 'transparent',
                color: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                padding: '13px 26px',
                borderRadius: 'var(--radius-md)',
                fontSize: '15px',
                fontWeight: 500,
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '44px',
              }}
            >
              How to Buy
            </Link>
          </div>

          {/* Single Trust Line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '6px 16px',
              fontSize: '13px',
              color: 'var(--color-on-dark-muted)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#10B981', fontWeight: 600 }}>✓</span>
              <span>Trusted by 2000+ learners</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#10B981', fontWeight: 600 }}>✓</span>
              <span>4.9+ Average Rating</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#10B981', fontWeight: 600 }}>✓</span>
              <span>Lifetime Access Available</span>
            </span>
          </div>
        </div>

        {/* Right Column (Visual Collage & Floating Chips) — Hidden if fewer than 2 courses */}
        {showCollage && (
          <div
            className="hero-visual-wrapper"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {/* Collage Container */}
            <div
              className="hero-collage-container"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '540px',
              }}
            >
              {/* Ambient purple backlight */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-28px',
                  background:
                    'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(107,78,255,0.25) 0%, rgba(124,58,237,0.1) 45%, transparent 70%)',
                  filter: 'blur(34px)',
                  borderRadius: '50%',
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
              />

              {/* Collage Tiles Grid */}
              <div
                className="hero-collage-grid"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '20px',
                  padding: '16px 8px',
                }}
              >
                {courses.map((course, idx) => {
                  const style = TILE_STYLES[idx % TILE_STYLES.length]
                  const isEager = idx < 2
                  return (
                    <Link
                      key={course.id || idx}
                      href={`/course/${course.slug}`}
                      className="hero-collage-tile"
                      style={{
                        position: 'relative',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: style.bg,
                        border: `1px solid ${style.border}`,
                        boxShadow: '0 14px 32px rgba(0, 0, 0, 0.45)',
                        aspectRatio: '16 / 10',
                        transform: `rotate(${style.rotate}) translateY(${style.translateY})`,
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        display: 'block',
                        textDecoration: 'none',
                      }}
                    >
                      <img
                        src={course.image_url}
                        alt={course.course_name}
                        loading={isEager ? 'eager' : 'lazy'}
                        {...(isEager ? { fetchPriority: 'high' } : {})}
                        width={320}
                        height={200}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </Link>
                  )
                })}
              </div>

              {/* Floating Stat Chips */}
              <div className="hero-chips-container">
                {/* Chip 1: $99 Lifetime Access */}
                <div
                  className="hero-stat-chip hero-chip-1"
                  style={{
                    position: 'absolute',
                    top: '-18px',
                    left: '-20px',
                    zIndex: 4,
                    background: 'rgba(9, 8, 22, 0.92)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#64dc96',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    $99
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.85)',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 500,
                    }}
                  >
                    Lifetime Access
                  </span>
                </div>

                {/* Chip 2: {count}+ Courses */}
                <div
                  className="hero-stat-chip hero-chip-2"
                  style={{
                    position: 'absolute',
                    top: '-18px',
                    right: '-20px',
                    zIndex: 4,
                    background: 'rgba(9, 8, 22, 0.92)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#A78BFA',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {courseCount}+
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.85)',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 500,
                    }}
                  >
                    Courses
                  </span>
                </div>

                {/* Chip 3: Instant Drive Access */}
                <div
                  className="hero-stat-chip hero-chip-3"
                  style={{
                    position: 'absolute',
                    bottom: '-20px',
                    right: '-10px',
                    zIndex: 4,
                    background: 'rgba(9, 8, 22, 0.92)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '14px' }}>⚡</span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'white',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 600,
                    }}
                  >
                    Instant Drive Access
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
