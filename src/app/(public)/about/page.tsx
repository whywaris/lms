'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'

/* ── Count-Up ── */
function CountUp({ end, suffix = '' }: { end: string; suffix?: string; }) {
  const endNum = parseFloat(end)
  const isFloat = endNum % 1 !== 0
  const [display, setDisplay] = useState(isFloat ? '0.0' : '0')
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 2000
        const increment = endNum / (duration / 16)
        let cur = 0
        const timer = setInterval(() => {
          cur += increment
          if (cur >= endNum) {
            setDisplay(isFloat ? endNum.toFixed(1) : String(Math.round(endNum)))
            clearInterval(timer)
          } else {
            setDisplay(isFloat ? cur.toFixed(1) : String(Math.floor(cur)))
          }
        }, 16)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [endNum, isFloat])

  return <span ref={ref}>{display}{suffix}</span>
}

/* ── Data ── */
const stats = [
  { label: 'Students',  value: '5000', suffix: '+' },
  { label: 'Courses',   value: '500',  suffix: '+' },
  { label: 'Rating',    value: '4.8',  suffix: '★' },
  { label: 'Countries', value: '50',   suffix: '+' },
]

const values = [
  { name: 'Quality First',  color: '#00E87A', cls: 'about-val-green', icon: '⭐', desc: 'We never compromise on the depth and accuracy of our course content.' },
  { name: 'Integrity',      color: '#F5A623', cls: 'about-val-gold',  icon: '🛡️', desc: 'Honesty and transparency are the bedrock of our student relationships.' },
  { name: 'Accessibility',  color: '#00E87A', cls: 'about-val-green', icon: '🌍', desc: 'Removing every barrier — financial, geographical, or technical.' },
  { name: 'Innovation',     color: '#F5A623', cls: 'about-val-gold',  icon: '💡', desc: 'Constantly evolving our pedagogy to match the future of work.' },
  { name: 'Empowerment',    color: '#00E87A', cls: 'about-val-green', icon: '💪', desc: 'Giving students the confidence to own their professional journey.' },
  { name: 'Community',      color: '#F5A623', cls: 'about-val-gold',  icon: '🤝', desc: 'Building a global network where learners support and uplift each other.' },
]

const team = [
  { name: 'Michael Anderson', role: 'Chief Executive Officer',   initials: 'MA', bg: 'linear-gradient(135deg,#0d2137 0%,#0a3d2e 100%)' },
  { name: 'Jessica Martinez',  role: 'Chief Learning Officer',    initials: 'JM', bg: 'linear-gradient(135deg,#1f0d35 0%,#2d0a1e 100%)' },
  { name: 'David Thompson',    role: 'Head of Technology',        initials: 'DT', bg: 'linear-gradient(135deg,#0a1a2d 0%,#0d3d1a 100%)' },
  { name: 'Emily Roberts',     role: 'VP of Student Success',     initials: 'ER', bg: 'linear-gradient(135deg,#1a0d0d 0%,#2d1a0a 100%)' },
]

const milestones = [
  { year: '2022', color: '#00E87A', title: 'The Beginning',  desc: 'Launched with a single vision: quality education for every curious mind, regardless of location or budget.' },
  { year: '2023', color: '#F5A623', title: 'Early Success',  desc: 'Reached 1,000+ students and signed major industry partnerships that enriched our course library.' },
  { year: '2024', color: '#00E87A', title: 'Global Reach',   desc: 'Expanded to 50+ countries, added multilingual support, and crossed 500 exclusive premium courses.' },
  { year: '→',    color: '#F5A623', title: 'The AI Era',     desc: 'On track for 10k students, 5k courses, and AI-powered personalised learning paths for every student.' },
]

