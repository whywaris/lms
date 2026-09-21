import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'
import LegalTableOfContents, { LegalTocSection } from '@/components/ui/LegalTableOfContents'
import LegalProgressBar from '@/components/ui/LegalProgressBar'

export interface LegalSummaryItem {
  icon: 'file' | 'lock' | 'mail' | 'help'
  title?: string
  text: string
}

export interface LegalSection {
  id: string
  title: string
  content: React.ReactNode
  tone?: 'default' | 'info' | 'warning'
}

export interface LegalPageLayoutProps {
  title: string
  subtitle?: string
  lastUpdated: string
  readTime?: string
  summary?: LegalSummaryItem[]
  sections: LegalSection[]
  showContactCta?: boolean
}

/* ═══════════════════════════════════════════════════
   HELPER 1: LegalList (Custom purple bullet list)
   ═══════════════════════════════════════════════════ */
export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: '16px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {items.map((item, idx) => (
        <li
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            fontSize: '16px',
            lineHeight: '1.75',
            color: 'var(--color-charcoal, #2F2F2F)',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: '7px' }}
          >
            <circle cx="8" cy="8" r="3.5" fill="var(--color-primary, #6B4EFF)" />
          </svg>
          <div style={{ flex: 1, fontFamily: 'var(--font-sans)' }}>{item}</div>
        </li>
      ))}
    </ul>
  )
}

/* ═══════════════════════════════════════════════════
   HELPER 2: LegalTable (Responsive table -> stacked cards)
   ═══════════════════════════════════════════════════ */
export interface LegalTableProps {
  columns: string[]
  rows: (React.ReactNode | string)[][]
}

