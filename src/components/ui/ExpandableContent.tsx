'use client'

import { useState, useRef, useEffect } from 'react'

interface ExpandableContentProps {
  html: string
  collapsedMaxHeight?: number
}

export default function ExpandableContent({
  html,
  collapsedMaxHeight = 340,
}: ExpandableContentProps) {
  const [expanded, setExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > collapsedMaxHeight)
    }
  }, [html, collapsedMaxHeight])

  const toggleExpand = () => {
    if (expanded && contentRef.current) {
      // Scroll smoothly back to container top when collapsing
      const topOffset = contentRef.current.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: topOffset, behavior: 'smooth' })
    }
    setExpanded(!expanded)
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Content wrapper: full HTML always exists in DOM for SEO */}
      <div
        ref={contentRef}
        className="course-description"
        style={{
          maxHeight: expanded || !isOverflowing ? 'none' : `${collapsedMaxHeight}px`,
          overflow: 'hidden',
          position: 'relative',
          transition: 'max-height 0.25s ease',
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Lighter, shorter bottom fade gradient when collapsed and overflowing */}
      {!expanded && isOverflowing && (
        <div
          style={{
            position: 'absolute',
            bottom: '44px',
            left: 0,
            right: 0,
            height: '70px',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 75%, var(--color-canvas, #FFFFFF) 100%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Left-aligned outlined toggle button */}
      {isOverflowing && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginTop: '12px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <button
            type="button"
            onClick={toggleExpand}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              background: 'transparent',
              border: '1px solid var(--color-hairline-strong, #D0D0CC)',
              borderRadius: 'var(--radius-md, 8px)',
              color: 'var(--color-ink-deep, #0F0F0F)',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
              minHeight: '40px',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{expanded ? 'Show less' : 'Show full description'}</span>
            <span style={{ fontSize: '11px' }}>{expanded ? '▲' : '▼'}</span>
          </button>
        </div>
      )}
    </div>
  )
}
