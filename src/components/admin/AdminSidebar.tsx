'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Courses', href: '/admin/courses', icon: '📚' },
  { label: 'Public Courses', href: '/admin/public-courses', icon: '🌐' },
  { label: 'Blog Posts', href: '/admin/blog', icon: '✍️' },
  { label: 'Announcements', href: '/admin/announcements', icon: '📢' },
  { label: 'Members', href: '/admin/members', icon: '👥' },
  { label: 'Audit Log', href: '/admin/audit', icon: '🔍' },
  { label: 'Redirects', href: '/admin/redirects', icon: '🔗' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="admin-sidebar" style={{
      width: '240px',
      minHeight: '100vh',
      background: 'var(--color-canvas)',
      borderRight: '1px solid var(--color-hairline)',
      padding: '32px 0',
      flexShrink: 0,
    }}>

      {/* Logo */}
      <div style={{
        padding: '0 24px 32px',
        borderBottom: '1px solid var(--color-hairline)',
        marginBottom: '16px',
      }}>
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '22px', display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: '#1a1a1a' }}>Panda</span>
            <span style={{ fontFamily: 'Fredoka One, cursive', fontWeight: 400, color: '#f97316' }}>Courses</span>
          </div>
        </div>
        <p style={{
          fontSize: '11px',
          fontWeight: '500',
          color: 'var(--color-steel)',
          fontFamily: 'var(--font-sans)',
          margin: '0',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          Admin Panel
        </p>
      </div>

      {/* Nav Items */}
      <nav style={{ padding: '0 12px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '4px',
                textDecoration: 'none',
                background: isActive ? 'var(--color-surface)' : 'transparent',
                fontSize: '14px',
                fontWeight: isActive ? '500' : '400',
                color: isActive ? 'var(--color-ink-deep)' : 'var(--color-slate)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom — View Site */}
      <div style={{
        padding: '16px 24px 0',
        marginTop: '16px',
        borderTop: '1px solid var(--color-hairline)',
        position: 'absolute',
        bottom: '32px',
        width: '240px',
        boxSizing: 'border-box',
      }}>
        <Link href="/" style={{
          fontSize: '13px',
          color: 'var(--color-steel)',
          textDecoration: 'none',
          fontFamily: 'var(--font-sans)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          ← View Site
        </Link>
      </div>

    </aside>
  )
}
