export default function NotFoundIllustration() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '420px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg
        viewBox="0 0 420 270"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          overflow: 'visible',
        }}
      >
        <defs>
          {/* Gentle Float Keyframes */}
          <style>
            {`
              @keyframes floatPanda {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
              }
              @keyframes floatCardA {
                0%, 100% { transform: translateY(0px) rotate(-10deg); }
                50% { transform: translateY(-11px) rotate(-6deg); }
              }
              @keyframes floatCardB {
                0%, 100% { transform: translateY(0px) rotate(12deg); }
                50% { transform: translateY(-9px) rotate(16deg); }
              }
              @keyframes floatCardC {
                0%, 100% { transform: translateY(0px) rotate(6deg); }
                50% { transform: translateY(-8px) rotate(2deg); }
              }
              @keyframes floatSparkle {
                0%, 100% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.25); opacity: 1; }
              }

              .float-center {
                animation: floatPanda 3s ease-in-out infinite;
                transform-origin: center;
              }
              .float-item-1 {
                animation: floatCardA 3.4s ease-in-out infinite;
                transform-origin: 52px 52px;
              }
              .float-item-2 {
                animation: floatCardB 3.1s ease-in-out infinite 0.4s;
                transform-origin: 366px 56px;
              }
              .float-item-3 {
                animation: floatCardC 3.6s ease-in-out infinite 0.8s;
                transform-origin: 56px 208px;
              }
              .sparkle-anim {
                animation: floatSparkle 2.6s ease-in-out infinite;
                transform-origin: center;
              }

              @media (prefers-reduced-motion: reduce) {
                .float-center,
                .float-item-1,
                .float-item-2,
                .float-item-3,
                .sparkle-anim {
                  animation: none !important;
                }
              }
            `}
          </style>

          {/* Soft Purple Glow Filter */}
          <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#6B4EFF" stopOpacity="0.04" />
          </linearGradient>

          {/* Glass Lens Gradient */}
          <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#A78BFA" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6B4EFF" stopOpacity="0.4" />
          </linearGradient>

          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1A1A2E" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Soft Organic Purple Blob Background */}
        <path
          d="M 80 135 C 55 70, 110 28, 195 24 C 285 20, 365 58, 360 135 C 355 210, 295 252, 205 248 C 115 244, 105 200, 80 135 Z"
          fill="url(#blobGrad)"
        />

        {/* Floating Course Card 1 - Top Left (Code / Dev) */}
        <g className="float-item-1" filter="url(#softShadow)">
          <rect x="30" y="36" width="46" height="34" rx="6" fill="#FFFFFF" stroke="var(--color-hairline, #E8E8E5)" strokeWidth="1.5" />
          <rect x="30" y="36" width="46" height="10" rx="6" fill="#6B4EFF" />
          <circle cx="37" cy="41" r="1.5" fill="#FFFFFF" />
          <circle cx="42" cy="41" r="1.5" fill="#FFFFFF" opacity="0.7" />
          <rect x="36" y="52" width="24" height="3" rx="1.5" fill="#1A1A2E" opacity="0.75" />
          <rect x="36" y="58" width="16" height="3" rx="1.5" fill="#6B4EFF" opacity="0.6" />
        </g>

        {/* Floating Course Card 2 - Top Right (Design / Book) */}
        <g className="float-item-2" filter="url(#softShadow)">
          <rect x="344" y="40" width="44" height="32" rx="6" fill="#FFFFFF" stroke="var(--color-hairline, #E8E8E5)" strokeWidth="1.5" />
          <rect x="344" y="40" width="44" height="9" rx="6" fill="#10B981" />
          <rect x="350" y="55" width="22" height="3" rx="1.5" fill="#1A1A2E" opacity="0.75" />
          <rect x="350" y="61" width="14" height="3" rx="1.5" fill="#8A8A8A" />
        </g>

        {/* Floating Mini Card 3 - Bottom Left (Play / Video) */}
        <g className="float-item-3" filter="url(#softShadow)">
          <rect x="34" y="192" width="44" height="32" rx="6" fill="#FFFFFF" stroke="var(--color-hairline, #E8E8E5)" strokeWidth="1.5" />
          <circle cx="56" cy="208" r="8" fill="var(--color-tint-lavender, #F3F0FF)" />
          <polygon points="54,204 60,208 54,212" fill="#6B4EFF" />
        </g>

        {/* Subtle Decorative Sparkles */}
        <g className="sparkle-anim">
          <path d="M 125 44 Q 125 50 120 50 Q 125 50 125 56 Q 125 50 130 50 Q 125 50 125 44 Z" fill="#6B4EFF" opacity="0.8" />
          <path d="M 292 48 Q 292 53 288 53 Q 292 53 292 58 Q 292 53 296 53 Q 292 53 292 48 Z" fill="#8B5CF6" opacity="0.7" />
          <path d="M 374 195 Q 374 200 370 200 Q 374 200 374 205 Q 374 200 378 200 Q 374 200 374 195 Z" fill="#6B4EFF" opacity="0.75" />
        </g>

        {/* The 404 Composition */}
        <g className="float-center">
          {/* Left "4" */}
          <path
            d="M 100 68 L 44 154 L 110 154 L 110 186 L 132 186 L 132 154 L 148 154 L 148 132 L 132 132 L 132 68 Z M 100 102 L 110 132 L 68 132 Z"
            fill="var(--color-ink-deep, #1A1A2E)"
          />

          {/* Right "4" */}
          <path
            d="M 334 68 L 278 154 L 344 154 L 344 186 L 366 186 L 366 154 L 382 154 L 382 132 L 366 132 L 366 68 Z M 334 102 L 344 132 L 302 132 Z"
            fill="var(--color-ink-deep, #1A1A2E)"
          />

          {/* Middle "0" -> Panda Character */}
          <g id="panda-center">
            {/* Left Ear */}
            <circle cx="170" cy="85" r="18" fill="#1A1A2E" />
            <circle cx="170" cy="85" r="10" fill="#2E2E48" />

            {/* Right Ear */}
            <circle cx="244" cy="85" r="18" fill="#1A1A2E" />
            <circle cx="244" cy="85" r="10" fill="#2E2E48" />

            {/* Face Base */}
            <circle
              cx="207"
              cy="132"
              r="53"
              fill="#FFFFFF"
              stroke="var(--color-hairline, #E8E8E5)"
              strokeWidth="2.5"
              filter="url(#softShadow)"
            />

            {/* Left Eye Patch */}
            <ellipse cx="187" cy="126" rx="14" ry="18" transform="rotate(-15 187 126)" fill="#1A1A2E" />
            {/* Left Pupil & Highlight */}
            <circle cx="189" cy="125" r="4.5" fill="#FFFFFF" />
            <circle cx="191" cy="123" r="1.5" fill="#FFFFFF" />

            {/* Right Eye Patch */}
            <ellipse cx="227" cy="126" rx="14" ry="18" transform="rotate(15 227 126)" fill="#1A1A2E" />
            {/* Right Pupil & Highlight */}
            <circle cx="225" cy="125" r="4.5" fill="#FFFFFF" />
            <circle cx="227" cy="123" r="1.5" fill="#FFFFFF" />

            {/* Soft Cheeks */}
            <ellipse cx="170" cy="144" rx="7" ry="4" fill="#F472B6" opacity="0.35" />
            <ellipse cx="244" cy="144" rx="7" ry="4" fill="#F472B6" opacity="0.35" />

            {/* Panda Nose */}
            <path
              d="M 202 139 C 202 137 212 137 212 139 C 212 143.5 208 146 207 146 C 206 146 202 143.5 202 139 Z"
              fill="#1A1A2E"
            />

            {/* Panda Mouth */}
            <path
              d="M 203 148 Q 198 153 194 150 M 207 146 L 207 148 M 207 148 Q 212 153 216 150"
              stroke="#1A1A2E"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Magnifying Glass Held by Panda */}
            <g id="magnifying-glass">
              {/* Glass Handle */}
              <line
                x1="262"
                y1="164"
                x2="284"
                y2="190"
                stroke="#6B4EFF"
                strokeWidth="6.5"
                strokeLinecap="round"
              />
              {/* Panda Paw Holding Handle */}
              <ellipse cx="266" cy="168" rx="9" ry="8" fill="#1A1A2E" />

              {/* Magnifying Lens Outer Ring */}
              <circle
                cx="248"
                cy="146"
                r="22"
                fill="url(#lensGrad)"
                stroke="#6B4EFF"
                strokeWidth="4"
              />
              {/* Lens Reflection Arc */}
              <path
                d="M 236 135 A 16 16 0 0 1 259 133"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.85"
              />
            </g>

            {/* Left Panda Paw on Face Side */}
            <ellipse cx="166" cy="166" rx="9" ry="8" fill="#1A1A2E" />
          </g>
        </g>
      </svg>
    </div>
  )
}
