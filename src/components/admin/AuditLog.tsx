'use client'

import { useState } from 'react'

interface Log {
  id: string
  admin_email: string | null
  action: string
  target_user_email: string | null
  created_at: string
}

interface Props {
  initialLogs: Log[]
}

export default function AuditLog({ initialLogs }: Props) {
  const [logs] = useState<Log[]>(initialLogs)
  const [search, setSearch] = useState('')

  const filtered = logs.filter(log =>
    (log.action || '').toLowerCase().includes(search.toLowerCase()) ||
    (log.target_user_email || '').toLowerCase().includes(search.toLowerCase()) ||
    (log.admin_email || '').toLowerCase().includes(search.toLowerCase())
  )

  function getActionColor(action: string) {
    if (action.includes('granted') || action.includes('updated')) {
      return { bg: '#EAF3DE', color: '#27500A' }
    }
    if (action.includes('revoked') || action.includes('blocked')) {
      return { bg: '#FEF2F2', color: '#DC2626' }
    }
    return { bg: 'var(--color-tint-lavender)', color: 'var(--color-ink-deep)' }
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins} min ago`
    if (hours < 24) return `${hours} hours ago`
    return `${days} days ago`
  }

  return (
    <div>

      {/* Search + Count */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap',
      }}>
        <input
          type="text"
          placeholder="Search by action or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            height: '40px',
            padding: '0 14px',
            background: 'var(--color-canvas)',
            border: '1px solid var(--color-hairline-strong)',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            color: 'var(--color-ink)',
            fontFamily: 'var(--font-sans)',
            outline: 'none',
            width: '300px',
          }}
        />
        <p style={{
          fontSize: '13px',
          color: 'var(--color-steel)',
          fontFamily: 'var(--font-sans)',
          margin: '0',
          marginLeft: 'auto',
        }}>
          {filtered.length} logs
        </p>
      </div>

      {/* Logs Table */}
      <div style={{
        background: 'var(--color-canvas)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>

        {/* Column Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 1.5fr 1fr',
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-hairline)',
        }}>
          {['Action', 'Target User', 'Admin', 'Time'].map((col) => (
            <div key={col} style={{
              padding: '10px 16px',
              fontSize: '11px',
              fontWeight: '500',
              color: 'var(--color-steel)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontFamily: 'var(--font-sans)',
            }}>
              {col}
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length > 0 ? (
          filtered.map((log, index) => {
            const actionStyle = getActionColor(log.action)
            return (
              <div
                key={log.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1.5fr 1fr',
                  borderBottom: index === filtered.length - 1
                    ? 'none'
                    : '1px solid var(--color-hairline-soft)',
                  alignItems: 'center',
                }}
              >

                {/* Action */}
                <div style={{ padding: '14px 16px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: actionStyle.bg,
                    color: actionStyle.color,
                    fontFamily: 'var(--font-sans)',
                  }}>
                    {log.action.includes('granted') || log.action.includes('updated')
                      ? '✓'
                      : log.action.includes('revoked') || log.action.includes('blocked')
                        ? '✕'
                        : '•'
                    }
                    {log.action}
                  </span>
                </div>

                {/* Target User */}
                <div style={{ padding: '14px 16px' }}>
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--color-charcoal)',
                    fontFamily: 'var(--font-sans)',
                    margin: '0',
                  }}>
                    {log.target_user_email || '—'}
                  </p>
                </div>

                {/* Admin */}
                <div style={{ padding: '14px 16px' }}>
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--color-charcoal)',
                    fontFamily: 'var(--font-sans)',
                    margin: '0',
                  }}>
                    {log.admin_email || 'System'}
                  </p>
                </div>

                {/* Time */}
                <div style={{ padding: '14px 16px' }}>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--color-steel)',
                    fontFamily: 'var(--font-sans)',
                    margin: '0 0 2px',
                  }}>
                    {timeAgo(log.created_at)}
                  </p>
                  <p style={{
                    fontSize: '11px',
                    color: 'var(--color-muted)',
                    fontFamily: 'var(--font-sans)',
                    margin: '0',
                  }}>
                    {new Date(log.created_at).toLocaleDateString('en-PK', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

              </div>
            )
          })
        ) : (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ fontSize: '32px', margin: '0 0 16px' }}>🔍</p>
            <p style={{
              fontSize: '14px',
              color: 'var(--color-slate)',
              fontFamily: 'var(--font-sans)',
              margin: '0',
            }}>
              {search ? 'No matching logs found' : 'No activity recorded yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
