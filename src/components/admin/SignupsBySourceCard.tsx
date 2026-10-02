'use client'

import { useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { SourceStatItem } from '@/lib/admin/signupStats'

interface SignupsBySourceCardProps {
  sources: SourceStatItem[]
}

export default function SignupsBySourceCard({ sources }: SignupsBySourceCardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      style={{
        background: 'var(--color-canvas)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: '40px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--color-ink-deep)',
              fontFamily: 'var(--font-sans)',
              margin: 0,
            }}
          >
            Signups by Source
          </h2>
          <span
            style={{
              fontSize: '11px',
              fontWeight: '500',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-tint-sky)',
              color: '#0369A1',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Attribution
          </span>
        </div>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--color-steel)',
            fontFamily: 'var(--font-sans)',
            margin: '4px 0 0',
          }}
        >
          Acquisition channels captured via referral links (?ref= or ?utm_source=)
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left: Bar Chart */}
        <div>
          <h3
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-slate)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Distribution
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            {!mounted ? (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-steel)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Loading chart...
              </div>
            ) : sources.length === 0 ? (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-steel)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                No source data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sources.slice(0, 8)}
                  margin={{ top: 8, right: 12, left: -20, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--color-hairline-soft)"
                  />
                  <XAxis
                    dataKey="source"
                    tickLine={false}
                    axisLine={{ stroke: 'var(--color-hairline)' }}
                    tick={{
                      fill: 'var(--color-steel)',
                      fontSize: 11,
                      fontFamily: 'var(--font-sans)',
                    }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--color-hairline)' }}
                    tick={{
                      fill: 'var(--color-steel)',
                      fontSize: 11,
                      fontFamily: 'var(--font-sans)',
                    }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload as SourceStatItem
                        return (
                          <div
                            style={{
                              background: 'white',
                              border: '1px solid var(--color-hairline-strong)',
                              borderRadius: 'var(--radius-md)',
                              padding: '10px 14px',
                              boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                              fontFamily: 'var(--font-sans)',
                            }}
                          >
                            <p
                              style={{
                                fontSize: '13px',
                                fontWeight: 700,
                                color: 'var(--color-ink-deep)',
                                margin: '0 0 4px',
                                textTransform: 'capitalize',
                              }}
                            >
                              {item.source}
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--color-primary)', margin: '0 0 2px' }}>
                              Signups: {item.signups}
                            </p>
                            <p style={{ fontSize: '12px', color: '#27500A', margin: '0 0 2px' }}>
                              Lifetime: {item.lifetime}
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--color-slate)', margin: 0 }}>
                              Conversion: {item.conversionRateFormatted}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar
                    dataKey="signups"
                    fill="var(--color-primary)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right: Table */}
        <div>
          <h3
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-slate)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Breakdown & Performance
          </h3>
          <div
            style={{
              border: '1px solid var(--color-hairline)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}
          >
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1.2fr 1.2fr',
                background: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-hairline)',
                padding: '8px 14px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-steel)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <div>Source</div>
              <div>Signups</div>
              <div>Lifetime</div>
              <div>Conv. %</div>
            </div>

            {/* Rows */}
            {sources.length === 0 ? (
              <div
                style={{
                  padding: '24px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: 'var(--color-steel)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                No source tracking data recorded yet.
              </div>
            ) : (
              sources.map((item, idx) => (
                <div
                  key={item.source}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1.2fr 1.2fr',
                    padding: '10px 14px',
                    borderBottom: idx === sources.length - 1 ? 'none' : '1px solid var(--color-hairline-soft)',
                    fontSize: '13px',
                    fontFamily: 'var(--font-sans)',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--color-ink-deep)' }}>
                    {item.source}
                  </div>
                  <div style={{ color: 'var(--color-charcoal)' }}>{item.signups}</div>
                  <div style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                    {item.lifetime}
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-sm)',
                        background: item.conversionRate > 0 ? '#EAF3DE' : 'var(--color-surface-soft)',
                        color: item.conversionRate > 0 ? '#27500A' : 'var(--color-steel)',
                      }}
                    >
                      {item.conversionRateFormatted}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
