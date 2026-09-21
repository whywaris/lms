'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Announcement {
  id: string
  text: string
  audience: 'homepage' | 'dashboard'
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
  const [audience, setAudience] = useState<'homepage' | 'dashboard'>('homepage')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Edit modal state
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [editText, setEditText] = useState('')
  const [editAudience, setEditAudience] = useState<'homepage' | 'dashboard'>('homepage')
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')

  async function handleAdd() {
    if (!text.trim()) {
      setError('Announcement text is required')
      return
    }

    setLoading(true)
    setError('')

    // Deactivate other announcements with the SAME audience only
    await supabase
      .from('announcements')
      .update({ is_active: false })
      .eq('audience', audience)
      .neq('id', '00000000-0000-0000-0000-000000000000')

    const { data, error: insertError } = await supabase
      .from('announcements')
      .insert({
        text: text.trim(),
        audience,
        is_active: true,
      })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setAnnouncements([
      data,
      ...announcements.map((a) =>
        (a.audience || 'homepage') === audience ? { ...a, is_active: false } : a
      ),
    ])
    setText('')
    setAudience('homepage')
    setLoading(false)
  }

  function startEditing(ann: Announcement) {
    setEditingAnnouncement(ann)
    setEditText(ann.text)
    setEditAudience(ann.audience || 'homepage')
    setEditError('')
  }

  async function handleUpdate() {
    if (!editingAnnouncement) return
    if (!editText.trim()) {
      setEditError('Announcement text is required')
      return
    }

    setEditLoading(true)
    setEditError('')

    // If announcement is active and its audience or text is updated,
    // ensure only ONE announcement remains active in the new audience
    if (editingAnnouncement.is_active) {
      await supabase
        .from('announcements')
        .update({ is_active: false })
        .eq('audience', editAudience)
        .neq('id', editingAnnouncement.id)
    }

    const { data, error: updateError } = await supabase
      .from('announcements')
      .update({
        text: editText.trim(),
        audience: editAudience,
      })
      .eq('id', editingAnnouncement.id)
      .select()
      .single()

    if (updateError) {
      setEditError(updateError.message)
      setEditLoading(false)
      return
    }

    setAnnouncements(
      announcements.map((a) => {
        if (a.id === editingAnnouncement.id) {
          return data
        }
        if (editingAnnouncement.is_active && (a.audience || 'homepage') === editAudience) {
          return { ...a, is_active: false }
        }
        return a
      })
    )

    setEditingAnnouncement(null)
    setEditLoading(false)
  }

  async function handleActivate(id: string, annAudience: 'homepage' | 'dashboard') {
    const targetAudience = annAudience || 'homepage'

    // Deactivate only announcements with the same audience
    await supabase
      .from('announcements')
      .update({ is_active: false })
      .eq('audience', targetAudience)
      .neq('id', id)

    // Activate this announcement
    const { data } = await supabase
      .from('announcements')
      .update({ is_active: true })
      .eq('id', id)
      .select()
      .single()

    if (data) {
      setAnnouncements(
        announcements.map((a) => {
          if (a.id === id) return { ...a, is_active: true }
          if ((a.audience || 'homepage') === targetAudience) return { ...a, is_active: false }
          return a
        })
      )
    }
  }

  async function handleDeactivate(id: string) {
    await supabase
      .from('announcements')
      .update({ is_active: false })
      .eq('id', id)

    setAnnouncements(
      announcements.map((a) => (a.id === id ? { ...a, is_active: false } : a))
    )
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this?')) return
    await supabase.from('announcements').delete().eq('id', id)
    setAnnouncements(announcements.filter((a) => a.id !== id))
  }

  const activeHomepage = announcements.find(
    (a) => a.is_active && (a.audience === 'homepage' || !a.audience)
  )
  const activeDashboard = announcements.find(
    (a) => a.is_active && a.audience === 'dashboard'
  )

  return (
    <div>
      {/* Active Announcement Previews for Homepage and Dashboard */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* Homepage Preview */}
        <div
          style={{
            background: activeHomepage ? '#EEEDFE' : 'var(--color-surface)',
            border: `1px solid ${activeHomepage ? 'rgba(107, 78, 255, 0.3)' : 'var(--color-hairline)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '20px' }}>🌐</span>
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: activeHomepage ? 'var(--color-primary)' : 'var(--color-steel)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 4px',
              }}
            >
              Live on Homepage
            </p>
            <p
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                margin: '0',
              }}
            >
              {activeHomepage ? activeHomepage.text : 'No active announcement'}
            </p>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div
          style={{
            background: activeDashboard ? '#EAF3DE' : 'var(--color-surface)',
            border: `1px solid ${activeDashboard ? 'rgba(16, 185, 129, 0.3)' : 'var(--color-hairline)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '20px' }}>📊</span>
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: activeDashboard ? '#27500A' : 'var(--color-steel)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 4px',
              }}
            >
              Live on Dashboard
            </p>
            <p
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                margin: '0',
              }}
            >
              {activeDashboard ? activeDashboard.text : 'No active announcement'}
            </p>
          </div>
        </div>
      </div>

      {/* Add New Announcement Form */}
      <div
        style={{
          background: 'var(--color-canvas)',
          border: '1px solid var(--color-hairline)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <h3
          style={{
            fontSize: '15px',
            fontWeight: '600',
            color: 'var(--color-ink-deep)',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 16px',
          }}
        >
          New Announcement
        </h3>

        {error && (
          <div
            style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              marginBottom: '16px',
            }}
          >
            <p
              style={{
                fontSize: '13px',
                color: '#DC2626',
                fontFamily: 'var(--font-sans)',
                margin: '0',
              }}
            >
              {error}
            </p>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* Audience Select */}
          <div style={{ minWidth: '160px' }}>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value as 'homepage' | 'dashboard')}
              aria-label="Announcement Audience"
              style={{
                width: '100%',
                height: '44px',
                padding: '0 12px',
                background: 'var(--color-canvas)',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="homepage">Homepage</option>
              <option value="dashboard">Dashboard</option>
            </select>
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. 🎉 New course launch — enroll now for early access!"
            style={{
              flex: 1,
              minWidth: '240px',
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

          {/* Add & Activate Button */}
          <button
            onClick={handleAdd}
            disabled={loading}
            style={{
              background: loading ? 'var(--color-muted)' : 'var(--color-ink-deep)',
              color: 'var(--color-on-dark)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              height: '44px',
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

      {/* Announcements List Table */}
      <div
        style={{
          background: 'var(--color-canvas)',
          border: '1px solid var(--color-hairline)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2.5fr 120px 110px 190px',
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-hairline)',
          }}
        >
          {['Text', 'Audience', 'Status', 'Actions'].map((col) => (
            <div
              key={col}
              style={{
                padding: '12px 16px',
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--color-steel)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {col}
            </div>
          ))}
        </div>

        {/* Rows */}
        {announcements.length > 0 ? (
          announcements.map((ann, index) => {
            const annAudience = ann.audience || 'homepage'
            return (
              <div
                key={ann.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2.5fr 120px 110px 190px',
                  borderBottom:
                    index === announcements.length - 1
                      ? 'none'
                      : '1px solid var(--color-hairline-soft)',
                  alignItems: 'center',
                  background: ann.is_active
                    ? annAudience === 'dashboard'
                      ? 'rgba(16, 185, 129, 0.05)'
                      : 'rgba(107, 78, 255, 0.05)'
                    : 'var(--color-canvas)',
                }}
              >
                {/* Text */}
                <div style={{ padding: '14px 16px' }}>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--color-ink-deep)',
                      fontFamily: 'var(--font-sans)',
                      margin: '0',
                    }}
                  >
                    {ann.text}
                  </p>
                  <p
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-steel)',
                      fontFamily: 'var(--font-sans)',
                      margin: '4px 0 0',
                    }}
                  >
                    {new Date(ann.created_at).toLocaleDateString('en-PK', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Audience Badge */}
                <div style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      background:
                        annAudience === 'dashboard'
                          ? 'rgba(16, 185, 129, 0.12)'
                          : 'rgba(107, 78, 255, 0.12)',
                      color:
                        annAudience === 'dashboard' ? '#047857' : 'var(--color-primary)',
                      border: `1px solid ${
                        annAudience === 'dashboard'
                          ? 'rgba(16, 185, 129, 0.3)'
                          : 'rgba(107, 78, 255, 0.3)'
                      }`,
                      fontFamily: 'var(--font-sans)',
                      display: 'inline-block',
                    }}
                  >
                    {annAudience === 'dashboard' ? 'Dashboard' : 'Homepage'}
                  </span>
                </div>

                {/* Status */}
                <div style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '500',
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: ann.is_active ? '#EAF3DE' : 'var(--color-surface)',
                      color: ann.is_active ? '#27500A' : 'var(--color-steel)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {ann.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Actions */}
                <div
                  style={{
                    padding: '14px 16px',
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    onClick={() => startEditing(ann)}
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-hairline)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '5px 9px',
                      fontSize: '12px',
                      color: 'var(--color-ink-deep)',
                      fontFamily: 'var(--font-sans)',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>

                  {!ann.is_active ? (
                    <button
                      onClick={() => handleActivate(ann.id, annAudience)}
                      style={{
                        background: '#EAF3DE',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        padding: '5px 9px',
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
                        padding: '5px 9px',
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
                      padding: '5px 9px',
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
            )
          })
        ) : (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-slate)',
                fontFamily: 'var(--font-sans)',
                margin: '0',
              }}
            >
              No announcements found — use the form above to add one
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingAnnouncement && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-announcement-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingAnnouncement(null)
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: 'var(--color-canvas)',
              border: '1px solid var(--color-hairline)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <h3
              id="edit-announcement-title"
              style={{
                fontSize: '17px',
                fontWeight: '600',
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 16px',
              }}
            >
              Edit Announcement
            </h3>

            {editError && (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  marginBottom: '16px',
                }}
              >
                <p
                  style={{
                    fontSize: '13px',
                    color: '#DC2626',
                    fontFamily: 'var(--font-sans)',
                    margin: '0',
                  }}
                >
                  {editError}
                </p>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="edit-audience-select"
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'var(--color-slate)',
                  marginBottom: '6px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Audience
              </label>
              <select
                id="edit-audience-select"
                value={editAudience}
                onChange={(e) => setEditAudience(e.target.value as 'homepage' | 'dashboard')}
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 12px',
                  background: 'var(--color-canvas)',
                  border: '1px solid var(--color-hairline-strong)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  color: 'var(--color-ink)',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                }}
              >
                <option value="homepage">Homepage</option>
                <option value="dashboard">Dashboard</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label
                htmlFor="edit-announcement-text"
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'var(--color-slate)',
                  marginBottom: '6px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Announcement Text
              </label>
              <textarea
                id="edit-announcement-text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--color-canvas)',
                  border: '1px solid var(--color-hairline-strong)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  color: 'var(--color-ink)',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >
              <button
                type="button"
                onClick={() => setEditingAnnouncement(null)}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 16px',
                  fontSize: '13px',
                  color: 'var(--color-slate)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={editLoading}
                style={{
                  background: editLoading ? 'var(--color-muted)' : 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: editLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
