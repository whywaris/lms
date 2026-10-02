'use client'

import { useState } from 'react'
import type { TopPagesResult, TopPageItem } from '@/lib/admin/signupStats'

interface TopPagesAnalyticsProps {
  topPages: TopPagesResult
}

export default function TopPagesAnalytics({ topPages }: TopPagesAnalyticsProps) {
  const [range, setRange] = useState<'7d' | '30d'>('7d')

  const courses = range === '7d' ? topPages.courses7d : topPages.courses30d
  const blogs = range === '7d' ? topPages.blogs7d : topPages.blogs30d

  const renderTable = (items: TopPageItem[], emptyLabel: string, typeLabel: string) => {
    return (
      <div
        style={{
          border: '1px solid var(--color-hairline)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: 'var(--color-canvas)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 90px',
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-hairline)',
            padding: '10px 16px',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--color-steel)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <div>{typeLabel}</div>
          <div style={{ textAlign: 'right' }}>Page Views</div>
        </div>

        {items.length === 0 ? (
          <div
            style={{
              padding: '28px',
              textAlign: 'center',
              fontSize: '13px',
              color: 'var(--color-steel)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {emptyLabel}
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.slug}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 90px',
                padding: '12px 16px',
                borderBottom: idx === items.length - 1 ? 'none' : '1px solid var(--color-hairline-soft)',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
                alignItems: 'center',
              }}
            >
              <div style={{ minWidth: 0, paddingRight: '12px' }}>
                <a
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontWeight: 600,
                    color: 'var(--color-ink-deep)',
                    textDecoration: 'none',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={item.title}
                >
                  {item.title}
                </a>
                <span style={{ fontSize: '11px', color: 'var(--color-steel)' }}>{item.path}</span>
              </div>
              <div
                style={{
                  textAlign: 'right',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                }}
              >
                {item.views.toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        background: 'var(--color-canvas)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: '40px',
      }}
    >
      {/* Header and Toggle */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                margin: 0,
              }}
            >
              Top Pages & Traffic
            </h2>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '500',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-tint-peach)',
                color: '#C2410C',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Page Views
            </span>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--color-steel)',
              fontFamily: 'var(--font-sans)',
              margin: '4px 0 0',
            }}
          >
            Most visited public course and blog pages (excluding bots & admin visits)
          </p>
        </div>

        {/* 7d / 30d Toggle */}
        <div
          style={{
            display: 'inline-flex',
            background: 'var(--color-surface)',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-hairline)',
          }}
        >
          <button
            type="button"
            onClick={() => setRange('7d')}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: range === '7d' ? 600 : 500,
              color: range === '7d' ? 'white' : 'var(--color-slate)',
              background: range === '7d' ? 'var(--color-primary)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.15s ease',
            }}
          >
            Last 7 days
          </button>
          <button
            type="button"
            onClick={() => setRange('30d')}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: range === '30d' ? 600 : 500,
              color: range === '30d' ? 'white' : 'var(--color-slate)',
              background: range === '30d' ? 'var(--color-primary)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.15s ease',
            }}
          >
            Last 30 days
          </button>
        </div>
      </div>

      {/* Two Columns Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Course Column */}
        <div>
          <h3
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-ink-deep)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>📚</span>
            <span>Top Public Courses</span>
          </h3>
          {renderTable(courses, 'No course views recorded yet.', 'Course Name')}
        </div>

        {/* Blog Column */}
        <div>
          <h3
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-ink-deep)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>✍️</span>
            <span>Top Blog Posts</span>
          </h3>
          {renderTable(blogs, 'No blog post views recorded yet.', 'Post Title')}
        </div>
      </div>
    </div>
  )
}
