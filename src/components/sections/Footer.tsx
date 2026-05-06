import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--color-brand-navy)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '64px 32px 32px',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
      }}>

        {/* Top Row */}
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '48px',
          marginBottom: '48px',
        }}>

          {/* Brand Column */}
          <div>
            <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: '#ffffff' }}>Panda</span>
              <span style={{ fontFamily: 'Fredoka One, cursive', fontWeight: 400, color: '#f97316' }}>Courses</span>
            </div>
            <p style={{
              fontSize: '14px',
              color: '#ffffff',
              fontFamily: 'var(--font-sans)',
              margin: '0',
              lineHeight: '1.7',
              maxWidth: '280px',
            }}>
              Access premium courses from your favorite mentors at unbeatable prices. We make quality learning simple and affordable for everyone.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <p style={{
              fontSize: '11px',
              fontWeight: '700',
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontFamily: "'Space Mono', monospace",
              margin: '0 0 16px',
            }}>
              Platform
            </p>
            {[
              { label: 'About Us', href: '/about' },
              { label: 'Courses', href: '/courses' },
              { label: 'Blog', href: '/blog' },
              { label: 'Pricing', href: '/pricing' },
            ].map((link) => (
              <Link key={link.label} href={link.href} className="footer-link" style={{
                display: 'flex',
                fontSize: '14px',
                color: '#ffffff',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                marginBottom: '10px',
              }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Account Links */}
          <div>
            <p style={{
              fontSize: '11px',
              fontWeight: '700',
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontFamily: "'Space Mono', monospace",
              margin: '0 0 16px',
            }}>
              Account
            </p>
            {[
              { label: 'Login', href: '/login' },
              { label: 'Sign Up', href: '/signup' },
              { label: 'Dashboard', href: '/dashboard' },
            ].map((link) => (
              <Link key={link.label} href={link.href} className="footer-link" style={{
                display: 'flex',
                fontSize: '14px',
                color: '#ffffff',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                marginBottom: '10px',
              }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Legal Links */}
          <div>
            <p style={{
              fontSize: '11px',
              fontWeight: '700',
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontFamily: "'Space Mono', monospace",
              margin: '0 0 16px',
            }}>
              Legal
            </p>
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Refund Policy', href: '/refund' },
              { label: 'Contact', href: '/contact' },
              { label: 'Sitemap', href: '/sitemap.xml' },
            ].map((link) => (
              <Link key={link.label} href={link.href} className="footer-link" style={{
                display: 'flex',
                fontSize: '14px',
                color: '#ffffff',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                marginBottom: '10px',
              }}>
                {link.label}
              </Link>
            ))}
          </div>

        </div>

        {/* Orange Gradient Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, #f97316 30%, #f97316 70%, transparent 100%)',
          marginBottom: '28px',
          opacity: 0.6,
        }} />

        {/* Bottom Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <p style={{
            fontSize: '13px',
            color: '#ffffff',
            fontFamily: "'Space Mono', monospace",
            margin: '0',
          }}>
            © 2026 Panda Courses. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
