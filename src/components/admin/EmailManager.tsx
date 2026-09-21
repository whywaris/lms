'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import {
  announcementTemplate,
  newCoursesTemplate,
  formatAdminBody,
  CoursePreview,
} from '@/lib/email/templates'

interface Campaign {
  id: string
  subject: string
  template: string
  audience: 'all' | 'free' | 'premium'
  body: string
  status: 'draft' | 'sending' | 'sent' | 'failed'
  recipients_count: number
  sent_count: number
  failed_count: number
  created_at: string
  sent_at: string | null
}

interface EmailLog {
  id: string
  campaign_id: string | null
  user_id: string | null
  to_email: string
  template: string
  subject: string
  status: 'sent' | 'failed'
  resend_id: string | null
  error: string | null
  created_at: string
}

interface CourseItem {
  id: string
  course_name: string
  slug: string
  image_url: string | null
}

interface Props {
  initialCampaigns: Campaign[]
  initialLogs: EmailLog[]
  publishedCourses: CourseItem[]
  adminEmail: string
}

export default function EmailManager({
  initialCampaigns,
  initialLogs,
  publishedCourses,
  adminEmail,
}: Props) {
  // Campaigns & Logs state
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)
  const [logs, setLogs] = useState<EmailLog[]>(initialLogs)

  // Form state
  const [audience, setAudience] = useState<'all' | 'free' | 'premium'>('all')
  const [template, setTemplate] = useState<'announcement' | 'new_courses'>('announcement')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([])

  // Recipient count state
  const [recipientCount, setRecipientCount] = useState<number | null>(null)
  const [countLoading, setCountLoading] = useState(false)

  // Sending state
  const [testSending, setTestSending] = useState(false)
  const [campaignSending, setCampaignSending] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Logs table filter
  const [filterFailedOnly, setFilterFailedOnly] = useState(false)

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Ref and modal state for email body formatting toolbar
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [linkModal, setLinkModal] = useState<{
    isOpen: boolean
    type: 'link' | 'button'
    label: string
    url: string
    error: string
  }>({
    isOpen: false,
    type: 'link',
    label: '',
    url: '',
    error: '',
  })

  function handleFormatText(prefix: string, suffix: string, placeholder: string) {
    const textarea = textareaRef.current
    if (!textarea) {
      setBody((prev) => `${prev}${prefix}${placeholder}${suffix}`)
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = body.slice(start, end)

    let replacement = ''
    let newStart = start
    let newEnd = end

    if (selected) {
      replacement = `${prefix}${selected}${suffix}`
      newStart = start + prefix.length
      newEnd = newStart + selected.length
    } else {
      replacement = `${prefix}${placeholder}${suffix}`
      newStart = start + prefix.length
      newEnd = newStart + placeholder.length
    }

    const newBody = body.slice(0, start) + replacement + body.slice(end)
    setBody(newBody)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newStart, newEnd)
    }, 0)
  }

  function openInsertModal(type: 'link' | 'button') {
    const textarea = textareaRef.current
    let selected = ''
    if (textarea) {
      selected = body.slice(textarea.selectionStart, textarea.selectionEnd)
    }
    setLinkModal({
      isOpen: true,
      type,
      label: selected || '',
      url: 'https://',
      error: '',
    })
  }

  function handleConfirmInsert() {
    const { type, label, url } = linkModal
    const trimmedLabel = label.trim()
    const trimmedUrl = url.trim()

    if (!trimmedLabel) {
      setLinkModal((prev) => ({ ...prev, error: 'Please enter a label or link text.' }))
      return
    }

    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      setLinkModal((prev) => ({ ...prev, error: 'URL must start with http:// or https://' }))
      return
    }

    const snippet = type === 'button'
      ? `\n[button: ${trimmedLabel}](${trimmedUrl})\n`
      : `[${trimmedLabel}](${trimmedUrl})`

    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newBody = body.slice(0, start) + snippet + body.slice(end)
      setBody(newBody)
      setTimeout(() => {
        textarea.focus()
        const newPos = start + snippet.length
        textarea.setSelectionRange(newPos, newPos)
      }, 0)
    } else {
      setBody((prev) => `${prev} ${snippet}`)
    }

    setLinkModal({ isOpen: false, type: 'link', label: '', url: '', error: '' })
  }

  function handleInsertName() {
    const textarea = textareaRef.current
    if (!textarea) {
      setBody((prev) => `${prev} {{name}} `)
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const snippet = '{{name}}'
    const newBody = body.slice(0, start) + snippet + body.slice(end)
    setBody(newBody)

    setTimeout(() => {
      textarea.focus()
      const pos = start + snippet.length
      textarea.setSelectionRange(pos, pos)
    }, 0)
  }

  // Fetch recipient count whenever audience changes
  useEffect(() => {
    let isMounted = true
    setCountLoading(true)
    fetch(`/api/admin/emails/audience-count?audience=${audience}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (typeof data.count === 'number') {
            setRecipientCount(data.count)
          }
          setCountLoading(false)
        }
      })
      .catch((err) => {
        console.error('Error fetching recipient count:', err)
        if (isMounted) setCountLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [audience])

  // Toggle selected course for new_courses template (up to 4)
  function toggleCourse(courseId: string) {
    if (selectedCourseIds.includes(courseId)) {
      setSelectedCourseIds(selectedCourseIds.filter((id) => id !== courseId))
    } else {
      if (selectedCourseIds.length >= 4) {
        showToast('You can select up to 4 courses for the email.', 'error')
        return
      }
      setSelectedCourseIds([...selectedCourseIds, courseId])
    }
  }

  // Live HTML preview generation
  const previewHtml = useMemo(() => {
    const sampleName = 'Alex'
    const dummyUnsub = 'https://pandacourses.com/unsubscribe?token=sample'
    const formattedBody = formatAdminBody(body, sampleName)

    if (template === 'new_courses') {
      const selectedCourses: CoursePreview[] = publishedCourses
        .filter((c) => selectedCourseIds.includes(c.id))
        .map((c) => ({
          course_name: c.course_name,
          slug: c.slug,
          image_url: c.image_url,
        }))

      // Fallback to top 2-4 published courses if none selected yet
      const coursesToShow =
        selectedCourses.length > 0
          ? selectedCourses
          : publishedCourses.slice(0, 3).map((c) => ({
              course_name: c.course_name,
              slug: c.slug,
              image_url: c.image_url,
            }))

      return newCoursesTemplate({
        name: sampleName,
        courses: coursesToShow,
        bodyHtml: formattedBody,
        unsubscribeUrl: dummyUnsub,
      }).html
    }

    return announcementTemplate({
      name: sampleName,
      subject: subject || 'Your Announcement Subject',
      bodyHtml: formattedBody || '<p style="color: #6B7280;">Your message content will appear here...</p>',
      unsubscribeUrl: dummyUnsub,
    }).html
  }, [body, subject, template, selectedCourseIds, publishedCourses])

  // Handle Send Test Email
  async function handleSendTest() {
    if (!subject.trim()) {
      showToast('Please enter a subject before sending a test.', 'error')
      return
    }

    setTestSending(true)
    try {
      const res = await fetch('/api/admin/emails/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template,
          subject,
          body,
          courseIds: selectedCourseIds,
        }),
      })

      const data = await res.json()
      if (res.ok && data.ok) {
        showToast(`✅ Test email sent to ${adminEmail}`)
      } else {
        showToast(`❌ ${data.error || 'Failed to send test email'}`, 'error')
      }
    } catch (err: unknown) {
      showToast(`❌ ${err instanceof Error ? err.message : 'Error sending test'}`, 'error')
    } finally {
      setTestSending(false)
    }
  }

  // Handle Send Campaign
  async function handleSendCampaign() {
    if (!subject.trim()) {
      showToast('Please enter an email subject.', 'error')
      return
    }
    if (recipientCount === 0) {
      showToast('Cannot send: audience has 0 eligible recipients.', 'error')
      return
    }

    setCampaignSending(true)
    setShowConfirmModal(false)

    try {
      const res = await fetch('/api/admin/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audience,
          template,
          subject,
          body,
          courseIds: selectedCourseIds,
        }),
      })

      const data = await res.json()
      if (res.ok && data.ok) {
        showToast(
          `🚀 Campaign sent! ${data.sentCount} delivered, ${data.failedCount} failed.`
        )

        // Add campaign to top of list
        const newCampaign: Campaign = {
          id: data.campaignId,
          subject: subject.trim(),
          template,
          audience,
          body,
          status: data.status,
          recipients_count: data.recipientsCount,
          sent_count: data.sentCount,
          failed_count: data.failedCount,
          created_at: new Date().toISOString(),
          sent_at: new Date().toISOString(),
        }
        setCampaigns([newCampaign, ...campaigns])

        // Reset form
        setSubject('')
        setBody('')
        setSelectedCourseIds([])
      } else {
        showToast(`❌ ${data.error || 'Failed to dispatch campaign'}`, 'error')
      }
    } catch (err: unknown) {
      showToast(`❌ ${err instanceof Error ? err.message : 'Error sending campaign'}`, 'error')
    } finally {
      setCampaignSending(false)
    }
  }

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    if (filterFailedOnly) return log.status === 'failed'
    return true
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            padding: '12px 20px',
            borderRadius: '8px',
            background: toast.type === 'error' ? '#EF4444' : '#10B981',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 48px rgba(0,0,0,0.25)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--color-ink-deep)',
                margin: '0 0 12px',
              }}
            >
              Confirm Email Campaign
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-slate)',
                lineHeight: 1.5,
                margin: '0 0 20px',
              }}
            >
              Are you sure you want to broadcast this email? This action will deliver emails to real users and cannot be cancelled once launched.
            </p>

            <div
              style={{
                background: 'var(--color-surface)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
                fontSize: '13px',
                lineHeight: 1.6,
                color: 'var(--color-ink-deep)',
              }}
            >
              <div>
                <strong>Audience:</strong>{' '}
                <span style={{ textTransform: 'capitalize' }}>{audience}</span> users ({recipientCount ?? '...'} eligible recipients)
              </div>
              <div>
                <strong>Template:</strong>{' '}
                <span style={{ textTransform: 'capitalize' }}>{template.replace('_', ' ')}</span>
              </div>
              <div>
                <strong>Subject:</strong> {subject}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={campaignSending}
                style={{
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-hairline)',
                  background: '#FFFFFF',
                  color: 'var(--color-slate)',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendCampaign}
                disabled={campaignSending}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {campaignSending ? 'Sending Campaign...' : 'Confirm & Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Section: Compose Form + Live Preview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '32px',
          alignItems: 'start',
        }}
      >
        {/* Compose Form */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--color-ink-deep)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 20px',
            }}
          >
            Compose Campaign
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Audience Row */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-ink-deep)',
                  marginBottom: '6px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Audience
              </label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as any)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-hairline)',
                    background: '#FFFFFF',
                    fontSize: '14px',
                    color: 'var(--color-ink-deep)',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                  }}
                >
                  <option value="all">All Users (Free + Lifetime)</option>
                  <option value="free">Free Users Only</option>
                  <option value="premium">Premium (Lifetime) Members Only</option>
                </select>

                <div
                  style={{
                    padding: '8px 12px',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-hairline)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-slate)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {countLoading ? '...' : `${recipientCount ?? 0} recipients`}
                </div>
              </div>
            </div>

            {/* Template Select */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-ink-deep)',
                  marginBottom: '6px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Template
              </label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-hairline)',
                  background: '#FFFFFF',
                  fontSize: '14px',
                  color: 'var(--color-ink-deep)',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                }}
              >
                <option value="announcement">Announcement / Custom Message</option>
                <option value="new_courses">New Courses Showcase</option>
              </select>
            </div>

            {/* Course Picker (if new_courses) */}
            {template === 'new_courses' && (
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-ink-deep)',
                    marginBottom: '6px',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  Select Featured Courses (up to 4)
                </label>
                <div
                  style={{
                    maxHeight: '140px',
                    overflowY: 'auto',
                    border: '1px solid var(--color-hairline)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px',
                    background: 'var(--color-surface)',
                  }}
                >
                  {publishedCourses.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--color-steel)', margin: 0 }}>
                      No published courses found.
                    </p>
                  ) : (
                    publishedCourses.map((c) => {
                      const isSelected = selectedCourseIds.includes(c.id)
                      return (
                        <label
                          key={c.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            background: isSelected ? '#EDE9FE' : 'transparent',
                            fontSize: '13px',
                            color: 'var(--color-ink-deep)',
                            marginBottom: '2px',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleCourse(c.id)}
                          />
                          <span>{c.course_name}</span>
                        </label>
                      )
                    })
                  )}
                </div>
              </div>
            )}

            {/* Subject */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-ink-deep)',
                  marginBottom: '6px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Major Platform Update &amp; New Features!"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-hairline)',
                  fontSize: '14px',
                  color: 'var(--color-ink-deep)',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Body */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <label
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-ink-deep)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  Email Body
                </label>

                {/* Formatting Toolbar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleFormatText('**', '**', 'bold text')}
                    title="Bold (**text**)"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-hairline)',
                      borderRadius: '4px',
                      padding: '4px 9px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'var(--color-ink-deep)',
                      cursor: 'pointer',
                      lineHeight: 1,
                    }}
                  >
                    B
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFormatText('_', '_', 'italic text')}
                    title="Italic (_text_)"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-hairline)',
                      borderRadius: '4px',
                      padding: '4px 9px',
                      fontSize: '12px',
                      fontWeight: 600,
                      fontStyle: 'italic',
                      color: 'var(--color-ink-deep)',
                      cursor: 'pointer',
                      lineHeight: 1,
                    }}
                  >
                    I
                  </button>

                  <button
                    type="button"
                    onClick={() => openInsertModal('link')}
                    title="Insert Link [text](url)"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-hairline)',
                      borderRadius: '4px',
                      padding: '4px 9px',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: 'var(--color-ink-deep)',
                      cursor: 'pointer',
                      lineHeight: 1,
                    }}
                  >
                    🔗 Link
                  </button>

                  <button
                    type="button"
                    onClick={() => openInsertModal('button')}
                    title="Insert CTA Button [button: label](url)"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-hairline)',
                      borderRadius: '4px',
                      padding: '4px 9px',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: 'var(--color-ink-deep)',
                      cursor: 'pointer',
                      lineHeight: 1,
                    }}
                  >
                    🔘 Button
                  </button>

                  <button
                    type="button"
                    onClick={handleInsertName}
                    title="Insert recipient name placeholder"
                    style={{
                      background: 'var(--color-tint-lavender)',
                      border: '1px solid #E9D5FF',
                      borderRadius: '4px',
                      padding: '4px 9px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                      cursor: 'pointer',
                      lineHeight: 1,
                    }}
                  >
                    + Insert {'{{name}}'}
                  </button>
                </div>
              </div>

              {/* Inline Link / Button Modal Form */}
              {linkModal.isOpen && (
                <div
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-hairline-strong)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    marginBottom: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink-deep)', fontFamily: 'var(--font-sans)' }}>
                      {linkModal.type === 'button' ? '🔘 Insert CTA Button' : '🔗 Insert Inline Link'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLinkModal((prev) => ({ ...prev, isOpen: false, error: '' }))}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '15px',
                        color: 'var(--color-steel)',
                        cursor: 'pointer',
                        padding: '0 4px',
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--color-slate)', marginBottom: '3px', fontFamily: 'var(--font-sans)' }}>
                        {linkModal.type === 'button' ? 'Button Label' : 'Link Text'}
                      </label>
                      <input
                        type="text"
                        value={linkModal.label}
                        onChange={(e) => setLinkModal((prev) => ({ ...prev, label: e.target.value, error: '' }))}
                        placeholder={linkModal.type === 'button' ? 'e.g. Explore All Courses' : 'e.g. visit our catalog'}
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-hairline)',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: 'var(--font-sans)',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--color-slate)', marginBottom: '3px', fontFamily: 'var(--font-sans)' }}>
                        Destination URL
                      </label>
                      <input
                        type="url"
                        value={linkModal.url}
                        onChange={(e) => setLinkModal((prev) => ({ ...prev, url: e.target.value, error: '' }))}
                        placeholder="https://pandacourses.com/..."
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-hairline)',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: 'var(--font-sans)',
                        }}
                      />
                    </div>

                    {linkModal.error && (
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#DC2626', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>
                        {linkModal.error}
                      </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setLinkModal((prev) => ({ ...prev, isOpen: false, error: '' }))}
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--color-hairline)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '5px 12px',
                          fontSize: '12px',
                          color: 'var(--color-slate)',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-sans)',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmInsert}
                        style={{
                          background: 'var(--color-primary)',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          padding: '5px 14px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-sans)',
                        }}
                      >
                        Insert {linkModal.type === 'button' ? 'Button' : 'Link'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <textarea
                ref={textareaRef}
                rows={7}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your email here... Blank lines turn into paragraphs, URLs are auto-linked, and {{name}} is personalized per recipient."
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-hairline)',
                  fontSize: '14px',
                  color: 'var(--color-ink-deep)',
                  fontFamily: 'var(--font-sans)',
                  lineHeight: 1.5,
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />

              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--color-steel)',
                  fontFamily: 'var(--font-sans)',
                  marginTop: '6px',
                  marginBottom: 0,
                }}
              >
                Format: **bold**, _italic_, [text](url), [button: label](url)
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={handleSendTest}
                disabled={testSending || campaignSending}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-hairline)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-ink-deep)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
              >
                {testSending ? 'Sending Test...' : 'Send Test to Me'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!subject.trim()) {
                    showToast('Please enter a subject line first.', 'error')
                    return
                  }
                  setShowConfirmModal(true)
                }}
                disabled={campaignSending || countLoading || recipientCount === 0}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: recipientCount === 0 ? 'not-allowed' : 'pointer',
                  opacity: recipientCount === 0 ? 0.6 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              >
                Send to Audience
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            height: 'fit-content',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                margin: 0,
              }}
            >
              Live HTML Preview
            </h3>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--color-steel)',
                background: 'var(--color-surface)',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              Personalized for &quot;Alex&quot;
            </span>
          </div>

          <div
            style={{
              border: '1px solid var(--color-hairline)',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#F3F4F6',
              maxHeight: '520px',
              overflowY: 'auto',
            }}
          >
            <iframe
              title="Email Preview"
              srcDoc={previewHtml}
              style={{
                width: '100%',
                height: '500px',
                border: 'none',
                display: 'block',
                background: '#F3F4F6',
              }}
            />
          </div>
        </div>
      </div>

      {/* Campaigns History Section */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--color-hairline)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
        }}
      >
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--color-ink-deep)',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 20px',
          }}
        >
          Campaigns History
        </h2>

        {campaigns.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 24px',
              color: 'var(--color-steel)',
              fontSize: '14px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📬</div>
            No campaigns sent yet. Compose and launch your first email campaign above.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--color-hairline)',
                    color: 'var(--color-steel)',
                    textTransform: 'uppercase',
                    fontSize: '11px',
                    letterSpacing: '0.05em',
                  }}
                >
                  <th style={{ padding: '12px 16px' }}>Subject</th>
                  <th style={{ padding: '12px 16px' }}>Audience</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Delivered / Failed</th>
                  <th style={{ padding: '12px 16px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => {
                  let statusBadge = { bg: '#EDE9FE', color: '#6B4EFF' }
                  if (c.status === 'sent') statusBadge = { bg: '#EAF3DE', color: '#27500A' }
                  if (c.status === 'failed') statusBadge = { bg: '#FEF2F2', color: '#DC2626' }
                  if (c.status === 'sending') statusBadge = { bg: '#FEF3C7', color: '#B45309' }

                  return (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: '1px solid var(--color-hairline)',
                        color: 'var(--color-ink-deep)',
                      }}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>{c.subject}</td>
                      <td style={{ padding: '14px 16px', textTransform: 'capitalize' }}>
                        {c.audience}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            background: statusBadge.bg,
                            color: statusBadge.color,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                          }}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ color: '#10B981', fontWeight: 600 }}>{c.sent_count}</span> /{' '}
                        <span style={{ color: c.failed_count > 0 ? '#EF4444' : 'inherit' }}>
                          {c.failed_count}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-steel)' }}>
                        {new Date(c.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Email Logs Section */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--color-hairline)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--color-ink-deep)',
              fontFamily: 'var(--font-sans)',
              margin: 0,
            }}
          >
            Recent Email Logs (Latest 50)
          </h2>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: 'var(--color-slate)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <input
              type="checkbox"
              checked={filterFailedOnly}
              onChange={(e) => setFilterFailedOnly(e.target.checked)}
            />
            Show failed only
          </label>
        </div>

        {filteredLogs.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 24px',
              color: 'var(--color-steel)',
              fontSize: '14px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            No email logs found{filterFailedOnly ? ' matching failed status.' : '.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--color-hairline)',
                    color: 'var(--color-steel)',
                    textTransform: 'uppercase',
                    fontSize: '11px',
                    letterSpacing: '0.05em',
                  }}
                >
                  <th style={{ padding: '12px 16px' }}>Recipient</th>
                  <th style={{ padding: '12px 16px' }}>Template</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Error Details</th>
                  <th style={{ padding: '12px 16px' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    style={{
                      borderBottom: '1px solid var(--color-hairline)',
                      color: 'var(--color-ink-deep)',
                    }}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: 500 }}>{log.to_email}</td>
                    <td style={{ padding: '14px 16px', textTransform: 'capitalize' }}>
                      {log.template.replace('_', ' ')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          background: log.status === 'sent' ? '#EAF3DE' : '#FEF2F2',
                          color: log.status === 'sent' ? '#27500A' : '#DC2626',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                        }}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '14px 16px',
                        color: log.error ? '#DC2626' : 'var(--color-steel)',
                        maxWidth: '240px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={log.error || undefined}
                    >
                      {log.error || '—'}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-steel)' }}>
                      {new Date(log.created_at).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
