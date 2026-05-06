'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Announcement {
  id: string
  text: string
  is_active: boolean
  created_at: string
}

interface Props {
  initialAnnouncements: Announcement[]
}

export default function AnnouncementManager({ initialAnnouncements }: Props) {
  const supabase = createClient()
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleAdd() {
    if (!text.trim()) {
      setError('Announcement text is required')
      return
    }

    setLoading(true)
    setError('')

    // Pehle sab deactivate karo
    await supabase
      .from('announcements')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000')

    const { data, error: insertError } = await supabase
      .from('announcements')
      .insert({ text: text.trim(), is_active: true })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setAnnouncements([data, ...announcements.map(a => ({ ...a, is_active: false }))])
    setText('')
    setLoading(false)
  }

  async function handleActivate(id: string) {
    // Sab deactivate karo
    await supabase
      .from('announcements')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000')

    // Yeh activate karo
    const { data } = await supabase
      .from('announcements')
      .update({ is_active: true })
      .eq('id', id)
      .select()
      .single()

    if (data) {
      setAnnouncements(announcements.map(a => ({
        ...a,
        is_active: a.id === id,
      })))
    }
  }

  async function handleDeactivate(id: string) {
    await supabase
      .from('announcements')
      .update({ is_active: false })
      .eq('id', id)

    setAnnouncements(announcements.map(a =>
      a.id === id ? { ...a, is_active: false } : a
    ))
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this?')) return
    await supabase.from('announcements').delete().eq('id', id)
    setAnnouncements(announcements.filter(a => a.id !== id))
  }

  const active = announcements.find(a => a.is_active)

  return (
    <div>

      {/* Active Announcement Preview */}
      <div style={{
        background: active ? 'var(--color-tint-yellow-bold)' : 'var(--color-surface)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <span style={{ fontSize: '20px' }}>📢</span>
        <div>
          <p style={{
            fontSize: '11px',
            fontWeight: '500',
            color: 'var(--color-steel)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 4px',
          }}>
            Live Announcement Bar
          </p>
          <p style={{
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--color-ink-deep)',
            fontFamily: 'var(--font-sans)',
            margin: '0',
          }}>
            {active ? active.text : 'No active announcement'}
          </p>
        </div>
      </div>

      {/* Add New */}
      <div style={{
        background: 'var(--color-canvas)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: '24px',
      }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: '600',
          color: 'var(--color-ink-deep)',
          fontFamily: 'var(--font-sans)',
          margin: '0 0 16px',
        }}>
          New Announcement
        </h3>

        {error && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: '16px',
          }}>
            <p style={{
              fontSize: '13px',
              color: '#DC2626',
              fontFamily: 'var(--font-sans)',
              margin: '0',
            }}>
              {error}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. 🎉 New course launch — enroll now for early access!"
            style={{
              flex: 1,
              height: '44px',
              padding: '0 14px',
              background: 'var(--color-canvas)',
              border: '1px solid var(--color-hairline-strong)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
            }}
          />
          <button
            onClick={handleAdd}
            disabled={loading}
            style={{
              background: loading ? 'var(--color-muted)' : 'var(--color-ink-deep)',
              color: 'var(--color-on-dark)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0 20px',
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'var(--font-sans)',
              cursor: loading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'Adding...' : 'Add & Activate'}
          </button>
        </div>
      </div>

      {/* Announcements List */}
      <div style={{
        background: 'var(--color-canvas)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '3fr 1fr 160px',
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-hairline)',
        }}>
          {['Text', 'Status', 'Actions'].map((col) => (
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
        {announcements.length > 0 ? (
          announcements.map((ann, index) => (
            <div
              key={ann.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '3fr 1fr 160px',
                borderBottom: index === announcements.length - 1
                  ? 'none'
                  : '1px solid var(--color-hairline-soft)',
                alignItems: 'center',
                background: ann.is_active
                  ? 'var(--color-tint-yellow)'
                  : 'var(--color-canvas)',
              }}
            >
              {/* Text */}
              <div style={{ padding: '14px 16px' }}>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--color-ink-deep)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0',
                }}>
                  {ann.text}
                </p>
                <p style={{
                  fontSize: '11px',
                  color: 'var(--color-steel)',
                  fontFamily: 'var(--font-sans)',
                  margin: '4px 0 0',
                }}>
                  {new Date(ann.created_at).toLocaleDateString('en-PK', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Status */}
              <div style={{ padding: '14px 16px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '500',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: ann.is_active ? '#EAF3DE' : 'var(--color-surface)',
                  color: ann.is_active ? '#27500A' : 'var(--color-steel)',
                  fontFamily: 'var(--font-sans)',
                }}>
                  {ann.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Actions */}
              <div style={{
                padding: '14px 16px',
                display: 'flex',
                gap: '8px',
              }}>
                {!ann.is_active ? (
                  <button
                    onClick={() => handleActivate(ann.id)}
                    style={{
                      background: '#EAF3DE',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      padding: '5px 10px',
                      fontSize: '12px',
                      color: '#27500A',
                      fontFamily: 'var(--font-sans)',
                      cursor: 'pointer',
                    }}
                  >
                    Activate
                  </button>
                ) : (
                  <button
                    onClick={() => handleDeactivate(ann.id)}
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-hairline)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '5px 10px',
                      fontSize: '12px',
                      color: 'var(--color-slate)',
                      fontFamily: 'var(--font-sans)',
                      cursor: 'pointer',
                    }}
                  >
                    Deactivate
                  </button>
                )}
                <button
                  onClick={() => handleDelete(ann.id)}
                  style={{
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: 'var(--radius-sm)',
                    padding: '5px 10px',
                    fontSize: '12px',
                    color: '#DC2626',
                    fontFamily: 'var(--font-sans)',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{
              fontSize: '14px',
              color: 'var(--color-slate)',
              fontFamily: 'var(--font-sans)',
              margin: '0',
            }}>
              No announcements found — use the form above to add one
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
