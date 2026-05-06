'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { deleteBlogPost } from '@/app/actions/admin'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string | null
  reading_time: number | null
  cover_image: string | null
  author: string | null
  category: string | null
  is_published: boolean
  scheduled_at: string | null
  created_at: string
}

interface Props {
  initialPosts: BlogPost[]
}

const emptyForm = {
  title: '',
  slug: '',
  content: '',
  reading_time: 1,
  cover_image: '',
  author: 'Admin',
  category: '',
  is_published: false,
  scheduled_at: '',
}

export default function BlogManager({ initialPosts }: Props) {
  const supabase = createClient()
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  }

  function openAdd() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
    setError('')
  }

  function openEdit(post: BlogPost) {
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content || '',
      reading_time: post.reading_time || 1,
      cover_image: post.cover_image || '',
      author: 'Admin',
      category: post.category || '',
      is_published: post.is_published,
      scheduled_at: post.scheduled_at
        ? new Date(post.scheduled_at).toISOString().slice(0, 16)
        : '',
    })
    setEditingId(post.id)
    setShowForm(true)
    setError('')
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }
    if (!form.slug.trim()) {
      setError('Slug is required')
      return
    }

    setLoading(true)
    setError('')

    const payload = {
      ...form,
      author: 'Admin',
      scheduled_at: form.scheduled_at
        ? new Date(form.scheduled_at).toISOString()
        : null,
      reading_time: Number(form.reading_time),
    }

    if (editingId) {
      const { data, error: updateError } = await supabase
        .from('blog_posts')
        .update(payload)
        .eq('id', editingId)
        .select()
        .single()

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      setPosts(posts.map(p => p.id === editingId ? data : p))
    } else {
      const { data, error: insertError } = await supabase
        .from('blog_posts')
        .insert(payload)
        .select()
        .single()

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }

      setPosts([data, ...posts])
    }

    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setLoading(false)
  }

  async function handleTogglePublish(post: BlogPost) {
    const { data } = await supabase
      .from('blog_posts')
      .update({ is_published: !post.is_published })
      .eq('id', post.id)
      .select()
      .single()

    if (data) setPosts(posts.map(p => p.id === post.id ? data : p))
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return
    try {
      await deleteBlogPost(id)
      setPosts(posts.filter(p => p.id !== id))
    } catch (err: unknown) {
      alert('Delete failed: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  return (
    <div>

      {/* Top Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px',
      }}>
        <button
          onClick={openAdd}
          style={{
            background: 'var(--color-ink-deep)',
            color: 'var(--color-on-dark)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
          }}
        >
          + New Post
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{
          background: 'var(--color-canvas)',
          border: '1px solid var(--color-hairline)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          marginBottom: '24px',
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--color-ink-deep)',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 24px',
          }}>
            {editingId ? 'Edit Post' : 'Write New Post'}
          </h3>

          {error && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              marginBottom: '20px',
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

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '16px',
          }}>

            {/* Title */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '6px',
              }}>
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({
                  ...form,
                  title: e.target.value,
                  slug: generateSlug(e.target.value),
                })}
                placeholder="Enter post title"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  background: 'var(--color-canvas)',
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

            {/* Slug */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '6px',
              }}>
                Slug *
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="post-url-slug"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  background: 'var(--color-canvas)',
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



            {/* Cover Image */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '6px',
              }}>
                Cover Image URL
              </label>
              <input
                type="url"
                value={form.cover_image}
                onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                placeholder="https://..."
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  background: 'var(--color-canvas)',
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

            {/* Category */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '6px',
              }}>
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Next.js"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  background: 'var(--color-canvas)',
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

            {/* Scheduled At */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '6px',
              }}>
                Schedule Publish (optional)
              </label>
              <input
                type="datetime-local"
                value={form.scheduled_at}
                onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  background: 'var(--color-canvas)',
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

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '6px',
              }}>
                Content (HTML)
              </label>
              <RichTextEditor
                content={form.content}
                onChange={(html) => setForm({
                  ...form,
                  content: html,
                  reading_time: calculateReadingTime(html),
                })}
              />
              <p style={{ fontSize: '12px', color: 'var(--color-steel)', fontFamily: 'var(--font-sans)', marginTop: '4px' }}>
                Estimated reading time: {form.reading_time} min
              </p>
            </div>

            {/* Published Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <input
                type="checkbox"
                id="blog_published"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="blog_published" style={{
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
              }}>
                Publish Now
              </label>
            </div>

          </div>

          {/* Form Actions */}
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
            paddingTop: '16px',
            borderTop: '1px solid var(--color-hairline)',
          }}>
            <button
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
                setError('')
              }}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '9px 20px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-slate)',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                background: loading ? 'var(--color-muted)' : 'var(--color-ink-deep)',
                color: 'var(--color-on-dark)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '9px 20px',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'var(--font-sans)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Saving...' : editingId ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>
      )}

      {/* Posts Table */}
      <div style={{
        background: 'var(--color-canvas)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>

        {/* Column Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 160px',
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-hairline)',
        }}>
          {['Title', 'Category', 'Author', 'Reading Time', 'Status', 'Actions'].map((col) => (
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
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div
              key={post.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 160px',
                borderBottom: index === posts.length - 1
                  ? 'none'
                  : '1px solid var(--color-hairline-soft)',
                alignItems: 'center',
              }}
            >
              {/* Title */}
              <div style={{ padding: '14px 16px' }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--color-ink-deep)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0 0 2px',
                }}>
                  {post.title}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--color-steel)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0',
                }}>
                  /{post.slug}
                </p>
                {post.scheduled_at && !post.is_published && (
                  <p style={{
                    fontSize: '11px',
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-sans)',
                    margin: '4px 0 0',
                  }}>
                    🕐 Scheduled: {new Date(post.scheduled_at).toLocaleDateString('en-PK', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>

              {/* Category */}
              <div style={{ padding: '14px 16px' }}>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--color-charcoal)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0',
                }}>
                  {post.category || '—'}
                </p>
              </div>

              {/* Author */}
              <div style={{ padding: '14px 16px' }}>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--color-charcoal)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0',
                }}>
                  {post.author || '—'}
                </p>
              </div>

              {/* Reading Time */}
              <div style={{ padding: '14px 16px' }}>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--color-charcoal)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0',
                }}>
                  {post.reading_time ? `${post.reading_time} min` : '—'}
                </p>
              </div>

              {/* Status */}
              <div style={{ padding: '14px 16px' }}>
                <button
                  onClick={() => handleTogglePublish(post)}
                  style={{
                    background: post.is_published ? '#EAF3DE' : '#FEF2F2',
                    color: post.is_published ? '#27500A' : '#DC2626',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: '500',
                    fontFamily: 'var(--font-sans)',
                    cursor: 'pointer',
                  }}
                >
                  {post.is_published ? 'Published' : 'Draft'}
                </button>
              </div>

              {/* Actions */}
              <div style={{
                padding: '14px 16px',
                display: 'flex',
                gap: '8px',
              }}>
                <button
                  onClick={() => openEdit(post)}
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
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
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
              No posts yet — use the button above to add one
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
