'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Course {
  id: string
  course_name: string
  mentor: string | null
  category: string | null
  image_url: string | null
  slug: string
  created_at: string
}

interface CoursesGridProps {
  courses: Course[]
  categories: string[]
}

export default function CoursesGrid({ courses, categories }: CoursesGridProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sort, setSort] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 20

  const filtered = (courses || [])
    .filter(c => {
      const matchCategory = activeCategory === 'All' || c.category === activeCategory
      const matchSearch = c.course_name.toLowerCase().includes(search.toLowerCase()) ||
        (c.mentor || '').toLowerCase().includes(search.toLowerCase())
      return matchCategory && matchSearch
    })
    .sort((a, b) => {
      if (sort === 'az') return a.course_name.localeCompare(b.course_name)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [search, activeCategory, sort])

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '60vh' }}>
      
      {/* Filter Bar */}
      <div style={{
        background: 'var(--color-canvas)',
        borderBottom: '1px solid var(--color-hairline)',
        padding: '20px 32px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          {/* Categories */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  background: activeCategory === cat ? 'var(--color-ink-deep)' : 'var(--color-surface)',
                  color: activeCategory === cat ? 'white' : 'var(--color-slate)',
                  boxShadow: activeCategory === cat ? 'none' : 'inset 0 0 0 1px var(--color-hairline)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                height: '40px',
                padding: '0 14px',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                width: '220px',
              }}
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                height: '40px',
                padding: '0 12px',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                background: 'white',
              }}
            >
              <option value="newest">Newest First</option>
              <option value="az">A — Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '48px 32px 96px',
      }}>
        <p style={{
          fontSize: '13px',
          color: 'var(--color-steel)',
          fontFamily: 'var(--font-sans)',
          margin: '0 0 24px',
        }}>
          {filtered.length} courses found — Page {currentPage} of {totalPages}
        </p>

        {filtered.length > 0 ? (
          <div className="courses-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
          }}>
            {paginated.map((course) => (
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
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}>
                  {/* Thumbnail */}
                  <div style={{ aspectRatio: '1/1', width: '100%', background: 'var(--color-surface-soft)', overflow: 'hidden' }}>
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

                  {/* Content */}
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {course.category && (
                      <span style={{
                        display: 'inline-block',
                        background: 'var(--color-tint-lavender)',
                        color: 'var(--color-ink-deep)',
                        fontSize: '11px',
                        fontWeight: '500',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        marginBottom: '8px',
                        fontFamily: 'var(--font-sans)',
                      }}>
                        {course.category}
                      </span>
                    )}
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--color-ink-deep)',
                      lineHeight: '1.4',
                      margin: '0 0 4px',
                      fontFamily: 'var(--font-sans)',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {course.course_name}
                    </h3>
                    <p style={{
                      fontSize: '12px',
                      color: 'var(--color-steel)',
                      margin: '0 0 16px',
                      fontFamily: 'var(--font-sans)',
                    }}>
                      by {course.mentor || 'Adam'}
                    </p>
                    
                    <div style={{ marginTop: 'auto' }}>
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
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div style={{ textAlign: 'center', padding: '80px 32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-ink-deep)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
              Oops, Nothing Here Yet!
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--color-slate)', marginBottom: '4px', fontFamily: 'var(--font-sans)' }}>
              Looks like this content is for Lifetime Members only.
            </p>
            <p style={{ fontSize: '14px', color: 'var(--color-slate)', marginBottom: '24px', fontFamily: 'var(--font-sans)' }}>
              Grab lifetime access to 2000+ courses with a one-time payment.
            </p>
            <Link href="/pricing" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--color-primary)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
            }}>
              ⭐ Get Lifetime Access
            </Link>
          </div>
        )}

        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '32px',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <p style={{
              fontSize: '13px',
              color: 'var(--color-steel)',
              fontFamily: 'var(--font-sans)',
              margin: '0',
            }}>
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} courses
            </p>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {/* Prev */}
              <button
                onClick={() => {
                  setCurrentPage(p => Math.max(1, p - 1))
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                disabled={currentPage === 1}
                style={{
                  height: '40px',
                  padding: '0 16px',
                  background: currentPage === 1 ? 'var(--color-surface)' : 'var(--color-canvas)',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  color: currentPage === 1 ? 'var(--color-muted)' : 'var(--color-ink)',
                  fontFamily: 'var(--font-sans)',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                ← Prev
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page =>
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                )
                .reduce((acc: (number | string)[], page, idx, arr) => {
                  if (idx > 0 && (page as number) - (arr[idx - 1] as number) > 1) {
                    acc.push('...')
                  }
                  acc.push(page)
                  return acc
                }, [])
                .map((page, idx) => (
                  page === '...' ? (
                    <span key={`dots-${idx}`} style={{
                      padding: '0 8px',
                      fontSize: '14px',
                      color: 'var(--color-muted)',
                      fontFamily: 'var(--font-sans)',
                    }}>
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page as number)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      style={{
                        height: '40px',
                        width: '40px',
                        background: currentPage === page
                          ? 'var(--color-ink-deep)'
                          : 'var(--color-canvas)',
                        border: '1px solid var(--color-hairline)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '14px',
                        fontWeight: currentPage === page ? '600' : '400',
                        color: currentPage === page ? 'white' : 'var(--color-ink)',
                        fontFamily: 'var(--font-sans)',
                        cursor: 'pointer',
                      }}
                    >
                      {page}
                    </button>
                  )
                ))
              }

              {/* Next */}
              <button
                onClick={() => {
                  setCurrentPage(p => Math.min(totalPages, p + 1))
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                disabled={currentPage === totalPages}
                style={{
                  height: '40px',
                  padding: '0 16px',
                  background: currentPage === totalPages ? 'var(--color-surface)' : 'var(--color-canvas)',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  color: currentPage === totalPages ? 'var(--color-muted)' : 'var(--color-ink)',
                  fontFamily: 'var(--font-sans)',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