/* ── Page ── */
export default function AboutPage() {
  /* Scroll reveals */
  useEffect(() => {
    const els = document.querySelectorAll('.about-reveal-left, .about-reveal-right, .about-reveal-up')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('about-revealed')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <main style={{ background: '#0A0E1A', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="about-hero">
        <div className="about-mesh" />
        <div className="about-grid-bg" />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <span className="about-fade-up about-section-label" style={{ color: '#00E87A', animationDelay: '0s' }}>
            Est. 2022 · Premium EdTech
          </span>

          <h1
            className="about-fade-up"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(48px, 8vw, 88px)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: '-3px',
              margin: '0 0 28px',
              animationDelay: '0.15s',
            }}
          >
            We Don't Just Teach.<br />
            <span style={{ color: '#F5A623' }}>We Transform.</span>
          </h1>

          <p
            className="about-fade-up"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.7,
              maxWidth: '580px',
              margin: '0 auto 64px',
              animationDelay: '0.3s',
            }}
          >
            Founded on a simple dream — quality education for everyone, everywhere. We bridge the gap between potential and opportunity.
          </p>

          {/* Stat grid */}
          <div
            className="about-fade-up about-stats-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              animationDelay: '0.45s',
            }}
          >
            {stats.map((s, i) => (
              <div key={i} className="about-stat-card">
                <span className="about-stat-num">
                  <CountUp end={s.value} suffix={s.suffix} />
                </span>
                <span className="about-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OUR STORY ══ */}
      <section style={{ padding: '100px 32px', maxWidth: '1280px', margin: '0 auto' }}>
        <div
          className="about-story-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}
        >
          {/* Left — text */}
          <div className="about-reveal-left">
            <span className="about-section-label" style={{ color: '#00E87A' }}>Our Story</span>
            <h2 className="about-story-h2">
              It started with a <span className="about-highlight">simple vision</span>: your location shouldn't limit your{' '}
              <span className="about-highlight">destiny</span>.
            </h2>
            <p className="about-body">
              In 2022, Panda Courses was born out of a small apartment and a big idea. We saw brilliant minds held back by outdated curricula and inaccessible price tags.
            </p>
            <p className="about-body">
              Today we are a global community — combining the rigour of traditional academics with the speed of industry innovation, delivered through a premium digital experience.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '32px' }}>
              {['Industry Experts', 'Lifetime Access', 'Certificates', '24/7 Support'].map(c => (
                <span key={c} className="about-chip">{c}</span>
              ))}
            </div>
          </div>

          {/* Right — image */}
          <div className="about-reveal-right" style={{ position: 'relative' }}>
            <div style={{
              aspectRatio: '4/5',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, #0A0E1A 0%, transparent 50%)',
                zIndex: 1,
              }} />
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                alt="Panda Courses team"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div className="about-est-badge">EST. 2022</div>
          </div>
        </div>
      </section>

      {/* ══ MISSION & VISION ══ */}
      <section style={{ background: '#0F1628', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="about-section-label about-reveal-up" style={{ color: '#F5A623' }}>Purpose</span>
            <h2 className="about-section-h2 about-reveal-up" style={{ transitionDelay: '0.1s' }}>Mission &amp; Vision</h2>
          </div>
          <div
            className="about-mv-grid"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}
          >
            <div className="about-mv-card about-mv-green about-reveal-left">
              <div className="about-mv-icon" style={{ background: 'rgba(0,232,122,0.1)' }}>🚀</div>
              <h3 className="about-mv-h3">Our Mission</h3>
              <p className="about-mv-p">
                To democratise high-end education by providing accessible, practical, and career-transforming skills to every curious mind on the planet.
              </p>
            </div>
            <div className="about-mv-card about-mv-gold about-reveal-right">
              <div className="about-mv-icon" style={{ background: 'rgba(245,166,35,0.1)' }}>👁️</div>
              <h3 className="about-mv-h3">Our Vision</h3>
              <p className="about-mv-p">
                To be the world's most trusted learning platform — where technology and human passion converge to close the global skills gap permanently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CORE VALUES ══ */}
      <section style={{ padding: '100px 32px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="about-section-label about-reveal-up" style={{ color: '#F5A623' }}>Core Values</span>
          <h2 className="about-section-h2 about-reveal-up" style={{ transitionDelay: '0.1s' }}>What Drives Us</h2>
        </div>
        <div
          className="about-values-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}
        >
          {values.map((v, i) => (
            <div key={i} className={`about-value-card ${v.cls} about-reveal-up`} style={{ transitionDelay: `${i * 0.08}s` }}>
              <span className="about-value-icon">{v.icon}</span>
              <p className="about-value-name" style={{ color: v.color }}>{v.name}</p>
              <p className="about-value-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TEAM ══ */}
      <section style={{ background: '#0F1628', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', marginBottom: '56px' }}>
            <div className="about-reveal-left">
              <span className="about-section-label" style={{ color: '#00E87A' }}>The Architects</span>
              <h2 className="about-section-h2">Passionate People</h2>
            </div>
            <p className="about-reveal-right" style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', color: 'rgba(255,255,255,0.42)', maxWidth: '380px', lineHeight: 1.7, margin: 0 }}>
              Meet the minds behind the magic — a diverse team of educators, engineers, and visionaries.
            </p>
          </div>

          <div
            className="about-team-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}
          >
            {team.map((m, i) => (
              <div key={i} className="about-team-card about-reveal-up" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="about-team-avatar" style={{ background: m.bg }}>
                  <span className="about-team-initials">{m.initials}</span>
                </div>
                <div className="about-team-overlay" />
                <div className="about-team-info">
                  <p className="about-team-name">{m.name}</p>
                  <p className="about-team-role">{m.role}</p>
                  <div className="about-team-socials">
                    <a href="#" className="about-social">LinkedIn</a>
                    <a href="#" className="about-social">Twitter</a>
                    <a href="#" className="about-social">GitHub</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MILESTONES ══ */}
      <section style={{ padding: '100px 32px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <span className="about-section-label about-reveal-up" style={{ color: '#F5A623' }}>Our Journey</span>
          <h2 className="about-section-h2 about-reveal-up" style={{ transitionDelay: '0.1s' }}>Key Milestones</h2>
        </div>

        <div className="about-timeline-wrap">
          <div className="about-timeline-line" />
          {milestones.map((m, i) => {
            const isLeft = i % 2 === 0
            return (
              <div key={i} className="about-timeline-row">
                {isLeft ? (
                  <>
                    <div className="about-milestone about-reveal-left" style={{ transitionDelay: `${i * 0.1}s` }}>
                      <span className="about-milestone-year" style={{ color: m.color }}>{m.year}</span>
                      <h5 className="about-milestone-title">{m.title}</h5>
                      <p className="about-milestone-desc">{m.desc}</p>
                    </div>
                    <div className="about-timeline-dot" />
                    <div className="about-milestone-spacer" />
                  </>
                ) : (
                  <>
                    <div className="about-milestone-spacer" />
                    <div className="about-timeline-dot" />
                    <div className="about-milestone about-reveal-right" style={{ transitionDelay: `${i * 0.1}s` }}>
                      <span className="about-milestone-year" style={{ color: m.color }}>{m.year}</span>
                      <h5 className="about-milestone-title">{m.title}</h5>
                      <p className="about-milestone-desc">{m.desc}</p>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ padding: '0 32px 100px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="about-cta-wrap about-reveal-up">
            <h2 className="about-cta-h2">Ready to Start Learning?</h2>
            <p className="about-cta-sub">Join 5,000+ students already transforming their careers</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
              <Link href="/courses" className="about-cta-fill">Explore Courses</Link>
              <Link href="/contact" className="about-cta-outline">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
