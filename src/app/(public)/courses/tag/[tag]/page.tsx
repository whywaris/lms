import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params
  const formatted = tag.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return {
    title: `${formatted} Courses — PandaCourses`,
    description: `Browse all courses tagged with ${formatted} on PandaCourses.`,
  }
}

export async function generateStaticParams() {
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase
    .from('public_courses')
    .select('tags')
    .eq('is_published', true)
    .not('tags', 'is', null)

  const allTags = new Set<string>()
  data?.forEach((course: { tags: string[] }) => {
    course.tags?.forEach((tag: string) => allTags.add(tag))
  })

  return [...allTags].map(tag => ({
    tag: tag.toLowerCase().replace(/\s+/g, '-'),
  }))
}

export default async function TagPage({
  params: paramsPromise,
}: {
  params: Promise<{ tag: string }>
}) {
  const params = await paramsPromise
  const tagSlug = params.tag
  const tagName = tagSlug.replace(/-/g, ' ')

  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('public_courses')
    .select('*')
    .eq('is_published', true)
    .contains('tags', [tagName])
    .order('created_at', { ascending: false })

  if (!courses || courses.length === 0) notFound()

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section style={{
        background: 'var(--color-brand-navy)',
        padding: '48px 32px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: '500',
            color: 'var(--color-on-dark-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 12px',
          }}>
            Tag
          </p>
          <h1 style={{
            fontSize: 'clamp(24px, 4vw, 40px)',
            fontWeight: '600',
            color: 'white',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 12px',
            letterSpacing: '-0.5px',
          }}>
            #{tagName}
          </h1>
          <p style={{
            fontSize: '15px',
            color: 'var(--color-on-dark-muted)',
            fontFamily: 'var(--font-sans)',
            margin: '0',
          }}>
            {courses.length} courses tagged with #{tagName}
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px 24px',
        fontSize: '13px',
        color: 'var(--color-steel)',
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
      }}>
        <Link href="/" style={{ color: 'var(--color-steel)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/courses" style={{ color: 'var(--color-steel)', textDecoration: 'none' }}>Courses</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-slate)' }}>#{tagName}</span>
      </div>

      {/* Courses Grid */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '24px 24px 96px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
        }} className="courses-grid">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/course/${course.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: 'white',
                border: '1px solid var(--color-hairline)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
              }}>
                <div style={{ height: '200px', width: '100%', background: 'var(--color-surface-soft)', overflow: 'hidden' }}>
                  {course.image_url ? (
                    <img
                      src={course.image_url}
                      alt={course.course_name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '32px' }}>📚</span>
                    </div>
                  )}
                </div>
                <div style={{ padding: '16px' }}>
                  {course.tags && course.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      {course.tags.slice(0, 3).map((t: string) => (
                        <span key={t} style={{
                          background: 'var(--color-tint-lavender)',
                          color: 'var(--color-ink-deep)',
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontFamily: 'var(--font-sans)',
                        }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                  <p style={{
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
                  }}>
                    {course.course_name}
                  </p>
                  {course.mentor && (
                    <p style={{
                      fontSize: '12px',
                      color: 'var(--color-steel)',
                      fontFamily: 'var(--font-sans)',
                      margin: '0 0 12px',
                    }}>
                      by {course.mentor}
                    </p>
                  )}
                  <div style={{
                    display: 'block',
                    textAlign: 'center',
                    background: 'var(--color-ink-deep)',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '500',
                    padding: '9px 0',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-sans)',
                  }}>
                    View Course
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
