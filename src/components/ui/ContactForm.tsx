'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  SUPPORT_EMAIL,
  RESPONSE_TIME,
  CONTACT_SUBJECTS,
} from '@/lib/contactConfig'

interface FormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  message: string
  website: string // honeypot
}

interface FieldErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
  [key: string]: string | undefined
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string
          callback?: (token: string) => void
          'error-callback'?: () => void
          'expired-callback'?: () => void
        }
      ) => string
      reset: (widgetId: string) => void
    }
  }
}

export default function ContactForm() {
  const [mountedAt] = useState<number>(() => Date.now())
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedData, setSubmittedData] = useState<{
    firstName: string
    email: string
  } | null>(null)
  const [genericError, setGenericError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string>('')
  const turnstileContainerRef = useRef<HTMLDivElement>(null)
  const turnstileWidgetId = useRef<string | null>(null)

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  // Load Cloudflare Turnstile only if key is configured
  useEffect(() => {
    if (!turnstileSiteKey) return

    const renderTurnstile = () => {
      if (
        window.turnstile &&
        turnstileContainerRef.current &&
        !turnstileWidgetId.current
      ) {
        try {
          turnstileWidgetId.current = window.turnstile.render(
            turnstileContainerRef.current,
            {
              sitekey: turnstileSiteKey,
              callback: (token: string) => setTurnstileToken(token),
              'expired-callback': () => setTurnstileToken(''),
              'error-callback': () => setTurnstileToken(''),
            }
          )
        } catch (err) {
          console.error('[Turnstile] render error:', err)
        }
      }
    }

    if (!document.getElementById('turnstile-script')) {
      const script = document.createElement('script')
      script.id = 'turnstile-script'
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.defer = true
      script.onload = renderTurnstile
      document.head.appendChild(script)
    } else {
      renderTurnstile()
    }
  }, [turnstileSiteKey])

  function validateField(field: keyof FormState, value: string): string | undefined {
    const val = value.trim()
    switch (field) {
      case 'firstName':
        if (!val) return 'First name is required'
        if (val.length > 60) return 'First name cannot exceed 60 characters'
        return undefined
      case 'email':
        if (!val) return 'Email address is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          return 'Please enter a valid email address'
        }
        if (val.length > 254) return 'Email cannot exceed 254 characters'
        return undefined
      case 'phone':
        if (val.length > 30) return 'Phone number cannot exceed 30 characters'
        return undefined
      case 'subject':
        if (!val) return 'Please select a subject'
        return undefined
      case 'message':
        if (!val) return 'Message is required'
        if (val.length < 20) {
          return `Please write at least 20 characters (${val.length}/20)`
        }
        if (val.length > 2000) return 'Message cannot exceed 2000 characters'
        return undefined
      default:
        return undefined
    }
  }

  function validateAll(): boolean {
    const newErrors: FieldErrors = {}
    const fieldsToValidate: (keyof FormState)[] = [
      'firstName',
      'email',
      'phone',
      'subject',
      'message',
    ]

    for (const f of fieldsToValidate) {
      const err = validateField(f, form[f])
      if (err) newErrors[f] = err
    }

    setErrors(newErrors)
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
    })

    return Object.keys(newErrors).length === 0
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    if (genericError) setGenericError(null)

    if (touched[name]) {
      const err = validateField(name as keyof FormState, value)
      setErrors((prev) => ({ ...prev, [name]: err }))
    }
  }

  function handleBlur(
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const err = validateField(name as keyof FormState, value)
    setErrors((prev) => ({ ...prev, [name]: err }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGenericError(null)

    if (!validateAll()) return

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
          website: form.website, // honeypot
          timestamp: mountedAt,
          turnstileToken,
        }),
      })

      const data = await res.json().catch(() => null)

      if (res.ok && data?.ok) {
        setSubmittedData({
          firstName: form.firstName.trim(),
          email: form.email.trim(),
        })
      } else if (res.status === 429) {
        setGenericError(
          'Too many messages sent recently. Please wait a bit or email support directly.'
        )
      } else if (data?.fields) {
        setErrors(data.fields)
      } else {
        setGenericError(
          `Something went wrong. Please try again or email ${SUPPORT_EMAIL}.`
        )
      }
    } catch {
      setGenericError(
        `Something went wrong. Please try again or email ${SUPPORT_EMAIL}.`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      website: '',
    })
    setErrors({})
    setTouched({})
    setSubmittedData(null)
    setGenericError(null)
  }

  // ── Success State ──
  if (submittedData) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px 24px',
          background: '#FFFFFF',
          borderRadius: '12px',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--color-tint-lavender, #F3F0FF)',
            color: 'var(--color-primary, #6B4EFF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h3
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--color-ink-deep, #0F0F0F)',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 12px',
            letterSpacing: '-0.3px',
          }}
        >
          Message sent
        </h3>

        <p
          style={{
            fontSize: '15px',
            color: 'var(--color-charcoal, #2F2F2F)',
            fontFamily: 'var(--font-sans)',
            lineHeight: '1.6',
            maxWidth: '480px',
            margin: '0 auto 12px',
          }}
        >
          Thanks <strong>{submittedData.firstName}</strong>, we&apos;ve received
          your message and emailed a confirmation to{' '}
          <strong>{submittedData.email}</strong>.
        </p>

        {RESPONSE_TIME && (
          <p
            style={{
              fontSize: '14px',
              color: 'var(--color-slate, #5A5A5A)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 28px',
            }}
          >
            We usually reply {RESPONSE_TIME}.
          </p>
        )}

        <button
          type="button"
          onClick={handleReset}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '44px',
            padding: '12px 28px',
            background: 'var(--color-primary, #6B4EFF)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'var(--radius-md, 8px)',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            boxShadow: '0 4px 14px rgba(107, 78, 255, 0.35)',
            transition: 'opacity 0.15s ease',
          }}
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <div data-clarity-mask="True">
      <style>{`
        .contact-field-wrap {
          margin-bottom: 20px;
        }
        .contact-input-base {
          width: 100%;
          height: 48px;
          border-radius: 8px;
          border: 1px solid var(--color-hairline, #E8E8E5);
          background: #FFFFFF;
          padding: 0 16px;
          font-size: 16px;
          color: var(--color-ink-deep, #0F0F0F);
          font-family: var(--font-sans);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          box-sizing: border-box;
        }
        .contact-input-base:focus {
          outline: none;
          border-color: var(--color-primary, #6B4EFF);
          box-shadow: 0 0 0 3px rgba(107, 78, 255, 0.15);
        }
        .contact-input-error {
          border-color: #DC2626 !important;
        }
        .contact-input-error:focus {
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15) !important;
        }
        .contact-textarea-base {
          width: 100%;
          border-radius: 8px;
          border: 1px solid var(--color-hairline, #E8E8E5);
          background: #FFFFFF;
          padding: 14px 16px;
          font-size: 16px;
          color: var(--color-ink-deep, #0F0F0F);
          font-family: var(--font-sans);
          line-height: 1.55;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          box-sizing: border-box;
          resize: vertical;
          min-height: 120px;
        }
        .contact-textarea-base:focus {
          outline: none;
          border-color: var(--color-primary, #6B4EFF);
          box-shadow: 0 0 0 3px rgba(107, 78, 255, 0.15);
        }
        .contact-grid-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .contact-grid-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>

      <h2
        style={{
          fontSize: '22px',
          fontWeight: 600,
          color: 'var(--color-ink-deep, #0F0F0F)',
          fontFamily: 'var(--font-sans)',
          margin: '0 0 24px',
          letterSpacing: '-0.3px',
        }}
      >
        Send us a message
      </h2>

      {/* Accessible status alert region */}
      <div aria-live="polite" aria-atomic="true">
        {genericError && (
          <div
            role="alert"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#B91C1C',
              fontSize: '14px',
              fontFamily: 'var(--font-sans)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
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
              style={{ flexShrink: 0 }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{genericError}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Hidden Honeypot for spam bots */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
            height: 0,
            width: 0,
            overflow: 'hidden',
          }}
        >
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, website: e.target.value }))
            }
          />
        </div>

        {/* Row: First Name & Last Name */}
        <div className="contact-grid-row">
          <div className="contact-field-wrap">
            <label
              htmlFor="firstName"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-ink-deep, #0F0F0F)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '6px',
              }}
            >
              First Name <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={errors.firstName ? 'firstName-err' : undefined}
              className={`contact-input-base ${errors.firstName ? 'contact-input-error' : ''}`}
              placeholder="Your first name"
              value={form.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.firstName && (
              <p
                id="firstName-err"
                style={{
                  fontSize: '12px',
                  color: '#DC2626',
                  fontFamily: 'var(--font-sans)',
                  margin: '6px 0 0',
                }}
              >
                {errors.firstName}
              </p>
            )}
          </div>

          <div className="contact-field-wrap">
            <label
              htmlFor="lastName"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-ink-deep, #0F0F0F)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '6px',
              }}
            >
              Last Name{' '}
              <span style={{ color: 'var(--color-slate, #5A5A5A)', fontWeight: 400 }}>
                (optional)
              </span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className="contact-input-base"
              placeholder="Your last name"
              value={form.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>

        {/* Row: Email & Phone */}
        <div className="contact-grid-row">
          <div className="contact-field-wrap">
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-ink-deep, #0F0F0F)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '6px',
              }}
            >
              Email Address <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              data-clarity-mask="True"
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-err' : undefined}
              className={`contact-input-base ${errors.email ? 'contact-input-error' : ''}`}
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && (
              <p
                id="email-err"
                style={{
                  fontSize: '12px',
                  color: '#DC2626',
                  fontFamily: 'var(--font-sans)',
                  margin: '6px 0 0',
                }}
              >
                {errors.email}
              </p>
            )}
          </div>

          <div className="contact-field-wrap">
            <label
              htmlFor="phone"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-ink-deep, #0F0F0F)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '6px',
              }}
            >
              Phone Number{' '}
              <span style={{ color: 'var(--color-slate, #5A5A5A)', fontWeight: 400 }}>
                (optional)
              </span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              data-clarity-mask="True"
              className={`contact-input-base ${errors.phone ? 'contact-input-error' : ''}`}
              placeholder="+1 234 567 8900"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.phone && (
              <p
                style={{
                  fontSize: '12px',
                  color: '#DC2626',
                  fontFamily: 'var(--font-sans)',
                  margin: '6px 0 0',
                }}
              >
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Subject Select */}
        <div className="contact-field-wrap">
          <label
            htmlFor="subject"
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-ink-deep, #0F0F0F)',
              fontFamily: 'var(--font-sans)',
              marginBottom: '6px',
            }}
          >
            Subject <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <select
              id="subject"
              name="subject"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? 'subject-err' : undefined}
              className={`contact-input-base ${errors.subject ? 'contact-input-error' : ''}`}
              value={form.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ appearance: 'none', paddingRight: '36px', cursor: 'pointer' }}
            >
              <option value="">Select a subject...</option>
              {CONTACT_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-slate, #5A5A5A)',
                pointerEvents: 'none',
                fontSize: '12px',
              }}
              aria-hidden="true"
            >
              ▾
            </span>
          </div>
          {errors.subject && (
            <p
              id="subject-err"
              style={{
                fontSize: '12px',
                color: '#DC2626',
                fontFamily: 'var(--font-sans)',
                margin: '6px 0 0',
              }}
            >
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message Textarea */}
        <div className="contact-field-wrap">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}
          >
            <label
              htmlFor="message"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-ink-deep, #0F0F0F)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Message <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <span
              style={{
                fontSize: '12px',
                color:
                  form.message.length > 2000
                    ? '#DC2626'
                    : 'var(--color-slate, #5A5A5A)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {form.message.length}/2000
            </span>
          </div>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            data-clarity-mask="True"
            aria-required="true"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-err' : undefined}
            className={`contact-textarea-base ${errors.message ? 'contact-input-error' : ''}`}
            placeholder="How can we help you? Please provide any details about courses or your account..."
            value={form.message}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.message && (
            <p
              id="message-err"
              style={{
                fontSize: '12px',
                color: '#DC2626',
                fontFamily: 'var(--font-sans)',
                margin: '6px 0 0',
              }}
            >
              {errors.message}
            </p>
          )}
        </div>

        {/* Cloudflare Turnstile placeholder container if configured */}
        {turnstileSiteKey && (
          <div style={{ marginBottom: '16px' }} ref={turnstileContainerRef} />
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            minHeight: '48px',
            background: isSubmitting
              ? 'rgba(107, 78, 255, 0.7)'
              : 'var(--color-primary, #6B4EFF)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'var(--radius-md, 8px)',
            fontSize: '15px',
            fontWeight: 600,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-sans)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 4px 14px rgba(107, 78, 255, 0.35)',
            transition: 'background 0.15s ease, opacity 0.15s ease',
          }}
        >
          {isSubmitting ? (
            <>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
                style={{
                  animation: 'spin 1s linear infinite',
                }}
              >
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              <span>Sending...</span>
            </>
          ) : (
            <span>Send Message</span>
          )}
        </button>

        {/* Consent line */}
        <p
          style={{
            fontSize: '13px',
            color: 'var(--color-slate, #5A5A5A)',
            fontFamily: 'var(--font-sans)',
            textAlign: 'center',
            margin: '14px 0 0',
            lineHeight: '1.4',
          }}
        >
          By sending this message you agree to our{' '}
          <Link
            href="/privacy"
            style={{
              color: 'var(--color-primary, #6B4EFF)',
              textDecoration: 'underline',
            }}
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </div>
  )
}
