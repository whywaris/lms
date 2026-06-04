'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Redirect {
  id: string
  source: string
  destination: string
  is_permanent: boolean
  created_at: string
}

interface Props {
  initialRedirects: Redirect[]
}

export default function RedirectManager({ initialRedirects }: Props) {
  const supabase = createClient()
  const [redirects, setRedirects] = useState<Redirect[]>(initialRedirects)
  const [source, setSource] = useState('')
  const [destination, setDestination] = useState('')
  const [isPermanent, setIsPermanent] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function handleAdd() {
    if (!source.trim() || !destination.trim()) {
      setError('Source aur destination dono required hain')
      return
    }

    // Source must start with /
    const cleanSource = source.startsWith('/') ? source : `/${source}`
    const cleanDest = destination.startsWith('/') ? destination : `/${destination}`

    setLoading(true)
    setError('')

    const { data, error: insertError } = await supabase
      .from('redirects')
      .insert({
        source: cleanSource,
        destination: cleanDest,
        is_permanent: isPermanent,
      })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setRedirects([data, ...redirects])
    setSource('')
    setDestination('')
    setLoading(false)
    showToast('✅ Redirect added — restart server to apply')
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this redirect?')) return
    await supabase.from('redirects').delete().eq('id', id)
    setRedirects(redirects.filter(r => r.id !== id))
    showToast('❌ Redirect deleted — restart server to apply')
  }

  return (
    <div style={{ marginTop: '32px' }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--color-ink-deep)',
          fontFamily: 'var(--font-sans)',
          margin: '0',
        }}>
          URL Redirects
        </h2>
        <span style={{
          fontSize: '12px',
          color: 'var(--color-steel)',
          fontFamily: 'var(--font-sans)',
          background: 'var(--color-tint-yellow)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
        }}>
          ⚠️ Restart server after changes
        </span>
      </div>

      {/* Add Form */}
      <div style={{
        background: 'var(--color-canvas)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginBottom: '20px',
      }}>
        {error && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '13px',
            color: '#DC2626',
            fontFamily: 'var(--font-sans)',
          }}>
            {error}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr auto auto',
          gap: '12px',
          alignItems: 'end',
        }}>

          {/* Source */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '500',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-sans)',
              marginBottom: '6px',
            }}>
              From (source)
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="/old-url-slug"
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
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

          {/* Destination */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '500',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-sans)',
              marginBottom: '6px',
            }}>
              To (destination)
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="/new-url-slug"
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
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

          {/* Type Toggle */}
          <div style={{ paddingBottom: '2px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '500',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-sans)',
              marginBottom: '6px',
            }}>
              Type
            </label>
            <select
              value={isPermanent ? 'permanent' : 'temporary'}
              onChange={(e) => setIsPermanent(e.target.value === 'permanent')}
              style={{
                height: '40px',
                padding: '0 10px',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                background: 'var(--color-canvas)',
              }}
            >
              <option value="permanent">301 Permanent</option>
              <option value="temporary">302 Temporary</option>
            </select>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            disabled={loading}
            style={{
              height: '40px',
              padding: '0 20px',
              background: loading ? 'var(--color-muted)' : 'var(--color-ink-deep)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'var(--font-sans)',
              cursor: loading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'Adding...' : '+ Add'}
          </button>
        </div>
      </div>

      {/* Redirects Table */}
      <div style={{
        background: 'var(--color-canvas)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 100px 120px',
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-hairline)',
        }}>
          {['From', 'To', 'Type', 'Action'].map((col) => (
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
        {redirects.length > 0 ? (
          redirects.map((redirect, index) => (
            <div
              key={redirect.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 100px 120px',
                borderBottom: index === redirects.length - 1
                  ? 'none'
                  : '1px solid var(--color-hairline-soft)',
                alignItems: 'center',
              }}
            >
              <div style={{ padding: '14px 16px' }}>
                <code style={{
                  fontSize: '13px',
                  color: 'var(--color-ink-deep)',
                  fontFamily: 'monospace',
                  background: 'var(--color-surface)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-xs)',
                }}>
                  {redirect.source}
                </code>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <code style={{
                  fontSize: '13px',
                  color: 'var(--color-primary)',
                  fontFamily: 'monospace',
                  background: 'var(--color-tint-lavender)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-xs)',
                }}>
                  {redirect.destination}
                </code>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '500',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: redirect.is_permanent ? 'var(--color-badge-lifetime-bg)' : 'var(--color-surface-soft)',
                  color: redirect.is_permanent ? 'var(--color-badge-lifetime-text)' : 'var(--color-ink-deep)',
                  fontFamily: 'var(--font-sans)',
                }}>
                  {redirect.is_permanent ? '301' : '302'}
                </span>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <button
                  onClick={() => handleDelete(redirect.id)}
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
              No redirects yet — add one above
            </p>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          background: 'var(--color-ink-deep)',
          color: 'white',
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: 'var(--font-sans)',
          zIndex: 1000,
          boxShadow: 'var(--shadow-lg)',
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}
