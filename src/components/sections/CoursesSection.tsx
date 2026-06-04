import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default async function CoursesSection() {
  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('public_courses')
    .select('*')
    .eq('is_published', true)
    .not('image_url', 'is', null)
    .limit(14)

  const shuffled = shuffleArray(courses || [])

  return (
    <section style={{
      background: 'var(--color-canvas)',
      padding: '96px 32px',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
      }}>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
        }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: '600',
            color: 'var(--color-ink-deep)',
            letterSpacing: '-0.5px',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 12px',
            lineHeight: '1.2',
          }}>
            Browse Our Courses
          </h2>
        </div>

        {/* Courses Grid */}
        {shuffled && shuffled.length > 0 ? (
          <>
            <div className="courses-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
            }}>
              {shuffled.map((course) => (
                <Link
                  key={course.id}
                  href={`/course/${course.slug}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div style={{
                    background: 'white',
                    border: '1px solid var(--color-hairline)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                  }}>
                    {/* Thumbnail */}
                    <div style={{
                      aspectRatio: '1/1',
                      width: '100%',
                      background: 'var(--color-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}>
                      {course.image_url ? (
                        <img 
                          src={course.image_url} 
                          alt={course.course_name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span style={{ fontSize: '32px' }}>📚</span>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '14px' }}>
                      {course.category && (
                        <span style={{
                          background: 'var(--color-tint-lavender)',
                          color: 'var(--color-ink-deep)',
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          marginBottom: '6px',
                          display: 'inline-block',
                          fontFamily: 'var(--font-sans)',
                        }}>
                          {course.category}
                        </span>
                      )}
                      
                      <h3 style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'var(--color-ink-deep)',
                        fontFamily: 'var(--font-sans)',
                        margin: '0 0 4px',
                        lineHeight: '1.4',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {course.course_name}
                      </h3>

                      {course.mentor && (
                        <p style={{
                          fontSize: '12px',
                          color: 'var(--color-steel)',
                          fontFamily: 'var(--font-sans)',
                          margin: '0',
                        }}>
                          by {course.mentor}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Button */}
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link href="/courses" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--color-ink-deep)',
                color: 'white',
                padding: '12px 28px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
              }}>
                View All Courses →
              </Link>
            </div>
          </>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '64px 32px',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-hairline)',
          }}>
            <p style={{ fontSize: '32px', margin: '0 0 16px' }}>📚</p>
            <p style={{
              fontSize: '16px',
              fontWeight: '500',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 8px',
            }}>
              Courses Coming Soon
            </p>
            <p style={{
              fontSize: '14px',
              color: 'var(--color-slate)',
              fontFamily: 'var(--font-sans)',
              margin: '0',
            }}>
              No courses have been published yet — stay tuned for updates!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
