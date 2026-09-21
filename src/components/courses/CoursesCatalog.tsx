'use client'

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export interface CategoryCount {
  category: string
  count: number
}

export interface CourseItem {
  id: string
  course_name: string
  mentor: string | null
  category: string | null
  image_url: string | null
  slug: string
  created_at: string
}

interface CoursesCatalogProps {
  initialCourses: CourseItem[]
  categoriesWithCounts: CategoryCount[]
  totalCount: number
  price: number
}

function CoursesCatalogInner({
  initialCourses,
  categoriesWithCounts,
  totalCount,
  price,
}: CoursesCatalogProps) {
  const searchParams = useSearchParams()

  const paramSearch = searchParams?.get('search') || ''
  const paramCat = searchParams?.get('category') || 'All'
  const paramSort = searchParams?.get('sort') || 'newest'
  const paramPage = parseInt(searchParams?.get('page') || '1', 10)

  const [searchQuery, setSearchQuery] = useState(paramSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(paramSearch)
  const [activeCategory, setActiveCategory] = useState(paramCat)
  const [sort, setSort] = useState(paramSort)
  const [currentPage, setCurrentPage] = useState(isNaN(paramPage) ? 1 : Math.max(1, paramPage))

  // Debounce search typing by ~300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch((prev) => {
        if (prev !== searchQuery) {
          setCurrentPage(1)
        }
        return searchQuery
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Sync state to URL without full page reload
  const isFirstMount = useRef(true)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    const params = new URLSearchParams()
    if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim())
    if (activeCategory !== 'All') params.set('category', activeCategory)
    if (sort !== 'newest') params.set('sort', sort)
    if (currentPage > 1) params.set('page', currentPage.toString())

    const qs = params.toString()
    const newUrl = `/courses${qs ? `?${qs}` : ''}`
    window.history.replaceState(null, '', newUrl)
  }, [debouncedSearch, activeCategory, sort, currentPage])

  // Sync state when user navigates back/forward
  useEffect(() => {
    const s = searchParams?.get('search') || ''
    const c = searchParams?.get('category') || 'All'
    const so = searchParams?.get('sort') || 'newest'
    const p = parseInt(searchParams?.get('page') || '1', 10)

    setSearchQuery(s)
    setDebouncedSearch(s)
    setActiveCategory(c)
    setSort(so)
    setCurrentPage(isNaN(p) ? 1 : Math.max(1, p))
  }, [searchParams])

  // Reset page to 1 when filters change
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    setCurrentPage(1)
  }

  const handleSortChange = (newSort: string) => {
    setSort(newSort)
    setCurrentPage(1)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setDebouncedSearch('')
    setCurrentPage(1)
  }

  const handleClearAll = () => {
    setActiveCategory('All')
    setSearchQuery('')
    setDebouncedSearch('')
    setSort('newest')
    setCurrentPage(1)
  }

  // Filter courses
  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim()
    return initialCourses.filter((course) => {
      const matchesCategory =
        activeCategory === 'All' || course.category === activeCategory
      const matchesSearch =
        !q ||
        course.course_name.toLowerCase().includes(q) ||
        (course.mentor || '').toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [initialCourses, debouncedSearch, activeCategory])

  // Sort courses
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }
      if (sort === 'az') {
        return a.course_name.localeCompare(b.course_name)
      }
      if (sort === 'za') {
        return b.course_name.localeCompare(a.course_name)
      }
      // 'newest' default
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [filtered, sort])

  // Pagination (20 per page)
  const ITEMS_PER_PAGE = 20
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE) || 1
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return sorted.slice(start, start + ITEMS_PER_PAGE)
  }, [sorted, currentPage])

  // Build crawlable page URL
  const buildPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams()
    if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim())
    if (activeCategory !== 'All') params.set('category', activeCategory)
    if (sort !== 'newest') params.set('sort', sort)
    if (pageNumber > 1) params.set('page', pageNumber.toString())
    const qs = params.toString()
    return `/courses${qs ? `?${qs}` : ''}`
  }

  // Scroll to top of results on page change
  const handlePageSelect = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    const url = buildPageUrl(pageNumber)
    window.history.pushState(null, '', url)
    const el = document.getElementById('courses-results')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <style>{`
        .courses-catalog-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1199px) {
          .courses-catalog-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 899px) {
          .courses-catalog-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
        /* Desktop category chips wrap into up to 2 rows */
        .category-chips-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          max-height: 92px;
          overflow: hidden;
        }
        .category-chip {
          transition: all 0.15s ease;
        }
        .category-chip:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }
        @media (max-width: 767px) {
          .category-chips-scroll-wrapper {
            position: relative;
            width: 100%;
          }
          .category-chips-scroll-wrapper::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 32px;
            background: linear-gradient(90deg, transparent, var(--color-canvas));
            pointer-events: none;
            z-index: 2;
          }
          .category-chips-container {
            display: flex !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            max-height: none !important;
            padding-bottom: 4px;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
            gap: 8px;
          }
          .category-chips-container::-webkit-scrollbar {
            display: none;
          }
          .category-chip {
            scroll-snap-align: start;
            flex-shrink: 0 !important;
            min-height: 44px !important;
          }
          .filter-bar-row {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .sort-container {
            width: 100% !important;
            justify-content: flex-end;
          }
          .sort-container select {
            min-height: 44px !important;
          }
          .view-course-btn {
            min-height: 44px !important;
          }
        }
        .catalog-course-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .catalog-course-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          border-color: rgba(107, 78, 255, 0.3) !important;
        }
        .catalog-course-card:hover img {
          transform: scale(1.18) !important;
        }
        .catalog-course-card:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }
      `}</style>

      {/* 1. HERO (compact, dark band) */}
      <section
        style={{
          background: 'var(--color-brand-navy)',
          padding: '56px 24px 48px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle purple radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '480px',
            height: '240px',
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(107, 78, 255, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#A78BFA',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 12px',
            }}
          >
            ALL COURSES
          </p>

          <h1
            style={{
              fontSize: 'clamp(28px, 4.5vw, 44px)',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.5px',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 12px',
              lineHeight: 1.2,
            }}
          >
            Browse Our Course Library
          </h1>

          <p
            style={{
              fontSize: '16px',
              color: 'var(--color-on-dark-muted)',
              fontFamily: 'var(--font-sans)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            {totalCount} premium courses. Instant Mega / Google Drive access.
          </p>

          {/* Large Search Input */}
          <div
            style={{
              maxWidth: '640px',
              width: '100%',
              margin: '28px auto 0',
              position: 'relative',
            }}
          >
            {/* Magnifier Icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses or mentors..."
              style={{
                width: '100%',
                height: '48px',
                background: 'white',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '8px',
                padding: '0 44px 0 48px',
                fontSize: '15px',
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
              }}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#E5E7EB',
                  border: 'none',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#4B5563',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  padding: 0,
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. FILTER BAR (below hero, light background) */}
      <section
        style={{
          background: 'var(--color-canvas)',
          borderBottom: '1px solid var(--color-hairline)',
          padding: '16px 24px',
          position: 'sticky',
          top: '64px',
          zIndex: 40,
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        <div
          className="filter-bar-row"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* Category Chips Container */}
          <div className="category-chips-scroll-wrapper" style={{ flex: 1, minWidth: 0 }}>
            <div className="category-chips-container">
              {categoriesWithCounts.map((cat) => {
                const isActive = activeCategory === cat.category
                return (
                  <button
                    key={cat.category}
                    type="button"
                    onClick={() => handleCategoryChange(cat.category)}
                    aria-current={isActive ? 'page' : undefined}
                    className="category-chip"
                    style={{
                      minHeight: '40px',
                      padding: '0 16px',
                      borderRadius: 'var(--radius-full)',
                      border: isActive
                        ? '1px solid var(--color-primary)'
                        : '1px solid var(--color-hairline)',
                      background: isActive ? 'var(--color-primary)' : 'white',
                      color: isActive ? 'white' : 'var(--color-ink-deep)',
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 500,
                      fontFamily: 'var(--font-sans)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                      boxShadow: isActive
                        ? '0 2px 8px rgba(107, 78, 255, 0.35)'
                        : 'none',
                      transition: 'all 0.15s ease',
                      outline: 'none',
                    }}
                  >
                    <span>{cat.category}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '1px 6px',
                        borderRadius: '10px',
                        background: isActive
                          ? 'rgba(255, 255, 255, 0.22)'
                          : 'var(--color-surface)',
                        color: isActive ? 'white' : 'var(--color-steel)',
                      }}
                    >
                      {cat.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sort Select */}
          <div
            className="sort-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0,
            }}
          >
            <label
              htmlFor="sort-select"
              style={{
                fontSize: '13px',
                color: 'var(--color-steel)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                display: 'none',
              }}
            >
              Sort:
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              style={{
                minHeight: '40px',
                padding: '0 14px',
                background: 'white',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="az">A–Z</option>
              <option value="za">Z–A</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. GRID CONTENT & RESULTS */}
      <div
        id="courses-results"
        style={{
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          padding: '36px 24px 96px',
          boxSizing: 'border-box',
          flex: 1,
        }}
      >
        {/* Result Line Above Grid */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-ink-deep)',
              fontFamily: 'var(--font-sans)',
              margin: 0,
            }}
          >
            {filtered.length} {filtered.length === 1 ? 'course' : 'courses'}
            {activeCategory !== 'All' && ` in ${activeCategory}`}
            {debouncedSearch && ` for "${debouncedSearch}"`}
          </p>

          {/* Active filter badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {activeCategory !== 'All' && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'white',
                  border: '1px solid var(--color-hairline-strong)',
                  borderRadius: '16px',
                  padding: '3px 10px',
                  fontSize: '12px',
                  color: 'var(--color-ink-deep)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Category: <strong>{activeCategory}</strong>
                <button
                  type="button"
                  onClick={() => handleCategoryChange('All')}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--color-steel)',
                    padding: '0 2px',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                  title="Remove category filter"
                >
                  ✕
                </button>
              </span>
            )}

            {debouncedSearch && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'white',
                  border: '1px solid var(--color-hairline-strong)',
                  borderRadius: '16px',
                  padding: '3px 10px',
                  fontSize: '12px',
                  color: 'var(--color-ink-deep)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Query: <strong>"{debouncedSearch}"</strong>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--color-steel)',
                    padding: '0 2px',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                  title="Clear search query"
                >
                  ✕
                </button>
              </span>
            )}

            {sort !== 'newest' && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'white',
                  border: '1px solid var(--color-hairline-strong)',
                  borderRadius: '16px',
                  padding: '3px 10px',
                  fontSize: '12px',
                  color: 'var(--color-ink-deep)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Sort: <strong>{sort === 'oldest' ? 'Oldest First' : sort === 'az' ? 'A–Z' : 'Z–A'}</strong>
                <button
                  type="button"
                  onClick={() => handleSortChange('newest')}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--color-steel)',
                    padding: '0 2px',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                  title="Reset sort"
                >
                  ✕
                </button>
              </span>
            )}

            {(activeCategory !== 'All' || debouncedSearch || sort !== 'newest') && (
              <button
                type="button"
                onClick={handleClearAll}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-primary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '4px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Grid or Empty State */}
        {sorted.length > 0 ? (
          <div className="courses-catalog-grid">
            {paginated.map((course, idx) => (
              <React.Fragment key={course.id}>
                <Link
                  href={`/course/${course.slug}`}
                  prefetch={false}
                  style={{ textDecoration: 'none', display: 'flex' }}
                >
                  <div
                    className="catalog-course-card"
                    style={{
                      background: 'white',
                      border: '1px solid var(--color-hairline)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                    }}
                  >
                    {/* Thumbnail: fixed 16/10 aspect-ratio, slight zoom and offset to crop banner (values can be tuned: transform scale and transform-origin) */}
                    <div
                      style={{
                        position: 'relative',
                        aspectRatio: '16 / 10',
                        width: '100%',
                        overflow: 'hidden',
                        background: 'var(--color-surface-soft)',
                      }}
                    >
                      {course.image_url ? (
                        <img
                          src={course.image_url}
                          alt={course.course_name}
                          loading={idx < 4 ? 'eager' : 'lazy'}
                          decoding="async"
                          width={360}
                          height={225}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center 40%',
                            transform: 'scale(1.12)',
                            transformOrigin: 'center 45%',
                            display: 'block',
                            transition: 'transform 0.3s ease',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #EDE9FE 0%, #F5F3FF 100%)',
                          }}
                        >
                          <span style={{ fontSize: '32px' }}>📚</span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div
                      style={{
                        padding: '16px',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Category Label */}
                      {course.category && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--color-steel)',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            fontFamily: 'var(--font-sans)',
                            marginBottom: '6px',
                            display: 'block',
                          }}
                        >
                          {course.category}
                        </span>
                      )}

                      {/* Course Title */}
                      <h3
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: 'var(--color-ink-deep)',
                          lineHeight: 1.4,
                          margin: '0 0 6px',
                          fontFamily: 'var(--font-sans)',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '38px',
                        }}
                      >
                        {course.course_name}
                      </h3>

                      {/* Mentor */}
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'var(--color-steel)',
                          margin: '0 0 10px',
                          fontFamily: 'var(--font-sans)',
                        }}
                      >
                        by {course.mentor || 'Instructor'}
                      </p>

                      {/* Lifetime access pill */}
                      <div style={{ marginBottom: '14px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(107, 78, 255, 0.08)',
                            color: 'var(--color-primary)',
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontFamily: 'var(--font-sans)',
                          }}
                        >
                          <span>⚡</span> Lifetime access
                        </span>
                      </div>

                      {/* View Course button */}
                      <div style={{ marginTop: 'auto' }}>
                        <div
                          className="view-course-btn"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '38px',
                            background: 'var(--color-ink-deep)',
                            color: 'white',
                            fontSize: '13px',
                            fontWeight: 600,
                            padding: '9px 0',
                            borderRadius: 'var(--radius-md)',
                            fontFamily: 'var(--font-sans)',
                            textAlign: 'center',
                          }}
                        >
                          View Course
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* 4. CTA STRIP inside the grid (inserted after the 8th card if total on page > 8) */}
                {paginated.length > 8 && idx === 7 && (
                  <div
                    style={{
                      gridColumn: '1 / -1',
                      background: 'linear-gradient(135deg, var(--color-brand-navy) 0%, #1A1238 100%)',
                      borderRadius: '12px',
                      padding: '24px 32px',
                      border: '1px solid rgba(107, 78, 255, 0.35)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '20px',
                      margin: '8px 0',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: 'clamp(18px, 3vw, 22px)',
                          fontWeight: 700,
                          color: 'white',
                          margin: '0 0 4px',
                          fontFamily: 'var(--font-sans)',
                          letterSpacing: '-0.3px',
                        }}
                      >
                        Get all {totalCount}+ courses with one payment
                      </h3>
                      <p
                        style={{
                          fontSize: '14px',
                          color: '#A78BFA',
                          margin: 0,
                          fontFamily: 'var(--font-sans)',
                          fontWeight: 500,
                        }}
                      >
                        One-time ${price} · Lifetime access
                      </p>
                    </div>

                    <Link
                      href="/pricing"
                      style={{
                        background: 'var(--color-primary)',
                        color: 'white',
                        minHeight: '44px',
                        padding: '12px 28px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '14px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        fontFamily: 'var(--font-sans)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(107, 78, 255, 0.4)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Get Lifetime Access
                    </Link>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div
            style={{
              textAlign: 'center',
              padding: '72px 24px',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid var(--color-hairline)',
            }}
          >
            <div style={{ fontSize: '44px', marginBottom: '16px' }}>🔍</div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--color-ink-deep)',
                marginBottom: '8px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              No courses found
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-slate)',
                maxWidth: '420px',
                margin: '0 auto 20px',
                fontFamily: 'var(--font-sans)',
                lineHeight: 1.5,
              }}
            >
              Try a different search or clear your filters.
            </p>
            <button
              type="button"
              onClick={handleClearAll}
              style={{
                background: 'var(--color-primary)',
                color: 'white',
                minHeight: '44px',
                padding: '10px 24px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                boxShadow: '0 4px 12px rgba(107, 78, 255, 0.25)',
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* 5. CRAWLABLE PAGINATION */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '40px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-steel)',
                fontFamily: 'var(--font-sans)',
                margin: 0,
              }}
            >
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, sorted.length)} of{' '}
              {sorted.length} courses
            </p>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {/* Prev Button */}
              {currentPage > 1 ? (
                <Link
                  href={buildPageUrl(currentPage - 1)}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageSelect(currentPage - 1)
                  }}
                  style={{
                    minHeight: '40px',
                    padding: '0 16px',
                    background: 'white',
                    border: '1px solid var(--color-hairline)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--color-ink-deep)',
                    fontFamily: 'var(--font-sans)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ← Prev
                </Link>
              ) : (
                <span
                  style={{
                    minHeight: '40px',
                    padding: '0 16px',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-hairline)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    color: 'var(--color-muted)',
                    fontFamily: 'var(--font-sans)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'not-allowed',
                  }}
                >
                  ← Prev
                </span>
              )}

              {/* Page Number Links */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 1
                )
                .reduce((acc: (number | string)[], p, idx, arr) => {
                  if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) {
                    acc.push('...')
                  }
                  acc.push(p)
                  return acc
                }, [])
                .map((p, idx) => {
                  if (p === '...') {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        style={{
                          padding: '0 6px',
                          fontSize: '14px',
                          color: 'var(--color-steel)',
                          fontFamily: 'var(--font-sans)',
                        }}
                      >
                        ...
                      </span>
                    )
                  }

                  const pageNum = p as number
                  const isCurrent = pageNum === currentPage

                  if (isCurrent) {
                    return (
                      <span
                        key={pageNum}
                        aria-current="page"
                        style={{
                          minHeight: '40px',
                          minWidth: '40px',
                          padding: '0 8px',
                          background: 'var(--color-primary)',
                          border: '1px solid var(--color-primary)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: 'white',
                          fontFamily: 'var(--font-sans)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {pageNum}
                      </span>
                    )
                  }

                  return (
                    <Link
                      key={pageNum}
                      href={buildPageUrl(pageNum)}
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageSelect(pageNum)
                      }}
                      style={{
                        minHeight: '40px',
                        minWidth: '40px',
                        padding: '0 8px',
                        background: 'white',
                        border: '1px solid var(--color-hairline)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--color-ink-deep)',
                        fontFamily: 'var(--font-sans)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {pageNum}
                    </Link>
                  )
                })}

              {/* Next Button */}
              {currentPage < totalPages ? (
                <Link
                  href={buildPageUrl(currentPage + 1)}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageSelect(currentPage + 1)
                  }}
                  style={{
                    minHeight: '40px',
                    padding: '0 16px',
                    background: 'white',
                    border: '1px solid var(--color-hairline)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--color-ink-deep)',
                    fontFamily: 'var(--font-sans)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Next →
                </Link>
              ) : (
                <span
                  style={{
                    minHeight: '40px',
                    padding: '0 16px',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-hairline)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    color: 'var(--color-muted)',
                    fontFamily: 'var(--font-sans)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'not-allowed',
                  }}
                >
                  Next →
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default function CoursesCatalog(props: CoursesCatalogProps) {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--color-steel)' }}>
          Loading courses...
        </div>
      }
    >
      <CoursesCatalogInner {...props} />
    </Suspense>
  )
}
