'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export interface LegalTocSection {
  id: string
  title: string
}

interface LegalTableOfContentsProps {
  sections: LegalTocSection[]
}

export default function LegalTableOfContents({ sections }: LegalTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || '')

  useEffect(() => {
    if (typeof window === 'undefined' || sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting)
        if (visibleEntries.length > 0) {
          // Sort by top distance to pick the one closest to header margin
          const topEntry = visibleEntries.reduce((prev, curr) =>
            prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr
          )
          setActiveId(topEntry.target.id)
        }
      },
      {
        rootMargin: '-96px 0px -60% 0px',
      }
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
      setActiveId(id)
      if (typeof window !== 'undefined') {
        history.replaceState(null, '', `#${id}`)
      }
    }
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <>
      {/* Mobile Collapsed Native <details> Table of Contents */}
      <details
        className="legal-toc-mobile"
        style={{
          background: 'var(--color-surface, #F7F7F5)',
          border: '1px solid var(--color-hairline, #E8E8E5)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '32px',
          width: '100%',
        }}
      >
        <summary
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: 600,
            fontSize: '15px',
            color: 'var(--color-ink-deep, #0F0F0F)',
            fontFamily: 'var(--font-sans)',
            userSelect: 'none',
          }}
        >
          <span>On this page</span>
          <span style={{ fontSize: '12px', color: 'var(--color-steel, #8A8A8A)' }} aria-hidden="true">
            ▾
          </span>
        </summary>
        <nav aria-label="Table of contents" style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--color-hairline, #E8E8E5)' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sections.map(({ id, title }, idx) => {
              const isActive = activeId === id
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => handleLinkClick(e, id)}
                    className="legal-toc-link"
                    style={{
                      display: 'block',
                      padding: '8px 12px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-sans)',
                      color: isActive ? 'var(--color-primary, #6B4EFF)' : 'var(--color-slate, #5A5A5A)',
                      fontWeight: isActive ? 600 : 400,
                      textDecoration: 'none',
                      borderRadius: '6px',
                      borderLeft: isActive ? '3px solid var(--color-primary, #6B4EFF)' : '3px solid transparent',
                      background: isActive ? 'rgba(107, 78, 255, 0.08)' : 'transparent',
                    }}
                  >
                    {idx + 1}. {title}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </details>

      {/* Desktop Sticky Table of Contents */}
      <aside
        className="legal-toc-desktop"
        style={{
          width: '240px',
          flexShrink: 0,
          position: 'sticky',
          top: '96px',
          alignSelf: 'flex-start',
        }}
      >
        <nav aria-label="Table of contents">
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-steel, #8A8A8A)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 12px 14px',
            }}
          >
            On this page
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {sections.map(({ id, title }, idx) => {
              const isActive = activeId === id
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => handleLinkClick(e, id)}
                    className="legal-toc-link"
                    style={{
                      display: 'block',
                      padding: '8px 12px 8px 14px',
                      fontSize: '14px',
                      lineHeight: '1.45',
                      fontFamily: 'var(--font-sans)',
                      textDecoration: 'none',
                      color: isActive ? 'var(--color-primary, #6B4EFF)' : 'var(--color-slate, #5A5A5A)',
                      fontWeight: isActive ? 600 : 400,
                      borderLeft: isActive ? '3px solid var(--color-primary, #6B4EFF)' : '3px solid transparent',
                      background: isActive ? 'rgba(107, 78, 255, 0.06)' : 'transparent',
                      borderRadius: '0 6px 6px 0',
                      transition: 'color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease',
                    }}
                  >
                    {idx + 1}. {title}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Actions below desktop TOC */}
          <div
            style={{
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid var(--color-hairline, #E8E8E5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              paddingLeft: '14px',
            }}
          >
            <button
              type="button"
              onClick={handlePrint}
              className="legal-print-btn"
              style={{
                background: 'none',
                border: 'none',
                padding: '6px 0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: 'var(--color-slate, #5A5A5A)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                textAlign: 'left',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>Print this page</span>
            </button>

            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 0',
                fontSize: '13px',
                color: 'var(--color-slate, #5A5A5A)',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Contact support</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  )
}
