'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'All Courses', href: '/courses' },
    { label: 'How to Buy', href: '/how-to-buy' },
    { label: 'Pricing', href: '/pricing' },
  ]

  return (
    <>
      <nav style={{
        background: 'var(--color-canvas)',
        borderBottom: '1px solid var(--color-hairline)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>

          {/* Logo */}
          <Link href="/" style={{
            fontSize: '18px',
            fontWeight: '700',
            textDecoration: 'none',
            fontFamily: 'var(--font-sans)',
            flexShrink: 0,
          }}>
            <span style={{ color: 'var(--color-ink-deep)' }}>Panda</span>
            <span style={{ color: 'var(--color-primary)' }}>Courses</span>
          </Link>

          {/* Desktop Nav Links — Center */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
          }} className="desktop-nav">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} style={{
                fontSize: '14px',
                color: pathname === link.href
                  ? 'var(--color-ink-deep)'
                  : 'var(--color-slate)',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                fontWeight: pathname === link.href ? '500' : '400',
              }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }} className="desktop-nav">

            {/* Search */}
            {searchOpen ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      window.location.href = `/courses?search=${searchQuery}`
                    }
                    if (e.key === 'Escape') setSearchOpen(false)
                  }}
                  style={{
                    height: '36px',
                    padding: '0 12px',
                    border: '1px solid var(--color-hairline-strong)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    color: 'var(--color-ink)',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                    width: '200px',
                  }}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: 'var(--color-slate)',
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: 'var(--color-slate)',
                  padding: '4px 8px',
                }}
              >
                🔍
              </button>
            )}

            <Link href="/login" style={{
              fontSize: '14px',
              color: 'var(--color-slate)',
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
              padding: '8px 12px',
            }}>
              Log In
            </Link>
            <Link href="/signup" style={{
              background: 'var(--color-ink-deep)',
              color: 'var(--color-on-dark)',
              padding: '9px 18px',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
            }}>
              Sign Up
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'none',
              flexDirection: 'column',
              gap: '5px',
            }}
          >
            <span style={{
              display: 'block',
              width: '22px',
              height: '2px',
              background: 'var(--color-ink-deep)',
              borderRadius: '2px',
              transition: 'all 0.2s',
              transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
            }} />
            <span style={{
              display: 'block',
              width: '22px',
              height: '2px',
              background: 'var(--color-ink-deep)',
              borderRadius: '2px',
              opacity: menuOpen ? 0 : 1,
              transition: 'all 0.2s',
            }} />
            <span style={{
              display: 'block',
              width: '22px',
              height: '2px',
              background: 'var(--color-ink-deep)',
              borderRadius: '2px',
              transition: 'all 0.2s',
              transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
            }} />
          </button>

        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="mobile-menu" style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          background: 'var(--color-canvas)',
          borderBottom: '1px solid var(--color-hairline)',
          zIndex: 49,
          padding: '16px 24px 24px',
          display: 'none',
        }}>

          {/* Search */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  window.location.href = `/courses?search=${searchQuery}`
                  setMenuOpen(false)
                }
              }}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Nav Links */}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '14px 0',
                fontSize: '16px',
                fontWeight: '500',
                color: 'var(--color-ink-deep)',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                borderBottom: '1px solid var(--color-hairline-soft)',
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* Auth Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '20px',
          }}>
            <Link href="/login" onClick={() => setMenuOpen(false)} style={{
              flex: 1,
              textAlign: 'center',
              padding: '12px',
              border: '1px solid var(--color-hairline-strong)',
              borderRadius: 'var(--radius-md)',
              fontSize: '15px',
              fontWeight: '500',
              color: 'var(--color-ink)',
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
            }}>
              Log In
            </Link>
            <Link href="/signup" onClick={() => setMenuOpen(false)} style={{
              flex: 1,
              textAlign: 'center',
              padding: '12px',
              background: 'var(--color-ink-deep)',
              borderRadius: 'var(--radius-md)',
              fontSize: '15px',
              fontWeight: '500',
              color: 'white',
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
            }}>
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
