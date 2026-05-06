import Link from 'next/link'

export default function Hero() {
  return (
    <section style={{
      background: 'var(--color-brand-navy)',
      padding: '120px 32px',
      textAlign: 'center',
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(107, 78, 255, 0.2)',
          border: '1px solid rgba(107, 78, 255, 0.4)',
          color: '#A78BFA',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          fontSize: '13px',
          fontWeight: '500',
          fontFamily: 'var(--font-sans)',
          marginBottom: '32px',
        }}>
          🚀 Pakistan's #1 Developer Learning Platform
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: '600',
          color: 'var(--color-on-dark)',
          lineHeight: '1.05',
          letterSpacing: '-2px',
          fontFamily: 'var(--font-sans)',
          margin: '0 0 24px',
        }}>
          Learn with Real Projects,<br />
          Build Real Skills
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '18px',
          color: 'var(--color-on-dark-muted)',
          lineHeight: '1.6',
          fontFamily: 'var(--font-sans)',
          margin: '0 0 48px',
          maxWidth: '560px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Master Next.js, Supabase, React, and more — 
          from beginner to production-ready, step-by-step in Urdu.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '64px',
        }}>
          <Link href="/courses" style={{
            background: 'var(--color-primary)',
            color: 'var(--color-on-dark)',
            padding: '12px 28px',
            borderRadius: 'var(--radius-md)',
            fontSize: '15px',
            fontWeight: '500',
            textDecoration: 'none',
            fontFamily: 'var(--font-sans)',
          }}>
            Browse Courses
          </Link>
          <Link href="/signup" style={{
            background: 'transparent',
            color: 'var(--color-on-dark)',
            padding: '12px 28px',
            borderRadius: 'var(--radius-md)',
            fontSize: '15px',
            fontWeight: '500',
            textDecoration: 'none',
            fontFamily: 'var(--font-sans)',
            border: '1px solid rgba(255,255,255,0.3)',
          }}>
            Start for Free
          </Link>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'flex',
          gap: '48px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {[
            { number: '120+', label: 'Students' },
            { number: '15+', label: 'Courses' },
            { number: '4.9★', label: 'Rating' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '28px',
                fontWeight: '600',
                color: 'var(--color-on-dark)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 4px',
              }}>
                {stat.number}
              </p>
              <p style={{
                fontSize: '13px',
                color: 'var(--color-on-dark-muted)',
                fontFamily: 'var(--font-sans)',
                margin: '0',
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
