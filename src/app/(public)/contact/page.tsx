'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'

const faqs = [
  {
    q: 'Is Panda Courses Legit?',
    a: 'Absolutely. Panda Courses is a trusted online learning platform serving thousands of students. All courses are verified and sourced from reputable mentors and creators worldwide.',
  },
  {
    q: 'Where are the Courses Stored?',
    a: 'All courses are securely stored and delivered via Google Drive with lifetime access. You can access your courses anytime, anywhere, on any device.',
  },
  {
    q: 'Can I request a course?',
    a: "Yes! We love hearing what our community wants to learn. Use the contact form above or email us directly and we'll do our best to add it to our growing library.",
  },
  {
    q: 'What is the refund policy?',
    a: "We offer a 7-day money-back guarantee on all purchases. If you're not satisfied for any reason, contact us within 7 days of purchase for a full refund — no questions asked.",
  },
  {
    q: 'How long does it take to get access?',
    a: 'Access is granted instantly upon payment confirmation. You\'ll receive a confirmation email with your course links within minutes of your purchase.',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', subject: '', message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  function validate() {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.subject) e.subject = 'Please select a subject'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) setSubmitted(true)
  }

  function handleChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0A0E1A' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="contact-hero">
        <div className="contact-dot-grid" />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <div className="contact-badge">💬 We're Here to Help</div>
          <h1 className="contact-h1">Get in Touch<br />with Us</h1>
          <p className="contact-hero-sub">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* ── Contact Cards ── */}
      <section style={{ padding: '0 32px', marginTop: '-52px', position: 'relative', zIndex: 2 }}>
        <div
          className="contact-cards-grid"
          style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}
        >
          {/* Card 1 — Call */}
          <div className="contact-card contact-card-green">
            <div className="contact-card-icon" style={{ background: 'rgba(0,232,122,0.12)', color: '#00E87A' }}>📞</div>
            <p className="contact-card-title">Call Us 24x7</p>
            <a href="tel:+447729314114" className="contact-card-value" style={{ color: '#00E87A' }}>+44 7729 314114</a>
            <p className="contact-card-sub">Available 24 hours, 7 days a week</p>
          </div>

          {/* Card 2 — Email */}
          <div className="contact-card contact-card-gold">
            <div className="contact-card-icon" style={{ background: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>✉️</div>
            <p className="contact-card-title">Write Us</p>
            <a href="mailto:help@pandacourses.com" className="contact-card-value" style={{ color: '#F5A623' }}>help@pandacourses.com</a>
            <p className="contact-card-sub">We reply within 24 hours</p>
          </div>

          {/* Card 3 — Office */}
          <div className="contact-card contact-card-blue">
            <div className="contact-card-icon" style={{ background: 'rgba(99,179,237,0.12)', color: '#63B3ED' }}>📍</div>
            <p className="contact-card-title">Main Office</p>
            <p className="contact-card-value" style={{ color: '#63B3ED', cursor: 'default' }}>11012 N Williams St</p>
            <p className="contact-card-sub">Dunnellon, Florida, USA</p>
          </div>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section style={{ padding: '96px 32px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <span className="contact-section-label">Contact Form</span>
          <h2 className="contact-section-h2">Send Us a Message</h2>
          <p className="contact-section-sub">
            Fill out the form below and our team will get back to you within 24 hours.
          </p>

          {submitted ? (
            <div className="contact-success">
              <div style={{ fontSize: '52px', marginBottom: '20px' }}>✅</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: '800', color: '#00E87A', margin: '0 0 8px' }}>
                Message Sent!
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px', fontFamily: 'var(--font-sans)', margin: 0 }}>
                We'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>

              {/* Row 1 — Name */}
              <div className="contact-form-row">
                <div className="contact-field">
                  <label className="contact-label">First Name</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className={`contact-input${errors.firstName ? ' contact-input-error' : form.firstName ? ' contact-input-valid' : ''}`}
                      type="text" placeholder="John"
                      value={form.firstName} onChange={e => handleChange('firstName', e.target.value)}
                    />
                    {!errors.firstName && form.firstName && <span className="contact-valid">✓</span>}
                  </div>
                  {errors.firstName && <span className="contact-error">{errors.firstName}</span>}
                </div>
                <div className="contact-field">
                  <label className="contact-label">Last Name</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className={`contact-input${errors.lastName ? ' contact-input-error' : form.lastName ? ' contact-input-valid' : ''}`}
                      type="text" placeholder="Doe"
                      value={form.lastName} onChange={e => handleChange('lastName', e.target.value)}
                    />
                    {!errors.lastName && form.lastName && <span className="contact-valid">✓</span>}
                  </div>
                  {errors.lastName && <span className="contact-error">{errors.lastName}</span>}
                </div>
              </div>

              {/* Row 2 — Email & Phone */}
              <div className="contact-form-row">
                <div className="contact-field">
                  <label className="contact-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className={`contact-input${errors.email ? ' contact-input-error' : form.email ? ' contact-input-valid' : ''}`}
                      type="email" placeholder="john@example.com"
                      value={form.email} onChange={e => handleChange('email', e.target.value)}
                    />
                    {!errors.email && form.email && <span className="contact-valid">✓</span>}
                  </div>
                  {errors.email && <span className="contact-error">{errors.email}</span>}
                </div>
                <div className="contact-field">
                  <label className="contact-label">
                    Phone Number{' '}
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <input
                    className="contact-input"
                    type="tel" placeholder="+1 234 567 8900"
                    value={form.phone} onChange={e => handleChange('phone', e.target.value)}
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="contact-field">
                <label className="contact-label">Subject</label>
                <div style={{ position: 'relative' }}>
                  <select
                    className={`contact-select${errors.subject ? ' contact-input-error' : form.subject ? ' contact-input-valid' : ''}`}
                    value={form.subject} onChange={e => handleChange('subject', e.target.value)}
                  >
                    <option value="">Select a subject...</option>
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Course Question</option>
                    <option>Billing Issue</option>
                    <option>Partnership</option>
                    <option>Other</option>
                  </select>
                  <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none', fontSize: '12px' }}>▾</span>
                </div>
                {errors.subject && <span className="contact-error">{errors.subject}</span>}
              </div>

              {/* Message */}
              <div className="contact-field">
                <label className="contact-label">Message</label>
                <textarea
                  className={`contact-textarea${errors.message ? ' contact-input-error' : form.message ? ' contact-input-valid' : ''}`}
                  rows={5} placeholder="Tell us how we can help you..."
                  value={form.message} onChange={e => handleChange('message', e.target.value)}
                />
                {errors.message && <span className="contact-error">{errors.message}</span>}
              </div>

              <button type="submit" className="contact-submit">Send Message →</button>
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '0 32px 96px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span className="contact-section-label" style={{ textAlign: 'center', display: 'block' }}>Support</span>
          <h2 className="contact-section-h2" style={{ textAlign: 'center' }}>Frequently Asked Questions</h2>
          <p className="contact-section-sub" style={{ textAlign: 'center', marginBottom: '48px' }}>
            Quick answers to questions you may have.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`contact-faq${openFaq === i ? ' contact-faq-open' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="contact-faq-header">
                  <span className="contact-faq-q">{faq.q}</span>
                  <span className="contact-faq-icon">{openFaq === i ? '×' : '+'}</span>
                </div>
                <div className="contact-faq-body">
                  <p className="contact-faq-a">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="contact-cta">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '680px', margin: '0 auto', padding: '0 32px' }}>
          <h2 className="contact-cta-h2">Ready to Start Learning?</h2>
          <p className="contact-cta-sub">
            Join thousands of students who are already transforming their careers with our premium courses.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/courses" className="contact-cta-btn-outline">Browse All Courses</Link>
            <Link href="/pricing" className="contact-cta-btn-filled">View Pricing</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
