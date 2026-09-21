import Link from 'next/link'

interface LockedContentProps {
  isLoggedIn?: boolean
  courseCount?: number
}

export default function LockedContent({ isLoggedIn, courseCount }: LockedContentProps) {
  const hasCourseCount = typeof courseCount === 'number' && courseCount > 0

  return (
    <div
      style={{
        maxWidth: '480px',
        margin: '0 auto',
        textAlign: 'center',
        padding: '32px 16px',
      }}
    >
      {/* Padlock Illustration with Panda Ears (Under 3 KB) */}
      <div
        style={{
          width: '100px',
          height: '100px',
          margin: '0 auto 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            <style>
              {`
                @keyframes floatPadlock {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-6px); }
                }
                .padlock-float {
                  animation: floatPadlock 3s ease-in-out infinite;
                  transform-origin: center;
                }
                @media (prefers-reduced-motion: reduce) {
                  .padlock-float {
                    animation: none !important;
                  }
                }
              `}
            </style>
            <linearGradient id="padlockBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#252542" />
              <stop offset="100%" stopColor="#161626" />
            </linearGradient>
            <filter id="lockGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#6B4EFF" floodOpacity="0.25" />
            </filter>
          </defs>

          <g className="padlock-float" filter="url(#lockGlow)">
            {/* Soft Background Pulse */}
            <circle cx="60" cy="62" r="48" fill="#6B4EFF" fillOpacity="0.08" />

            {/* Tiny Panda Ears on Shackle */}
            <circle cx="41" cy="23" r="8" fill="#1A1A2E" />
            <circle cx="41" cy="23" r="4" fill="#6B4EFF" />

            <circle cx="79" cy="23" r="8" fill="#1A1A2E" />
            <circle cx="79" cy="23" r="4" fill="#6B4EFF" />

            {/* Lock Shackle */}
            <path
              d="M 43 56 V 37 C 43 27.6 50.6 20 60 20 C 69.4 20 77 27.6 77 37 V 56"
              stroke="#6B4EFF"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Padlock Body */}
            <rect
              x="30"
              y="50"
              width="60"
              height="50"
              rx="14"
              fill="url(#padlockBodyGrad)"
              stroke="rgba(107, 78, 255, 0.4)"
              strokeWidth="2"
            />

            {/* Subtle Panda Eye Spot Accents on Padlock Face */}
            <ellipse cx="50" cy="67" rx="3.5" ry="4.5" transform="rotate(-15 50 67)" fill="#6B4EFF" fillOpacity="0.5" />
            <ellipse cx="70" cy="67" rx="3.5" ry="4.5" transform="rotate(15 70 67)" fill="#6B4EFF" fillOpacity="0.5" />

            {/* Padlock Keyhole */}
            <circle cx="60" cy="74" r="4.5" fill="#F3F0FF" />
            <polygon points="58,76 62,76 63.5,84 56.5,84" fill="#F3F0FF" />
          </g>
        </svg>
      </div>

      {/* Heading */}
      <h1
        style={{
          fontSize: 'clamp(24px, 3.5vw, 30px)',
          fontWeight: '700',
          color: 'var(--color-ink-deep)',
          fontFamily: 'var(--font-sans)',
          margin: '0 0 12px',
          letterSpacing: '-0.5px',
        }}
      >
        Lifetime members only
      </h1>

      {/* Description */}
      <p
        style={{
          fontSize: '15px',
          color: 'var(--color-slate)',
          fontFamily: 'var(--font-sans)',
          lineHeight: '1.6',
          margin: '0 0 28px',
        }}
      >
        This content is available to Lifetime members.
        {hasCourseCount && ` Get access to ${courseCount}+ courses with one payment.`}
      </p>

      {/* CTAs */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            width: '100%',
          }}
        >
          <Link
            href="/pricing"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'var(--color-primary)',
              color: '#FFFFFF',
              padding: '12px 26px',
              borderRadius: 'var(--radius-md)',
              fontSize: '15px',
              fontWeight: '600',
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 4px 14px rgba(107, 78, 255, 0.35)',
              transition: 'all 0.15s ease',
              minHeight: '46px',
            }}
          >
            ⭐ Get Lifetime Access
          </Link>

          {!isLoggedIn && (
            <Link
              href="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-surface)',
                color: 'var(--color-ink-deep)',
                border: '1px solid var(--color-hairline-strong)',
                padding: '12px 24px',
                borderRadius: 'var(--radius-md)',
                fontSize: '15px',
                fontWeight: '500',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.15s ease',
                minHeight: '46px',
              }}
            >
              Log in
            </Link>
          )}
        </div>

        {/* Back link */}
        <div style={{ marginTop: '8px' }}>
          <Link
            href="/"
            style={{
              fontSize: '13px',
              color: 'var(--color-steel)',
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
