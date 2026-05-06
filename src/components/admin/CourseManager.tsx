'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Course {
  id: string
  course_name: string
  mentor: string | null
  category: string | null
  drive_link: string | null
  source: string | null
  plan_access: string
  is_published: boolean
  created_at: string
}

interface Props {
  initialCourses: Course[]
}

const emptyForm = {
  course_name: '',
  mentor: 'Adam',
  category: '',
  drive_link: '',
  source: '',
  plan_access: 'both',
  is_published: true,
}

export default function CourseManager({ initialCourses }: Props) {
  const supabase = createClient()
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  function openAdd() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
    setError('')
  }

  function openEdit(course: Course) {
    setForm({
      course_name: course.course_name,
      mentor: course.mentor || '',
      category: course.category || '',
      drive_link: course.drive_link || '',
      source: course.source || '',
      plan_access: course.plan_access,
      is_published: course.is_published,
    })
    setEditingId(course.id)
    setShowForm(true)
    setError('')
  }

  async function handleSave() {
    if (!form.course_name.trim()) {
      setError('Course name is required')
      return
    }

    setLoading(true)
    setError('')

    if (editingId) {
      // Update
      const { data, error: updateError } = await supabase
        .from('courses')
        .update(form)
        .eq('id', editingId)
        .select()
        .single()

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      setCourses(courses.map(c => c.id === editingId ? data : c))
    } else {
      // Insert
      const { data, error: insertError } = await supabase
        .from('courses')
        .insert(form)
        .select()
        .single()

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }

      setCourses([data, ...courses])
    }

    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setLoading(false)
  }

  async function handleTogglePublish(course: Course) {
    const { data } = await supabase
      .from('courses')
      .update({ is_published: !course.is_published })
      .eq('id', course.id)
      .select()
      .single()

    if (data) {
      setCourses(courses.map(c => c.id === course.id ? data : c))
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this course?')) return

    await supabase.from('courses').delete().eq('id', id)
    setCourses(courses.filter(c => c.id !== id))
  }

  const filtered = courses.filter(c =>
    c.course_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.mentor || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.category || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>

      {/* Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        gap: '16px',
        flexWrap: 'wrap',
      }}>

        {/* Search */}
        <input
          type="text"
          placeholder="Search courses..."
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
            width: '280px',
          }}
        />

        {/* Add Button */}
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
          + Add Course
        </button>
      </div>

      {/* Add/Edit Form */}
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
            {editingId ? 'Edit Course' : 'Add New Course'}
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

          {/* Form Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '16px',
          }}>

            {/* Course Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '6px',
              }}>
                Course Name *
              </label>
              <input
                type="text"
                value={form.course_name}
                onChange={(e) => setForm({ ...form, course_name: e.target.value })}
                placeholder="e.g. Complete Next.js Course"
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

            {/* Mentor */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '6px',
              }}>
                Mentor
              </label>
              <input
                type="text"
                value={form.mentor}
                onChange={(e) => setForm({ ...form, mentor: e.target.value })}
                placeholder="e.g. Adam"
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
                placeholder="e.g. Next.js, React"
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

            {/* Source */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '6px',
              }}>
                Source
              </label>
              <input
                type="text"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                placeholder="e.g. YouTube, Udemy"
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

            {/* Drive Link */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '6px',
              }}>
                Drive Link
              </label>
              <input
                type="url"
                value={form.drive_link}
                onChange={(e) => setForm({ ...form, drive_link: e.target.value })}
                placeholder="https://drive.google.com/..."
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

            {/* Plan Access */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '6px',
              }}>
                Plan Access
              </label>
              <select
                value={form.plan_access}
                onChange={(e) => setForm({ ...form, plan_access: e.target.value })}
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
              >
                <option value="both">Both (Monthly + Lifetime)</option>
                <option value="monthly">Monthly Only</option>
                <option value="lifetime">Lifetime Only</option>
              </select>
            </div>

            {/* Published Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              paddingTop: '22px',
            }}>
              <input
                type="checkbox"
                id="is_published"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="is_published" style={{
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
              }}>
                Published (Visible to Students)
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
              {loading ? 'Saving...' : editingId ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* Courses Table */}
      <div style={{
        background: 'var(--color-canvas)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>

        {/* Column Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 160px',
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-hairline)',
        }}>
          {['Course Name', 'Mentor', 'Category', 'Plan', 'Status', 'Actions'].map((col) => (
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
          filtered.map((course, index) => (
            <div
              key={course.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 160px',
                borderBottom: index === filtered.length - 1
                  ? 'none'
                  : '1px solid var(--color-hairline-soft)',
                alignItems: 'center',
              }}
            >
              {/* Course Name */}
              <div style={{ padding: '14px 16px' }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--color-ink-deep)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0',
                }}>
                  {course.course_name}
                </p>
              </div>

              {/* Mentor */}
              <div style={{ padding: '14px 16px' }}>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--color-charcoal)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0',
                }}>
                  {course.mentor || '—'}
                </p>
              </div>

              {/* Category */}
              <div style={{ padding: '14px 16px' }}>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--color-charcoal)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0',
                }}>
                  {course.category || '—'}
                </p>
              </div>

              {/* Plan */}
              <div style={{ padding: '14px 16px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '500',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: course.plan_access === 'lifetime'
                    ? 'var(--color-badge-lifetime-bg)'
                    : course.plan_access === 'monthly'
                      ? 'var(--color-badge-monthly-bg)'
                      : 'var(--color-tint-lavender)',
                  color: course.plan_access === 'lifetime'
                    ? 'var(--color-badge-lifetime-text)'
                    : course.plan_access === 'monthly'
                      ? 'var(--color-badge-monthly-text)'
                      : 'var(--color-badge-monthly-text)',
                  fontFamily: 'var(--font-sans)',
                }}>
                  {course.plan_access === 'both' ? 'Both' : course.plan_access}
                </span>
              </div>

              {/* Status Toggle */}
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

              {/* Actions */}
              <div style={{
                padding: '14px 16px',
                display: 'flex',
                gap: '8px',
              }}>
                <button
                  onClick={() => openEdit(course)}
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
                  onClick={() => handleDelete(course.id)}
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
          <div style={{
            padding: '48px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '14px',
              color: 'var(--color-slate)',
              fontFamily: 'var(--font-sans)',
              margin: '0',
            }}>
              {search ? 'No courses found' : 'No courses yet — use the button above to add one'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
