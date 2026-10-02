'use client'

import { useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { ConversionStatsResult } from '@/lib/admin/signupStats'

interface ConversionAnalyticsCardProps {
  stats: ConversionStatsResult
}

export default function ConversionAnalyticsCard({ stats }: ConversionAnalyticsCardProps) {
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
            Conversion Rate & Funnel
          </h2>
          <span
            style={{
              fontSize: '11px',
              fontWeight: '500',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-tint-mint)',
              color: '#27500A',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Lifetime Conversions
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
          Track how student signups convert into paid Lifetime Members over time
        </p>
      </div>

      {/* KPI Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* Total Signups */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-steel)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 6px',
            }}
          >
            Total Signups
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                lineHeight: 1,
              }}
            >
              {stats.totalSignups}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--color-slate)', fontFamily: 'var(--font-sans)' }}>
              members
            </span>
          </div>
        </div>

        {/* Lifetime Members */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-steel)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 6px',
            }}
          >
            Lifetime Members
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-sans)',
                lineHeight: 1,
              }}
            >
              {stats.lifetimeMembers}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--color-slate)', fontFamily: 'var(--font-sans)' }}>
              paid
            </span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-steel)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 6px',
            }}
          >
            Conversion Rate
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#27500A',
                fontFamily: 'var(--font-sans)',
                lineHeight: 1,
              }}
            >
              {stats.conversionRateFormatted}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-slate)', fontFamily: 'var(--font-sans)' }}>
              (Lifetime ÷ Total)
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Conversion Trend Line Header */}
      <div style={{ marginBottom: '14px' }}>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--color-ink-deep)',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 2px',
          }}
        >
          Weekly Conversion Trend (Last 12 Weeks)
        </h3>
        <p
          style={{
            fontSize: '12px',
            color: 'var(--color-steel)',
            fontFamily: 'var(--font-sans)',
            margin: 0,
          }}
        >
          Percentage of signups in each week that upgraded to Lifetime access
        </p>
      </div>

      {/* Recharts Line Chart */}
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
            Loading trend...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={stats.weeklyTrend}
              margin={{ top: 12, right: 16, left: -16, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-hairline-soft)"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: 'var(--color-hairline)' }}
                tick={{
                  fill: 'var(--color-steel)',
                  fontSize: 11,
                  fontFamily: 'var(--font-sans)',
                }}
                interval="preserveStartEnd"
                minTickGap={20}
              />
              <YAxis
                unit="%"
                tickLine={false}
                axisLine={{ stroke: 'var(--color-hairline)' }}
                tick={{
                  fill: 'var(--color-steel)',
                  fontSize: 11,
                  fontFamily: 'var(--font-sans)',
                }}
                domain={[0, 'auto']}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload
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
                            fontSize: '12px',
                            color: 'var(--color-steel)',
                            margin: '0 0 4px',
                            fontWeight: 500,
                          }}
                        >
                          {item.label}
                        </p>
                        <p
                          style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#27500A',
                            margin: '0 0 4px',
                          }}
                        >
                          {item.conversionRate}% Conversion
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--color-slate)', margin: 0 }}>
                          {item.lifetimeSignups} Lifetime / {item.totalSignups} Signups
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="conversionRate"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10B981', stroke: 'white', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#059669', stroke: 'white', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
