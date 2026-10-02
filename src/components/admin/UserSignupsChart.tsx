'use client'

import { useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { SignupStatsResult, PeriodStats } from '@/lib/admin/signupStats'

interface UserSignupsChartProps {
  initialStats: SignupStatsResult
}

type PeriodType = 'daily' | 'weekly' | 'monthly'
type ChartType = 'bar' | 'line'

export default function UserSignupsChart({ initialStats }: UserSignupsChartProps) {
  const [period, setPeriod] = useState<PeriodType>('daily')
  const [chartType, setChartType] = useState<ChartType>('bar')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentStats: PeriodStats = initialStats[period]

  const periodOptions: Array<{ key: PeriodType; label: string }> = [
    { key: 'daily', label: 'Daily (last 30 days)' },
    { key: 'weekly', label: 'Weekly (last 12 weeks)' },
    { key: 'monthly', label: 'Monthly (last 12 months)' },
  ]

  // Trend badge colors
  const isPositive = currentStats.trend === 'up'
  const isNegative = currentStats.trend === 'down'

  const trendBg = isPositive ? '#EAF3DE' : isNegative ? '#FEF2F2' : 'var(--color-surface-soft)'
  const trendColor = isPositive ? '#27500A' : isNegative ? '#DC2626' : 'var(--color-slate)'
  const trendArrow = isPositive ? '↑' : isNegative ? '↓' : '→'

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
      {/* Header Row: Title & Toggles */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
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
              User Signups
            </h2>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '500',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-tint-lavender)',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Analytics
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
            Registered student accounts over time
          </p>
        </div>

        {/* Controls: Period Toggle & Chart Type Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Period Toggle Group */}
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--color-surface)',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-hairline)',
            }}
          >
            {periodOptions.map((opt) => {
              const active = period === opt.key
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setPeriod(opt.key)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: active ? 600 : 500,
                    color: active ? 'white' : 'var(--color-slate)',
                    background: active ? 'var(--color-primary)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>

          {/* Chart Style Toggle (Bar / Line) */}
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--color-surface)',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-hairline)',
            }}
          >
            <button
              type="button"
              onClick={() => setChartType('bar')}
              title="Bar Chart"
              style={{
                padding: '6px 10px',
                fontSize: '12px',
                fontWeight: chartType === 'bar' ? 600 : 500,
                color: chartType === 'bar' ? 'white' : 'var(--color-slate)',
                background: chartType === 'bar' ? 'var(--color-primary)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>📊</span>
              <span>Bar</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType('line')}
              title="Line Chart"
              style={{
                padding: '6px 10px',
                fontSize: '12px',
                fontWeight: chartType === 'line' ? 600 : 500,
                color: chartType === 'line' ? 'white' : 'var(--color-slate)',
                background: chartType === 'line' ? 'var(--color-primary)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>📈</span>
              <span>Line</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Band */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--color-hairline-soft)',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: 'var(--color-ink-deep)',
              fontFamily: 'var(--font-sans)',
              lineHeight: 1,
            }}
          >
            {currentStats.currentTotal}
          </span>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--color-steel)',
              fontFamily: 'var(--font-sans)',
              marginLeft: '6px',
            }}
          >
            total signups
          </span>
        </div>

        {/* Comparison Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: trendBg,
            color: trendColor,
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: 'var(--font-sans)',
          }}
        >
          <span>
            {trendArrow} {currentStats.changeText}
          </span>
          <span style={{ fontWeight: 400, opacity: 0.9 }}>
            {currentStats.subtitle} ({currentStats.previousTotal})
          </span>
        </div>
      </div>

      {/* Recharts Chart Area */}
      <div style={{ width: '100%', height: 320 }}>
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
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart
                data={currentStats.data}
                margin={{ top: 12, right: 12, left: -16, bottom: 4 }}
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
                  minTickGap={18}
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
                  domain={[0, 'auto']}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(107, 78, 255, 0.06)' }}
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
                              fontSize: '16px',
                              fontWeight: 700,
                              color: 'var(--color-primary)',
                              margin: 0,
                            }}
                          >
                            {item.count} {item.count === 1 ? 'signup' : 'signups'}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            ) : (
              <AreaChart
                data={currentStats.data}
                margin={{ top: 12, right: 12, left: -16, bottom: 4 }}
              >
                <defs>
                  <linearGradient id="signupsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
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
                  minTickGap={18}
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
                              fontSize: '16px',
                              fontWeight: 700,
                              color: 'var(--color-primary)',
                              margin: 0,
                            }}
                          >
                            {item.count} {item.count === 1 ? 'signup' : 'signups'}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#signupsGradient)"
                  activeDot={{ r: 5, fill: 'var(--color-primary)', stroke: 'white', strokeWidth: 2 }}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
