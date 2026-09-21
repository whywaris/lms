import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'
import ContactForm from '@/components/ui/ContactForm'
import {
  BUSINESS_NAME,
  SUPPORT_EMAIL,
  DMCA_EMAIL,
  WHATSAPP_URL,
  DEFAULT_WHATSAPP_URL,
  PHONE_DISPLAY,
  RESPONSE_TIME,
  SUPPORT_HOURS,
  ADDRESS_LINES,
} from '@/lib/contactConfig'
import { REFUND_MODE } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Contact Us | PandaCourses',
  description:
    'Get in touch with the PandaCourses team. Have questions about a course, order delivery, or need support? We are here to help.',
  alternates: {
    canonical: 'https://pandacourses.com/contact',
  },
}

export default function ContactPage() {
  const effectiveWhatsApp = WHATSAPP_URL || DEFAULT_WHATSAPP_URL

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact Us | ${BUSINESS_NAME}`,
    description: `Get in touch with the ${BUSINESS_NAME} support team.`,
    url: 'https://pandacourses.com/contact',
  }

  const refundFaqAnswer =
    REFUND_MODE === '7day'
      ? 'We offer a 7-day money-back guarantee on all courses. If you are not satisfied with your purchase, simply contact us within 7 days for assistance. Please check our Refund Policy for complete details.'
      : 'Due to the digital and instant download nature of our course materials, all sales are final once access links have been provided, except in exceptional circumstances like verified duplicate transactions. Please review our Refund Policy for details.'

  return (
    <main style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <style>{`
        .contact-layout-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 36px;
          align-items: start;
        }
        @media (max-width: 960px) {
          .contact-layout-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
        details.faq-item summary::-webkit-details-marker {
          display: none;
        }
        details.faq-item[open] .faq-chevron {
          transform: rotate(180deg);
        }
      `}</style>

      {/* ── 1. Hero Band (Dark Navy) ── */}
      <section
        style={{
          background: 'linear-gradient(180deg, #070B14 0%, #0B101D 100%)',
          position: 'relative',
          overflow: 'hidden',
          padding: '64px 24px 72px',
          textAlign: 'center',
        }}
      >
        {/* Subtle purple radial glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '640px',
            height: '320px',
            background:
              'radial-gradient(ellipse at center, rgba(107, 78, 255, 0.2) 0%, rgba(107, 78, 255, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '720px',
            margin: '0 auto',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(107, 78, 255, 0.12)',
              border: '1px solid rgba(107, 78, 255, 0.28)',
              color: '#BDB4FE',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'var(--font-sans)',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--color-primary, #6B4EFF)',
                display: 'inline-block',
              }}
            />
            Support & Inquiries
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 44px)',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 16px',
              letterSpacing: '-0.8px',
              lineHeight: 1.15,
            }}
          >
            Contact Us
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '16px',
              color: '#94A3B8',
              fontFamily: 'var(--font-sans)',
              lineHeight: 1.6,
              margin: '0 auto 20px',
              maxWidth: '580px',
            }}
          >
            Have a question about a course, order delivery, or need support? Send
            us a message or reach out via our direct channels.
          </p>

          {/* Reassurance pill */}
          {RESPONSE_TIME && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#E2E8F0',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6B4EFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Typical response time: {RESPONSE_TIME}</span>
            </div>
          )}
        </div>
      </section>

      {/* ── 2. Two-Column Main Section (Light Body) ── */}
      <section
        style={{
          background: '#F8F9FA',
          borderTop: '1px solid #E2E8F0',
          borderBottom: '1px solid #E2E8F0',
          padding: '64px 24px 80px',
        }}
      >
        <div
          style={{
            maxWidth: '1160px',
            margin: '0 auto',
          }}
        >
          <div className="contact-layout-grid">
            {/* Left Column: Direct channels & Quick help */}
            <div>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--color-ink-deep, #0F0F0F)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0 0 20px',
                  letterSpacing: '-0.3px',
                }}
              >
                Other ways to reach us
              </h2>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* WhatsApp Card (Primary direct channel) */}
                {effectiveWhatsApp && (
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      padding: '20px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '10px',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: '#E6F9EE',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#25D366',
                        }}
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                      </div>
                      <div>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '15px',
                            fontWeight: 600,
                            color: 'var(--color-ink-deep, #0F0F0F)',
                            fontFamily: 'var(--font-sans)',
                          }}
                        >
                          Chat on WhatsApp
                        </span>
                        {PHONE_DISPLAY && (
                          <span
                            style={{
                              fontSize: '13px',
                              color: 'var(--color-slate, #5A5A5A)',
                              fontFamily: 'var(--font-sans)',
                            }}
                          >
                            {PHONE_DISPLAY}
                          </span>
                        )}
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: '13px',
                        color: 'var(--color-charcoal, #2F2F2F)',
                        fontFamily: 'var(--font-sans)',
                        lineHeight: 1.5,
                        margin: '0 0 14px',
                      }}
                    >
                      Quickest replies for pre-purchase questions, payment
                      assistance, and instant download access.
                    </p>

                    <a
                      href={effectiveWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        width: '100%',
                        minHeight: '40px',
                        background: '#25D366',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        fontFamily: 'var(--font-sans)',
                        transition: 'opacity 0.15s ease',
                      }}
                    >
                      <span>Open WhatsApp</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                )}

                {/* Email Card */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'var(--color-tint-lavender, #F3F0FF)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-primary, #6B4EFF)',
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div>
                      <span
                        style={{
                          display: 'block',
                          fontSize: '15px',
                          fontWeight: 600,
                          color: 'var(--color-ink-deep, #0F0F0F)',
                          fontFamily: 'var(--font-sans)',
                        }}
                      >
                        Email Support
                      </span>
                      <a
                        href={`mailto:${SUPPORT_EMAIL}`}
                        style={{
                          fontSize: '13px',
                          color: 'var(--color-primary, #6B4EFF)',
                          textDecoration: 'none',
                          fontWeight: 500,
                          fontFamily: 'var(--font-sans)',
                          wordBreak: 'break-all',
                        }}
                      >
                        {SUPPORT_EMAIL}
                      </a>
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-slate, #5A5A5A)',
                      fontFamily: 'var(--font-sans)',
                      lineHeight: 1.5,
                      margin: '10px 0 0',
                    }}
                  >
                    For order questions, billing inquiries, or general support.
                    {DMCA_EMAIL && (
                      <>
                        <br />
                        <span style={{ fontSize: '12px' }}>
                          DMCA & Copyright notices:{' '}
                          <a
                            href={`mailto:${DMCA_EMAIL}`}
                            style={{
                              color: 'var(--color-primary, #6B4EFF)',
                              textDecoration: 'none',
                            }}
                          >
                            {DMCA_EMAIL}
                          </a>
                        </span>
                      </>
                    )}
                  </p>
                </div>

                {/* Support Hours (Only if defined) */}
                {SUPPORT_HOURS && (
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: '#F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748B',
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <span
                        style={{
                          display: 'block',
                          fontSize: '12px',
                          color: 'var(--color-slate, #5A5A5A)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          fontWeight: 600,
                        }}
                      >
                        Support Hours
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          color: 'var(--color-ink-deep, #0F0F0F)',
                          fontWeight: 500,
                        }}
                      >
                        {SUPPORT_HOURS}
                      </span>
                    </div>
                  </div>
                )}

                {/* Office Location (Only if defined) */}
                {ADDRESS_LINES.length > 0 && (
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      padding: '16px 20px',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        color: 'var(--color-slate, #5A5A5A)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontWeight: 600,
                        marginBottom: '4px',
                      }}
                    >
                      Office Address
                    </span>
                    {ADDRESS_LINES.map((line, idx) => (
                      <p
                        key={idx}
                        style={{
                          fontSize: '14px',
                          color: 'var(--color-ink-deep, #0F0F0F)',
                          margin: 0,
                          lineHeight: 1.4,
                        }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                )}

                {/* Quick Help Card */}
                <div
                  style={{
                    background: '#F1F5F9',
                    borderRadius: '12px',
                    border: '1px dashed #CBD5E1',
                    padding: '18px 20px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--color-ink-deep, #0F0F0F)',
                      fontFamily: 'var(--font-sans)',
                      margin: '0 0 10px',
                    }}
                  >
                    Check if your question is answered:
                  </p>
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <li>
                      <Link
                        href="/how-to-buy"
                        style={{
                          fontSize: '13px',
                          color: 'var(--color-primary, #6B4EFF)',
                          textDecoration: 'none',
                          fontWeight: 500,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>How course access & Google Drive work</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/pricing"
                        style={{
                          fontSize: '13px',
                          color: 'var(--color-primary, #6B4EFF)',
                          textDecoration: 'none',
                          fontWeight: 500,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>Lifetime package pricing & features</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/refund-policy"
                        style={{
                          fontSize: '13px',
                          color: 'var(--color-primary, #6B4EFF)',
                          textDecoration: 'none',
                          fontWeight: 500,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>Refund Policy & eligibility</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Form Card */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '36px 32px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              }}
            >
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FAQ Section (Native details / summary) ── */}
      <section
        style={{
          padding: '72px 24px 80px',
          background: '#FFFFFF',
        }}
      >
        <div
          style={{
            maxWidth: '760px',
            margin: '0 auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--color-ink-deep, #0F0F0F)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 10px',
                letterSpacing: '-0.4px',
              }}
            >
              Frequently Asked Questions
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: 'var(--color-slate, #5A5A5A)',
                fontFamily: 'var(--font-sans)',
                margin: 0,
              }}
            >
              Quick answers to common questions about our courses and access.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* FAQ 1 */}
            <details
              className="faq-item"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <summary
                style={{
                  padding: '18px 20px',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: 'var(--color-ink-deep, #0F0F0F)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <span>Where are the courses stored and how do I access them?</span>
                <svg
                  className="faq-chevron"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    marginLeft: '12px',
                    transition: 'transform 0.2s ease',
                    color: '#64748B',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div
                style={{
                  padding: '0 20px 20px',
                  color: 'var(--color-charcoal, #2F2F2F)',
                  fontSize: '15px',
                  lineHeight: 1.6,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                All courses are securely hosted on Google Drive with lifetime
                access. You can stream videos or download materials to your computer,
                tablet, or mobile device at any time.
              </div>
            </details>

            {/* FAQ 2 */}
            <details
              className="faq-item"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <summary
                style={{
                  padding: '18px 20px',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: 'var(--color-ink-deep, #0F0F0F)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <span>How long does it take to get access after payment?</span>
                <svg
                  className="faq-chevron"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    marginLeft: '12px',
                    transition: 'transform 0.2s ease',
                    color: '#64748B',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div
                style={{
                  padding: '0 20px 20px',
                  color: 'var(--color-charcoal, #2F2F2F)',
                  fontSize: '15px',
                  lineHeight: 1.6,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Access is delivered automatically within minutes of successful
                payment confirmation. You will receive an email containing your
                direct access links. If you ever misplace an email, send us a
                message with your purchase email address and we will resend it.
              </div>
            </details>

            {/* FAQ 3 */}
            <details
              className="faq-item"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <summary
                style={{
                  padding: '18px 20px',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: 'var(--color-ink-deep, #0F0F0F)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <span>What is your refund policy?</span>
                <svg
                  className="faq-chevron"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    marginLeft: '12px',
                    transition: 'transform 0.2s ease',
                    color: '#64748B',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div
                style={{
                  padding: '0 20px 20px',
                  color: 'var(--color-charcoal, #2F2F2F)',
                  fontSize: '15px',
                  lineHeight: 1.6,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {refundFaqAnswer}{' '}
                <Link
                  href="/refund-policy"
                  style={{
                    color: 'var(--color-primary, #6B4EFF)',
                    textDecoration: 'underline',
                  }}
                >
                  Read full policy
                </Link>
                .
              </div>
            </details>

            {/* FAQ 4 */}
            <details
              className="faq-item"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <summary
                style={{
                  padding: '18px 20px',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: 'var(--color-ink-deep, #0F0F0F)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <span>Can I request a course that is not currently listed?</span>
                <svg
                  className="faq-chevron"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    marginLeft: '12px',
                    transition: 'transform 0.2s ease',
                    color: '#64748B',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div
                style={{
                  padding: '0 20px 20px',
                  color: 'var(--color-charcoal, #2F2F2F)',
                  fontSize: '15px',
                  lineHeight: 1.6,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Yes! We frequently expand our course library based on requests.
                Select &quot;Request a course&quot; in the form above and provide the course
                title or mentor name, and our team will evaluate adding it.
              </div>
            </details>

            {/* FAQ 5 */}
            <details
              className="faq-item"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <summary
                style={{
                  padding: '18px 20px',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: 'var(--color-ink-deep, #0F0F0F)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <span>How do I submit a DMCA or copyright inquiry?</span>
                <svg
                  className="faq-chevron"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    marginLeft: '12px',
                    transition: 'transform 0.2s ease',
                    color: '#64748B',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div
                style={{
                  padding: '0 20px 20px',
                  color: 'var(--color-charcoal, #2F2F2F)',
                  fontSize: '15px',
                  lineHeight: 1.6,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Please select &quot;Copyright / DMCA notice&quot; in the contact form or email{' '}
                <a
                  href={`mailto:${DMCA_EMAIL}`}
                  style={{
                    color: 'var(--color-primary, #6B4EFF)',
                    textDecoration: 'underline',
                  }}
                >
                  {DMCA_EMAIL}
                </a>{' '}
                with the relevant course URL and proof of ownership. We review and
                process legitimate notices promptly in accordance with our{' '}
                <Link
                  href="/terms"
                  style={{
                    color: 'var(--color-primary, #6B4EFF)',
                    textDecoration: 'underline',
                  }}
                >
                  Terms of Service
                </Link>
                .
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ── 4. Bottom CTA Band (Dark Navy) ── */}
      <section
        style={{
          background: 'linear-gradient(180deg, #0B101D 0%, #070B14 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '64px 24px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(24px, 4vw, 32px)',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 14px',
              letterSpacing: '-0.5px',
            }}
          >
            Ready to start learning?
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: '#94A3B8',
              fontFamily: 'var(--font-sans)',
              lineHeight: 1.6,
              margin: '0 auto 28px',
              maxWidth: '520px',
            }}
          >
            Explore our curated catalog of practical, mentor-led courses with
            instant lifetime Google Drive access.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/courses"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '44px',
                padding: '12px 24px',
                background: 'var(--color-primary, #6B4EFF)',
                color: '#FFFFFF',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                boxShadow: '0 4px 14px rgba(107, 78, 255, 0.35)',
              }}
            >
              Browse All Courses
            </Link>
            <Link
              href="/pricing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '44px',
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
              }}
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
