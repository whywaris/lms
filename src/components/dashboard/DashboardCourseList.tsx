'use client'

import { useState } from 'react'

export default function DashboardCourseList({ courses }: { courses: any[] }) {
  const [search, setSearch] = useState('')

  const filteredCourses = courses?.filter(c =>
    c.course_name.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <>
      {/* Search + Filter Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <p style={{
          fontSize: '13px',
          color: 'var(--color-steel)',
          fontFamily: 'var(--font-sans)',
          margin: '0',
        }}>
          {filteredCourses.length} courses available in your plan
        </p>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search courses by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            height: '40px',
            padding: '0 14px',
            background: 'var(--color-canvas)',
            border: '1px solid var(--color-hairline-strong)',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            color: 'var(--color-ink)',
            fontFamily: 'var(--font-sans)',
            outline: 'none',
            width: '300px',
            maxWidth: '100%',
          }}
        />
      </div>

      {/* Table */}
      {filteredCourses.length > 0 ? (
        <div className="dashboard-table" style={{
          background: 'var(--color-canvas)',
          border: '1px solid var(--color-hairline)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1fr',
            borderBottom: '1px solid var(--color-hairline)',
            background: 'var(--color-surface)',
          }}>
            {['Course Name', 'Mentor', 'Category', 'Drive Link', 'Source'].map((col) => (
              <div key={col} style={{
                padding: '12px 20px',
                fontSize: '11px',
                fontWeight: '500',
                color: 'var(--color-steel)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-sans)',
              }}>
                {col}
              </div>
            ))}
          </div>

          {/* Table Rows */}
          {filteredCourses.map((course, index) => (
            <div
              key={course.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1fr',
                borderBottom: index === filteredCourses.length - 1
                  ? 'none'
                  : '1px solid var(--color-hairline-soft)',
                background: index % 2 === 0
                  ? 'var(--color-canvas)'
                  : 'var(--color-surface-soft)',
              }}
            >
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-ink-deep)', fontFamily: 'var(--font-sans)', margin: '0' }}>
                  {course.course_name}
                </p>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                <p style={{ fontSize: '13px', color: 'var(--color-charcoal)', fontFamily: 'var(--font-sans)', margin: '0' }}>
                  {course.mentor || '—'}
                </p>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                {course.category ? (
                  <span style={{ fontSize: '11px', fontWeight: '500', padding: '3px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-soft)', color: 'var(--color-charcoal)', fontFamily: 'var(--font-sans)' }}>
                    {course.category}
                  </span>
                ) : (
                  <span style={{ fontSize: '13px', color: 'var(--color-muted)', fontFamily: 'var(--font-sans)' }}>—</span>
                )}
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                {course.drive_link ? (
                  <a href={course.drive_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-primary)', textDecoration: 'none', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    📁 Open Link
                  </a>
                ) : (
                  <span style={{ fontSize: '13px', color: 'var(--color-muted)', fontFamily: 'var(--font-sans)' }}>—</span>
                )}
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                {course.source ? (
                  <a
                    href={course.source.startsWith('http') ? course.source : `https://${course.source}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'var(--color-primary)',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-sans)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    🔗 Visit Source
                  </a>
                ) : (
                  <span style={{ fontSize: '13px', color: 'var(--color-muted)', fontFamily: 'var(--font-sans)' }}>—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '64px 32px', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-hairline)' }}>
          <p style={{ fontSize: '32px', margin: '0 0 16px' }}>📚</p>
          <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--color-ink)', fontFamily: 'var(--font-sans)', margin: '0 0 8px' }}>
            {courses && courses.length > 0 ? 'No courses match your search' : 'No courses available yet'}
          </p>
          <p style={{ fontSize: '14px', color: 'var(--color-slate)', fontFamily: 'var(--font-sans)', margin: '0' }}>
            {courses && courses.length > 0 ? 'Try a different search term' : 'The admin will add courses soon — please check back later for updates!'}
          </p>
        </div>
      )}
    </>
  )
}