export function LegalTable({ columns, rows }: LegalTableProps) {
  return (
    <div style={{ margin: '24px 0' }}>
      {/* Desktop Table */}
      <div
        className="legal-table-desktop-wrap"
        style={{
          width: '100%',
          border: '1px solid var(--color-hairline, #E8E8E5)',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <thead>
            <tr style={{ background: 'var(--color-surface, #F7F7F5)', borderBottom: '1px solid var(--color-hairline, #E8E8E5)' }}>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: '14px 18px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-ink-deep, #0F0F0F)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                style={{
                  borderTop: rIdx > 0 ? '1px solid var(--color-hairline, #E8E8E5)' : 'none',
                }}
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    style={{
                      padding: '14px 18px',
                      fontSize: '14px',
                      color: 'var(--color-charcoal, #2F2F2F)',
                      lineHeight: '1.55',
                      verticalAlign: 'top',
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards (<640px) */}
      <div className="legal-table-mobile-wrap">
        {rows.map((row, rIdx) => (
          <div
            key={rIdx}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--color-hairline, #E8E8E5)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            {row.map((cell, cIdx) => (
              <div key={cIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--color-steel, #8A8A8A)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {columns[cIdx] || ''}
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-charcoal, #2F2F2F)',
                    lineHeight: '1.5',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {cell}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   HELPER 3: LegalCards (Responsive card grid)
   ═══════════════════════════════════════════════════ */
export interface LegalCardItem {
  title: string
  text: string
}

export interface LegalCardsProps {
  items: LegalCardItem[]
}

export function LegalCards({ items }: LegalCardsProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        margin: '20px 0',
      }}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          style={{
            background: 'var(--color-surface, #F7F7F5)',
            border: '1px solid var(--color-hairline, #E8E8E5)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--color-ink-deep, #0F0F0F)',
              fontFamily: 'var(--font-sans)',
              margin: 0,
            }}
          >
            {item.title}
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--color-slate, #5A5A5A)',
              fontFamily: 'var(--font-sans)',
              lineHeight: '1.55',
              margin: 0,
            }}
          >
            {item.text}
          </p>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   SUMMARY ICONS (Consistent 1.75 stroke, inline SVG)
   ═══════════════════════════════════════════════════ */
function SummaryIcon({ icon }: { icon: 'file' | 'lock' | 'mail' | 'help' }) {
  if (icon === 'file') {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-primary, #6B4EFF)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    )
  }
  if (icon === 'lock') {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-primary, #6B4EFF)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    )
  }
  if (icon === 'mail') {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-primary, #6B4EFF)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    )
  }
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-primary, #6B4EFF)"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function ToneInfoIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-primary, #6B4EFF)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

function ToneWarningIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#F59E0B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT: LegalPageLayout
   ═══════════════════════════════════════════════════ */
export default function LegalPageLayout({
  title,
  subtitle,
  lastUpdated,
  readTime,
  summary,
  sections,
  showContactCta = false,
}: LegalPageLayoutProps) {
  const tocSections: LegalTocSection[] = sections.map((s) => ({
    id: s.id,
    title: s.title,
  }))

  const hasSummary = summary && summary.length > 0

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        background: 'var(--color-canvas, #FFFFFF)',
      }}
    >
      {/* Top Reading Progress Bar */}
      <LegalProgressBar />

      <style>{`
        /* Smooth scroll scoped to legal layout headings */
        html {
          scroll-behavior: smooth;
        }

        .legal-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .legal-layout-columns {
          display: flex;
          gap: 48px;
          align-items: flex-start;
          width: 100%;
        }

        .legal-toc-desktop {
          display: block;
        }

        .legal-toc-mobile {
          display: none;
        }

        .legal-content-column {
          max-width: 760px;
          width: 100%;
          flex: 1;
          min-width: 0;
        }

        .legal-content-column p {
          color: var(--color-charcoal, #2F2F2F);
          font-size: 16px;
          line-height: 1.75;
          margin: 0 0 16px;
          font-family: var(--font-sans);
        }

        .legal-content-column strong {
          color: var(--color-ink-deep, #0F0F0F);
          font-weight: 600;
        }

        .legal-content-column a {
          color: var(--color-primary, #6B4EFF);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .legal-content-column a:hover {
          opacity: 0.85;
        }

        .legal-anchor-link {
          opacity: 0;
          color: var(--color-primary, #6B4EFF);
          text-decoration: none;
          font-weight: 400;
          font-size: 18px;
          padding: 0 4px;
          transition: opacity 0.15s ease;
          user-select: none;
        }

        .legal-section-h2:hover .legal-anchor-link,
        .legal-anchor-link:focus-visible {
          opacity: 1;
        }

        .legal-toc-link:focus-visible,
        .legal-cta-btn:focus-visible,
        .legal-print-btn:focus-visible,
        .legal-content-column a:focus-visible {
          outline: 2px solid var(--color-primary, #6B4EFF);
          outline-offset: 2px;
        }

        @media (min-width: 640px) {
          .legal-table-desktop-wrap {
            display: block !important;
          }
          .legal-table-mobile-wrap {
            display: none !important;
          }
        }

        @media (max-width: 639px) {
          .legal-table-desktop-wrap {
            display: none !important;
          }
          .legal-table-mobile-wrap {
            display: flex !important;
            flex-direction: column;
            gap: 12px;
          }
        }

        @media (max-width: 1023px) {
          .legal-layout-columns {
            display: block !important;
          }
          .legal-toc-desktop {
            display: none !important;
          }
          .legal-toc-mobile {
            display: block !important;
          }
        }

        @media (max-width: 768px) {
          .legal-summary-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto !important;
          }
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        @media print {
          header, nav, footer,
          .legal-toc-desktop, .legal-toc-mobile,
          .legal-progress-bar, .site-back-to-top,
          .legal-cta-card, .announcement-bar,
          a[aria-label="Contact us on WhatsApp"],
          .legal-print-btn, .legal-anchor-link {
            display: none !important;
          }
          body, main {
            background: #ffffff !important;
            color: #000000 !important;
            font-size: 12pt !important;
          }
          .legal-layout-columns {
            display: block !important;
          }
          .legal-content-column {
            max-width: 100% !important;
            width: 100% !important;
          }
          .legal-section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          a[href^="http"]:after {
            content: " (" attr(href) ")";
            font-size: 10pt;
            color: #444;
          }
          a[href^="/"]:after {
            content: " (https://pandacourses.com" attr(href) ")";
            font-size: 10pt;
            color: #444;
          }
        }
      `}</style>

      <Navbar />

      {/* ── 1. Compact Dark Hero Band (~200px) ── */}
      <section
        style={{
          background: 'radial-gradient(circle at 85% 20%, rgba(107, 78, 255, 0.25) 0%, transparent 60%), var(--color-brand-navy, #1A1A2E)',
          padding: hasSummary ? '56px 24px 76px' : '56px 24px 56px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#C4B5FD',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 10px',
            }}
          >
            LEGAL
          </p>
          <h1
            style={{
              fontSize: 'clamp(30px, 4.5vw, 40px)',
              fontWeight: 600,
              color: 'var(--color-on-dark, #FFFFFF)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 10px',
              letterSpacing: '-0.6px',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              style={{
                fontSize: '15px',
                color: 'var(--color-on-dark-muted, rgba(255, 255, 255, 0.7))',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 16px',
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Meta row: pills for Last Updated and Read Time */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full, 9999px)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                fontSize: '12px',
                color: 'var(--color-on-dark-muted, rgba(255, 255, 255, 0.8))',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Last updated: {lastUpdated}
            </span>
            {readTime && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full, 9999px)',
                  background: 'rgba(107, 78, 255, 0.16)',
                  border: '1px solid rgba(107, 78, 255, 0.3)',
                  fontSize: '12px',
                  color: '#E0D8FF',
                  fontWeight: 500,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                ⏱ {readTime}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── 2. Summary Cards (overlapping hero edge by ~40px) ── */}
      {hasSummary && (
        <section
          style={{
            maxWidth: '1120px',
            width: '100%',
            margin: '-40px auto 0',
            padding: '0 24px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div className="legal-summary-grid">
            {summary.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--color-hairline, #E8E8E5)',
                  borderRadius: '12px',
                  padding: '22px 20px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--color-tint-lavender, #F3F0FF)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <SummaryIcon icon={item.icon} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {item.title && (
                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--color-ink-deep, #0F0F0F)',
                        fontFamily: 'var(--font-sans)',
                        marginBottom: '4px',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'var(--color-slate, #5A5A5A)',
                      fontFamily: 'var(--font-sans)',
                      lineHeight: 1.5,
                    }}
                  >
                    {item.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 3. Main Body Grid (1120px centered, 64px 24px padding) ── */}
      <section
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '1120px',
          margin: '0 auto',
          padding: hasSummary ? '56px 24px 80px' : '64px 24px 80px',
        }}
      >
        <div className="legal-layout-columns">
          {/* Left Table of Contents */}
          <LegalTableOfContents sections={tocSections} />

          {/* Right Content Column */}
          <div className="legal-content-column">
            {sections.map((section, idx) => {
              const isLast = idx === sections.length - 1
              const hasTone = section.tone === 'info' || section.tone === 'warning'
              const isWarning = section.tone === 'warning'

              return (
                <article
                  key={section.id}
                  id={section.id}
                  className="legal-section"
                  style={{
                    scrollMarginTop: '96px',
                    paddingBottom: isLast ? '0' : '48px',
                    marginBottom: isLast ? '0' : '48px',
                    borderBottom: isLast ? 'none' : '1px solid var(--color-hairline, #E8E8E5)',
                  }}
                >
                  {/* Heading row with number badge, H2, and hover anchor */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '18px',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: 'var(--color-tint-lavender, #F3F0FF)',
                        color: 'var(--color-primary, #6B4EFF)',
                        fontSize: '13px',
                        fontWeight: 700,
                        flexShrink: 0,
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <h2
                      className="legal-section-h2"
                      style={{
                        fontSize: '24px',
                        fontWeight: 600,
                        color: 'var(--color-ink-deep, #0F0F0F)',
                        fontFamily: 'var(--font-sans)',
                        letterSpacing: '-0.3px',
                        lineHeight: 1.3,
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{section.title}</span>
                      <a
                        href={`#${section.id}`}
                        className="legal-anchor-link"
                        aria-label={`Link to section ${section.title}`}
                      >
                        #
                      </a>
                    </h2>
                  </div>

                  {/* Section Content (callout box if tone is info/warning) */}
                  {hasTone ? (
                    <div
                      style={{
                        background: isWarning ? 'rgba(245, 166, 35, 0.08)' : 'rgba(107, 78, 255, 0.06)',
                        border: isWarning ? '1px solid rgba(245, 166, 35, 0.3)' : '1px solid rgba(107, 78, 255, 0.2)',
                        borderLeft: isWarning ? '3px solid #F59E0B' : '3px solid var(--color-primary, #6B4EFF)',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                      }}
                    >
                      <div style={{ flexShrink: 0, marginTop: '2px' }}>
                        {isWarning ? <ToneWarningIcon /> : <ToneInfoIcon />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {section.content}
                      </div>
                    </div>
                  ) : (
                    <div>{section.content}</div>
                  )}
                </article>
              )
            })}

            {/* ── 8. Bottom Contact Support CTA ── */}
            {showContactCta && (
              <div
                className="legal-cta-card"
                style={{
                  marginTop: '56px',
                  padding: '36px 32px',
                  background: 'linear-gradient(135deg, var(--color-brand-navy, #1A1A2E) 0%, #251D4A 100%)',
                  borderRadius: '16px',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '22px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    margin: '0 0 8px',
                    letterSpacing: '-0.3px',
                  }}
                >
                  Still have questions?
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '15px',
                    color: 'var(--color-on-dark-muted, rgba(255, 255, 255, 0.7))',
                    margin: '0 0 24px',
                    lineHeight: 1.5,
                  }}
                >
                  Our support team is here to help.
                </p>
                <Link
                  href="/contact"
                  className="legal-cta-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '44px',
                    padding: '12px 32px',
                    background: 'var(--color-primary, #6B4EFF)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-md, 8px)',
                    fontSize: '15px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontFamily: 'var(--font-sans)',
                    boxShadow: '0 4px 16px rgba(107, 78, 255, 0.4)',
                    transition: 'opacity 0.15s ease',
                  }}
                >
                  Contact Support
                </Link>

                <div
                  style={{
                    marginTop: '28px',
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap',
                  }}
                >
                  <Link
                    href="/terms"
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-on-dark-muted, rgba(255, 255, 255, 0.6))',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Terms of Service
                  </Link>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '12px' }}>•</span>
                  <Link
                    href="/privacy"
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-on-dark-muted, rgba(255, 255, 255, 0.6))',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Privacy Policy
                  </Link>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '12px' }}>•</span>
                  <Link
                    href="/refund-policy"
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-on-dark-muted, rgba(255, 255, 255, 0.6))',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Refund Policy
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
