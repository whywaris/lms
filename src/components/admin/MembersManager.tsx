'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sendPlanActivatedEmail } from '@/app/actions/admin'

export interface Member {
  id: string
  full_name: string | null
  email: string
  plan: string | null
  plan_expires_at: string | null
  is_active: boolean
  created_at: string
  source?: string | null
  lifetime_activated_at?: string | null
  admin_notes?: string | null
}

interface Props {
  initialMembers: Member[]
}

type SortField = 'name' | 'plan' | 'created_at'
type SortOrder = 'asc' | 'desc'

type ConfirmActionType = 'lifetime' | 'free' | 'block' | 'unblock'

interface ConfirmDialogState {
  isOpen: boolean
  type: ConfirmActionType
  member: Member | null
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const PAGE_SIZE = 25

export default function MembersManager({ initialMembers }: Props) {
  const supabase = createClient()
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [search, setSearch] = useState('')
  const [filterPlan, setFilterPlan] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Sorting
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)

  // Actions Dropdown
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const menuContainerRef = useRef<HTMLDivElement | null>(null)

  // Confirmation Modal
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    type: 'lifetime',
    member: null,
  })

  // Edit Modal
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [editForm, setEditForm] = useState({
    plan: '',
    is_active: true,
    admin_notes: '',
  })

  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  function showToast(message: string) {
    setToast(message)
    setTimeout(() => setToast(''), 3500)
  }

  // Handle outside click & escape key for dropdown menu
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActiveMenuId(null)
        if (confirmDialog.isOpen) setConfirmDialog({ isOpen: false, type: 'lifetime', member: null })
        if (editingMember) setEditingMember(null)
      }
    }

    function handleMouseDown(e: MouseEvent) {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setActiveMenuId(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [confirmDialog.isOpen, editingMember])

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterPlan, filterStatus])

  // Sorting handler
  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder(field === 'created_at' ? 'desc' : 'asc')
    }
    setCurrentPage(1)
  }

  // Filter & Sort Logic
  const filteredAndSorted = useMemo(() => {
    const searchLower = search.toLowerCase().trim()

    const filtered = members.filter((m) => {
      const matchSearch =
        !searchLower ||
        (m.full_name || '').toLowerCase().includes(searchLower) ||
        m.email.toLowerCase().includes(searchLower) ||
        (m.source || '').toLowerCase().includes(searchLower)

      const matchPlan =
        filterPlan === 'all' ||
        (filterPlan === 'lifetime' && m.plan === 'lifetime') ||
        (filterPlan === 'free' && (!m.plan || m.plan === 'free'))

      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && m.is_active) ||
        (filterStatus === 'inactive' && !m.is_active)

      return matchSearch && matchPlan && matchStatus
    })

    filtered.sort((a, b) => {
      let comparison = 0
      if (sortField === 'name') {
        const nameA = (a.full_name || a.email).toLowerCase()
        const nameB = (b.full_name || b.email).toLowerCase()
        comparison = nameA.localeCompare(nameB)
      } else if (sortField === 'plan') {
        const planA = a.plan === 'lifetime' ? 1 : 0
        const planB = b.plan === 'lifetime' ? 1 : 0
        comparison = planA - planB
      } else if (sortField === 'created_at') {
        const timeA = new Date(a.created_at).getTime() || 0
        const timeB = new Date(b.created_at).getTime() || 0
        comparison = timeA - timeB
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [members, search, filterPlan, filterStatus, sortField, sortOrder])

  // Pagination Slice
  const totalItems = filteredAndSorted.length
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems)
  const paginatedMembers = filteredAndSorted.slice(startIndex, endIndex)

  // Open confirmation modal for an action
  function requestConfirm(type: ConfirmActionType, member: Member) {
    setActiveMenuId(null)
    setConfirmDialog({
      isOpen: true,
      type,
      member,
    })
  }

  // Execute confirmed action
  async function executeConfirmAction() {
    if (!confirmDialog.member) return
    const member = confirmDialog.member
    const type = confirmDialog.type
    setLoading(true)

    try {
      if (type === 'lifetime') {
        const now = new Date().toISOString()
        const { data, error } = await supabase
          .from('profiles')
          .update({
            plan: 'lifetime',
            plan_expires_at: null,
            is_active: true,
            lifetime_activated_at: now,
          })
          .eq('id', member.id)
          .select()
          .single()

        if (error) throw error

        if (data) {
          setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, ...data } : m)))

          let emailNote = ''
          try {
            const emailRes = await sendPlanActivatedEmail({
              userId: member.id,
              email: member.email,
              name: member.full_name,
            })
            emailNote = emailRes.ok ? ' (activation email sent)' : ' (activation email failed)'
          } catch {}

          await supabase.from('audit_logs').insert({
            action: `Plan assigned: lifetime${emailNote}`,
            target_user_email: member.email,
          })

          showToast(`⭐ Lifetime plan assigned to ${member.full_name || member.email}`)
        }
      } else if (type === 'free') {
        // Change to free, keep lifetime_activated_at untouched
        const { data, error } = await supabase
          .from('profiles')
          .update({
            plan: null,
            plan_expires_at: null,
          })
          .eq('id', member.id)
          .select()
          .single()

        if (error) throw error

        if (data) {
          setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, ...data } : m)))

          await supabase.from('audit_logs').insert({
            action: 'Plan updated to free',
            target_user_email: member.email,
          })

          showToast(`Free plan assigned to ${member.full_name || member.email}`)
        }
      } else if (type === 'block' || type === 'unblock') {
        const newStatus = type === 'unblock'
        const { data, error } = await supabase
          .from('profiles')
          .update({ is_active: newStatus })
          .eq('id', member.id)
          .select()
          .single()

        if (error) throw error

        if (data) {
          setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, ...data } : m)))

          await supabase.from('audit_logs').insert({
            action: newStatus ? 'Member unblocked' : 'Member blocked',
            target_user_email: member.email,
          })

          showToast(newStatus ? `✅ ${member.email} unblocked` : `🚫 ${member.email} blocked`)
        }
      }
    } catch (err: unknown) {
      showToast(`Error: ${err instanceof Error ? err.message : 'Action failed'}`)
    } finally {
      setLoading(false)
      setConfirmDialog({ isOpen: false, type: 'lifetime', member: null })
    }
  }

  // Open Edit Modal
  function openEditModal(member: Member) {
    setActiveMenuId(null)
    setEditingMember(member)
    setEditForm({
      plan: member.plan || '',
      is_active: member.is_active,
      admin_notes: member.admin_notes || '',
    })
  }

  // Save Edit Modal
  async function handleSaveEdit() {
    if (!editingMember) return
    setLoading(true)

    try {
      const isUpgradingToLifetime = editForm.plan === 'lifetime' && editingMember.plan !== 'lifetime'
      const now = new Date().toISOString()

      const payload: Record<string, unknown> = {
        plan: editForm.plan === '' ? null : editForm.plan,
        plan_expires_at: null,
        is_active: editForm.is_active,
        admin_notes: editForm.admin_notes ? editForm.admin_notes.trim() : null,
      }

      if (isUpgradingToLifetime) {
        payload.lifetime_activated_at = now
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', editingMember.id)
        .select()
        .single()

      if (error) throw error

      if (data) {
        setMembers((prev) => prev.map((m) => (m.id === editingMember.id ? { ...m, ...data } : m)))

        let emailNote = ''
        if (isUpgradingToLifetime) {
          try {
            const emailRes = await sendPlanActivatedEmail({
              userId: editingMember.id,
              email: editingMember.email,
              name: editingMember.full_name,
            })
            emailNote = emailRes.ok ? ' (activation email sent)' : ' (activation email failed)'
          } catch {}
        }

        await supabase.from('audit_logs').insert({
          action: `Profile updated: Plan=${editForm.plan || 'free'}, Active=${editForm.is_active}${emailNote}`,
          target_user_email: editingMember.email,
        })

        showToast(`Changes saved for ${editingMember.full_name || editingMember.email}`)
      }
      setEditingMember(null)
    } catch (err: unknown) {
      showToast(`Error: ${err instanceof Error ? err.message : 'Save failed'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Member Stats Row */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        {[
          {
            label: 'Total Members',
            value: members.length,
            bg: 'var(--color-tint-lavender)',
          },
          {
            label: 'Lifetime',
            value: members.filter((m) => m.plan === 'lifetime').length,
            bg: 'var(--color-badge-lifetime-bg)',
          },
          {
            label: 'No Plan',
            value: members.filter((m) => !m.plan).length,
            bg: 'var(--color-tint-peach)',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: stat.bg,
              borderRadius: 'var(--radius-md)',
              padding: '12px 20px',
              minWidth: '120px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '22px',
                fontWeight: '600',
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 4px',
              }}
            >
              {stat.value}
            </p>
            <p
              style={{
                fontSize: '11px',
                color: 'var(--color-charcoal)',
                fontFamily: 'var(--font-sans)',
                margin: '0',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filters Row */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, email or source..."
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

        {/* Plan Filter */}
        <select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          style={{
            height: '40px',
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
          <option value="all">All Plans</option>
          <option value="lifetime">Lifetime</option>
          <option value="free">Free</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            height: '40px',
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
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Count summary */}
        <p
          style={{
            fontSize: '13px',
            color: 'var(--color-steel)',
            fontFamily: 'var(--font-sans)',
            margin: '0',
            marginLeft: 'auto',
          }}
        >
          {totalItems} {totalItems === 1 ? 'member' : 'members'} found
        </p>
      </div>

      {/* Table Container */}
      <div
        ref={menuContainerRef}
        style={{
          background: 'var(--color-canvas)',
          border: '1px solid var(--color-hairline)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ overflowX: 'auto', width: '100%' }}>
          {/* Column Headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(220px, 2fr) minmax(140px, 1.2fr) minmax(120px, 1fr) minmax(110px, 1fr) minmax(100px, 0.8fr) 70px',
              background: 'var(--color-surface)',
              borderBottom: '1px solid var(--color-hairline)',
              minWidth: '760px',
            }}
          >
            {/* Name / Email Header (Clickable) */}
            <div
              onClick={() => handleSort('name')}
              style={{
                padding: '12px 16px',
                fontSize: '11px',
                fontWeight: 600,
                color: sortField === 'name' ? 'var(--color-primary)' : 'var(--color-steel)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Name / Email</span>
              <span>{sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}</span>
            </div>

            {/* Plan Header (Clickable) */}
            <div
              onClick={() => handleSort('plan')}
              style={{
                padding: '12px 16px',
                fontSize: '11px',
                fontWeight: 600,
                color: sortField === 'plan' ? 'var(--color-primary)' : 'var(--color-steel)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Plan</span>
              <span>{sortField === 'plan' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}</span>
            </div>

            {/* Joined Header (Clickable) */}
            <div
              onClick={() => handleSort('created_at')}
              style={{
                padding: '12px 16px',
                fontSize: '11px',
                fontWeight: 600,
                color: sortField === 'created_at' ? 'var(--color-primary)' : 'var(--color-steel)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Joined</span>
              <span>{sortField === 'created_at' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}</span>
            </div>

            {/* Source Header */}
            <div
              style={{
                padding: '12px 16px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-steel)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Source
            </div>

            {/* Status Header */}
            <div
              style={{
                padding: '12px 16px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-steel)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Status
            </div>

            {/* Actions Header */}
            <div
              style={{
                padding: '12px 16px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-steel)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-sans)',
                textAlign: 'right',
              }}
            >
              Action
            </div>
          </div>

          {/* Rows */}
          {paginatedMembers.length > 0 ? (
            paginatedMembers.map((member, index) => {
              const isMenuOpen = activeMenuId === member.id

              return (
                <div
                  key={member.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(220px, 2fr) minmax(140px, 1.2fr) minmax(120px, 1fr) minmax(110px, 1fr) minmax(100px, 0.8fr) 70px',
                    borderBottom:
                      index === paginatedMembers.length - 1
                        ? 'none'
                        : '1px solid var(--color-hairline-soft)',
                    alignItems: 'center',
                    background: isMenuOpen ? 'var(--color-surface-soft)' : 'var(--color-canvas)',
                    minWidth: '760px',
                    position: 'relative',
                  }}
                >
                  {/* Name / Email & Note Icon */}
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'var(--color-ink-deep)',
                          fontFamily: 'var(--font-sans)',
                          margin: '0',
                        }}
                      >
                        {member.full_name || '—'}
                      </p>

                      {/* Note Icon with tooltip if admin_notes exists */}
                      {member.admin_notes && (
                        <div
                          title={`Note: ${member.admin_notes}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: 'var(--color-tint-yellow)',
                            color: '#B45309',
                            fontSize: '11px',
                            cursor: 'help',
                            flexShrink: 0,
                          }}
                        >
                          📝
                        </div>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'var(--color-steel)',
                        fontFamily: 'var(--font-sans)',
                        margin: '2px 0 0',
                      }}
                    >
                      {member.email}
                    </p>
                  </div>

                  {/* Plan + Lifetime Activated Date */}
                  <div style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background:
                          member.plan === 'lifetime'
                            ? 'var(--color-badge-lifetime-bg)'
                            : '#F3F4F6',
                        color:
                          member.plan === 'lifetime'
                            ? 'var(--color-badge-lifetime-text)'
                            : '#6B7280',
                        fontFamily: 'var(--font-sans)',
                        display: 'inline-block',
                      }}
                    >
                      {member.plan === 'lifetime' ? 'Lifetime' : 'Free'}
                    </span>

                    {/* Show 'Since 5 Oct 2026' under Lifetime badge if lifetime_activated_at exists */}
                    {member.plan === 'lifetime' && member.lifetime_activated_at && (
                      <p
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-steel)',
                          fontFamily: 'var(--font-sans)',
                          margin: '4px 0 0',
                        }}
                      >
                        Since {formatDate(member.lifetime_activated_at)}
                      </p>
                    )}
                  </div>

                  {/* Joined Date */}
                  <div style={{ padding: '14px 16px' }}>
                    <p
                      style={{
                        fontSize: '13px',
                        color: 'var(--color-charcoal)',
                        fontFamily: 'var(--font-sans)',
                        fontWeight: '500',
                        margin: '0',
                      }}
                    >
                      {formatDate(member.created_at)}
                    </p>
                  </div>

                  {/* Source */}
                  <div style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        color: member.source ? 'var(--color-slate)' : 'var(--color-steel)',
                        fontFamily: 'var(--font-sans)',
                        background: member.source ? 'var(--color-surface)' : 'transparent',
                        padding: member.source ? '2px 8px' : '0',
                        borderRadius: 'var(--radius-xs)',
                        textTransform: 'lowercase',
                      }}
                    >
                      {member.source || '—'}
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
                        background: member.is_active ? '#EAF3DE' : '#FEF2F2',
                        color: member.is_active ? '#27500A' : '#DC2626',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {member.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Actions (Single '⋯' Dropdown Button) */}
                  <div
                    style={{
                      padding: '14px 16px',
                      textAlign: 'right',
                      position: 'relative',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveMenuId(isMenuOpen ? null : member.id)}
                      style={{
                        width: '32px',
                        height: '32px',
                        background: isMenuOpen ? 'var(--color-surface)' : 'transparent',
                        border: '1px solid',
                        borderColor: isMenuOpen ? 'var(--color-hairline-strong)' : 'transparent',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'var(--color-charcoal)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1,
                      }}
                      title="Actions menu"
                    >
                      ⋯
                    </button>

                    {/* Dropdown Menu Popup */}
                    {isMenuOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          right: '16px',
                          top: '44px',
                          zIndex: 50,
                          background: 'white',
                          border: '1px solid var(--color-hairline-strong)',
                          borderRadius: 'var(--radius-md)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          minWidth: '160px',
                          padding: '6px',
                          textAlign: 'left',
                          fontFamily: 'var(--font-sans)',
                        }}
                      >
                        {/* Make Lifetime / Make Free */}
                        {member.plan === 'lifetime' ? (
                          <button
                            type="button"
                            onClick={() => requestConfirm('free', member)}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              fontSize: '13px',
                              color: 'var(--color-slate)',
                              background: 'transparent',
                              border: 'none',
                              borderRadius: 'var(--radius-xs)',
                              textAlign: 'left',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <span>🔄</span>
                            <span>Make Free</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => requestConfirm('lifetime', member)}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              fontSize: '13px',
                              color: '#27500A',
                              background: 'transparent',
                              border: 'none',
                              borderRadius: 'var(--radius-xs)',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-badge-lifetime-bg)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <span>⭐</span>
                            <span>Make Lifetime</span>
                          </button>
                        )}

                        {/* Block / Unblock */}
                        {member.is_active ? (
                          <button
                            type="button"
                            onClick={() => requestConfirm('block', member)}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              fontSize: '13px',
                              color: '#DC2626',
                              background: 'transparent',
                              border: 'none',
                              borderRadius: 'var(--radius-xs)',
                              textAlign: 'left',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#FEF2F2')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <span>🚫</span>
                            <span>Block</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => requestConfirm('unblock', member)}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              fontSize: '13px',
                              color: '#27500A',
                              background: 'transparent',
                              border: 'none',
                              borderRadius: 'var(--radius-xs)',
                              textAlign: 'left',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#EAF3DE')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <span>✅</span>
                            <span>Unblock</span>
                          </button>
                        )}

                        <div style={{ height: '1px', background: 'var(--color-hairline)', margin: '4px 0' }} />

                        {/* Edit Action */}
                        <button
                          type="button"
                          onClick={() => openEditModal(member)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            fontSize: '13px',
                            color: 'var(--color-ink)',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: 'var(--radius-xs)',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <span>✏️</span>
                          <span>Edit</span>
                        </button>
                      </div>
                    )}
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
                No members found
              </p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--color-hairline)',
            background: 'var(--color-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '13px', color: 'var(--color-steel)', fontFamily: 'var(--font-sans)' }}>
            {totalItems > 0 ? (
              <>
                Showing <strong style={{ color: 'var(--color-ink-deep)' }}>{startIndex + 1}–{endIndex}</strong> of{' '}
                <strong style={{ color: 'var(--color-ink-deep)' }}>{totalItems}</strong> members
              </>
            ) : (
              'Showing 0 of 0'
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 500,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-hairline-strong)',
                background: currentPage <= 1 ? 'var(--color-surface-soft)' : 'white',
                color: currentPage <= 1 ? 'var(--color-muted)' : 'var(--color-ink-deep)',
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Previous
            </button>

            <span
              style={{
                fontSize: '13px',
                color: 'var(--color-slate)',
                fontFamily: 'var(--font-sans)',
                padding: '0 8px',
              }}
            >
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 500,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-hairline-strong)',
                background: currentPage >= totalPages ? 'var(--color-surface-soft)' : 'white',
                color: currentPage >= totalPages ? 'var(--color-muted)' : 'var(--color-ink-deep)',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDialog.isOpen && confirmDialog.member && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '440px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--color-ink-deep)',
                margin: '0 0 10px',
              }}
            >
              {confirmDialog.type === 'lifetime' &&
                `Make Lifetime for ${confirmDialog.member.full_name || confirmDialog.member.email}?`}
              {confirmDialog.type === 'free' &&
                `Make Free for ${confirmDialog.member.full_name || confirmDialog.member.email}?`}
              {confirmDialog.type === 'block' &&
                `Block ${confirmDialog.member.full_name || confirmDialog.member.email}?`}
              {confirmDialog.type === 'unblock' &&
                `Unblock ${confirmDialog.member.full_name || confirmDialog.member.email}?`}
            </h3>

            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-slate)',
                lineHeight: 1.5,
                margin: '0 0 24px',
              }}
            >
              {confirmDialog.type === 'lifetime' &&
                'This will upgrade the member to Lifetime access, set the lifetime activated date to now, and trigger the plan activation email.'}
              {confirmDialog.type === 'free' &&
                'This will revert this member to a free plan. The previously recorded activation date will be preserved.'}
              {confirmDialog.type === 'block' &&
                'This will deactivate their access to student dashboard and courses.'}
              {confirmDialog.type === 'unblock' &&
                'This will restore their access to their account.'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setConfirmDialog({ isOpen: false, type: 'lifetime', member: null })}
                disabled={loading}
                style={{
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-hairline-strong)',
                  background: 'transparent',
                  color: 'var(--color-charcoal)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={executeConfirmAction}
                disabled={loading}
                style={{
                  padding: '9px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background:
                    confirmDialog.type === 'block'
                      ? '#DC2626'
                      : confirmDialog.type === 'lifetime'
                      ? 'var(--color-primary)'
                      : 'var(--color-ink-deep)',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-sans)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                {loading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal with Admin Notes */}
      {editingMember && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '500px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--color-ink-deep)',
                  margin: '0 0 4px',
                }}
              >
                Edit Member
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-steel)', margin: 0 }}>
                {editingMember.full_name || 'Student'} ({editingMember.email})
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {/* Plan Select */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-charcoal)',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Membership Plan
                </label>
                <select
                  value={editForm.plan}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    background: 'var(--color-canvas)',
                    border: '1px solid var(--color-hairline-strong)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    color: 'var(--color-ink-deep)',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                  }}
                >
                  <option value="">Free</option>
                  <option value="lifetime">Lifetime</option>
                </select>
              </div>

              {/* Status Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
                <input
                  type="checkbox"
                  id="modal-active"
                  checked={editForm.is_active}
                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label
                  htmlFor="modal-active"
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--color-ink-deep)',
                    cursor: 'pointer',
                  }}
                >
                  Account Active (can log in and view dashboard)
                </label>
              </div>

              {/* Admin Notes Textarea */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-charcoal)',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Admin Notes
                </label>
                <textarea
                  rows={3}
                  value={editForm.admin_notes}
                  onChange={(e) => setEditForm({ ...editForm, admin_notes: e.target.value })}
                  placeholder="e.g. Paid via WhatsApp, 5 Oct, amount"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'var(--color-canvas)',
                    border: '1px solid var(--color-hairline-strong)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    color: 'var(--color-ink-deep)',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
                <p style={{ fontSize: '11px', color: 'var(--color-steel)', margin: '4px 0 0' }}>
                  Visible only to admins. Shows a note icon with hover tooltip in the members list.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                disabled={loading}
                style={{
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-hairline-strong)',
                  background: 'transparent',
                  color: 'var(--color-charcoal)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={loading}
                style={{
                  padding: '9px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: 'var(--color-primary)',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-sans)',
                  boxShadow: '0 2px 8px rgba(107, 78, 255, 0.3)',
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
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
            zIndex: 1100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  )
}
