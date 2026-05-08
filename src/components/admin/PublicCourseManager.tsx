'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import RichTextEditor from '@/components/admin/RichTextEditor'

interface PublicCourse {
  id: string
  course_name: string
  slug: string | null
  mentor: string | null
  category: string | null
  description: string | null
  short_description: string | null
  image_url: string | null
  proof_image_url: string | null
  is_published: boolean
  tags: string[] | null
  created_at: string
}

interface Props {
  initialCourses: PublicCourse[]
}

const emptyForm = {
  course_name: '',
  slug: '',
  mentor: '',
  category: '',
  description: '',
  short_description: '',
  image_url: '',
  proof_image_url: '',
  is_published: true,
  tags: '',
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const inputStyle = {
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
  boxSizing: 'border-box' as const,
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '500' as const,
  color: 'var(--color-ink)',
  fontFamily: 'var(--font-sans)',
  marginBottom: '6px',
}

export default function PublicCourseManager({ initialCourses }: Props) {
  const supabase = createClient()
  const [courses, setCourses] = useState<PublicCourse[]>(initialCourses)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 20

  function openAdd() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
    setError('')
  }

  function openEdit(course: PublicCourse) {
    setForm({
      course_name: course.course_name,
      slug: course.slug || '',
      mentor: course.mentor || '',
      category: course.category || '',
      description: course.description || '',
      short_description: course.short_description || '',
      image_url: course.image_url || '',
      proof_image_url: course.proof_image_url || '',
      is_published: course.is_published,
      tags: course.tags?.join(', ') || '',
    })
    setEditingId(course.id)
    setShowForm(true)
    setError('')
  }

  async function handleSave() {
    if (!form.course_name.trim()) { setError('Course name is required'); return }
    if (!form.slug.trim()) { setError('Slug is required'); return }

    setLoading(true)
    setError('')

    const payload = {
      course_name: form.course_name,
      slug: form.slug,
      mentor: form.mentor || null,
      category: form.category || null,
      description: form.description || null,
      short_description: form.short_description || null,
      image_url: form.image_url || null,
      proof_image_url: form.proof_image_url || null,
      is_published: form.is_published,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : null,
    }

    if (editingId) {
      const { data, error: err } = await supabase
        .from('public_courses')
        .update(payload)
        .eq('id', editingId)
        .select()
        .single()

      if (err) { setError(err.message); setLoading(false); return }
      setCourses(courses.map(c => c.id === editingId ? data : c))
    } else {
      const { data, error: err } = await supabase
        .from('public_courses')
        .insert(payload)
        .select()
        .single()

      if (err) { setError(err.message); setLoading(false); return }
      setCourses([data, ...courses])
    }

    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setLoading(false)
  }

  async function handleTogglePublish(course: PublicCourse) {
    const { data } = await supabase
      .from('public_courses')
      .update({ is_published: !course.is_published })
      .eq('id', course.id)
      .select()
      .single()

    if (data) setCourses(courses.map(c => c.id === course.id ? data : c))
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this course?')) return
    await supabase.from('public_courses').delete().eq('id', id)
    setCourses(courses.filter(c => c.id !== id))
  }

  const filtered = courses.filter(c => {
    const matchSearch =
      c.course_name.toLowerCase().includes(search.toLowerCase()) ||
      (c.mentor || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.category || '').toLowerCase().includes(search.toLowerCase())

    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && c.is_published) ||
      (filterStatus === 'draft' && !c.is_published)

    return matchSearch && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => { setCurrentPage(1) }, [search, filterStatus])

  return (
    <div>

      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search public courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, width: '280px' }}
        />
        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['all', 'published', 'draft'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                height: '40px',
                padding: '0 16px',
                background: filterStatus === status
                  ? 'var(--color-ink-deep)'
                  : 'var(--color-canvas)',
                color: filterStatus === status
                  ? 'white'
                  : 'var(--color-slate)',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: '500',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {status === 'all'
                ? `All (${courses.length})`
                : status === 'published'
                  ? `Published (${courses.filter(c => c.is_published).length})`
                  : `Draft (${courses.filter(c => !c.is_published).length})`
              }
            </button>
          ))}
        </div>
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
          + Add Public Course
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
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-ink-deep)', fontFamily: 'var(--font-sans)', margin: '0 0 24px' }}>
            {editingId ? 'Edit Public Course' : 'Add Public Course'}
          </h3>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', color: '#DC2626', fontFamily: 'var(--font-sans)', margin: '0' }}>{error}</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

            <div>
              <label style={labelStyle}>Course Name *</label>
              <input
                type="text"
                value={form.course_name}
                onChange={(e) => setForm({ ...form, course_name: e.target.value, slug: generateSlug(e.target.value) })}
                placeholder="e.g. YouTube Automation Mastery"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="e.g. youtube-automation-mastery"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Mentor / Instructor</label>
              <input
                type="text"
                value={form.mentor}
                onChange={(e) => setForm({ ...form, mentor: e.target.value })}
                placeholder="e.g. Triston Vance"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. YouTube, Automation"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Course Image URL</label>
              <input
                type="url"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://..."
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Proof Image URL</label>
              <input
                type="url"
                value={form.proof_image_url}
                onChange={(e) => setForm({ ...form, proof_image_url: e.target.value })}
                placeholder="https://..."
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Short Description</label>
              <textarea
                value={form.short_description}
                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                placeholder="Brief course summary — shown on course page hero section (2-3 lines max)"
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
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  lineHeight: '1.6',
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
                Description (Rich Text)
              </label>
              <RichTextEditor
                content={form.description}
                onChange={(html) => setForm({ ...form, description: html })}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="pub_is_published"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="pub_is_published" style={{ ...labelStyle, marginBottom: '0', cursor: 'pointer' }}>
                Published (Visible to Public)
              </label>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Tags (comma separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="e.g. Next.js, React, SEO, Career"
                style={inputStyle}
              />
            </div>

          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--color-hairline)' }}>
            <button
              onClick={() => { setShowForm(false); setEditingId(null); setError('') }}
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
              {loading ? 'Saving...' : editingId ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: 'var(--color-canvas)', border: '1px solid var(--color-hairline)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 160px', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-hairline)' }}>
          {['Course Name', 'Mentor', 'Category', 'Status', 'Actions'].map((col) => (
            <div key={col} style={{ padding: '10px 16px', fontSize: '11px', fontWeight: '500', color: 'var(--color-steel)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-sans)' }}>
              {col}
            </div>
          ))}
        </div>

        {filtered.length > 0 ? (
          paginated.map((course, index) => (
            <div
              key={course.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1fr 1fr 160px',
                borderBottom: index === paginated.length - 1 ? 'none' : '1px solid var(--color-hairline-soft)',
                alignItems: 'center',
              }}
            >
              <div style={{ padding: '14px 16px' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-ink-deep)', fontFamily: 'var(--font-sans)', margin: '0 0 2px' }}>
                  {course.course_name}
                </p>
                {course.slug && (
                  <p style={{ fontSize: '12px', color: 'var(--color-steel)', fontFamily: 'var(--font-sans)', margin: '0' }}>
                    /course/{course.slug}
                  </p>
                )}
              </div>
              <div style={{ padding: '14px 16px' }}>
                <p style={{ fontSize: '13px', color: 'var(--color-charcoal)', fontFamily: 'var(--font-sans)', margin: '0' }}>
                  {course.mentor || '—'}
                </p>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <p style={{ fontSize: '13px', color: 'var(--color-charcoal)', fontFamily: 'var(--font-sans)', margin: '0' }}>
                  {course.category || '—'}
                </p>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <button
                  onClick={() => handleTogglePublish(course)}
                  style={{
                    background: course.is_published ? '#EAF3DE' : '#FEF2F2',
                    color: course.is_published ? '#27500A' : '#DC2626',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: '500',
                    fontFamily: 'var(--font-sans)',
                    cursor: 'pointer',
                  }}
                >
                  {course.is_published ? 'Published' : 'Draft'}
                </button>
              </div>
              <div style={{ padding: '14px 16px', display: 'flex', gap: '8px' }}>
                <button onClick={() => openEdit(course)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-hairline)', borderRadius: 'var(--radius-sm)', padding: '5px 10px', fontSize: '12px', color: 'var(--color-slate)', fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(course.id)} style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-sm)', padding: '5px 10px', fontSize: '12px', color: '#DC2626', fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'var(--color-slate)', fontFamily: 'var(--font-sans)', margin: '0' }}>
              {search ? 'No courses found' : 'No public courses yet — use the button above to add one'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
          <p style={{ fontSize: '13px', color: 'var(--color-steel)', fontFamily: 'var(--font-sans)', margin: '0' }}>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                height: '34px',
                padding: '0 12px',
                background: 'var(--color-canvas)',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                color: currentPage === 1 ? 'var(--color-muted)' : 'var(--color-slate)',
                fontFamily: 'var(--font-sans)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  height: '34px',
                  minWidth: '34px',
                  padding: '0 8px',
                  background: currentPage === page ? 'var(--color-ink-deep)' : 'var(--color-canvas)',
                  color: currentPage === page ? 'white' : 'var(--color-slate)',
                  border: '1px solid var(--color-hairline-strong)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                height: '34px',
                padding: '0 12px',
                background: 'var(--color-canvas)',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                color: currentPage === totalPages ? 'var(--color-muted)' : 'var(--color-slate)',
                fontFamily: 'var(--font-sans)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
