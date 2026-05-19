'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Member {
  id: string
  full_name: string | null
  email: string
  plan: string | null
  plan_expires_at: string | null
  is_active: boolean
  created_at: string
}

interface Props {
  initialMembers: Member[]
}

export default function MembersManager({ initialMembers }: Props) {
  const supabase = createClient()
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [search, setSearch] = useState('')
  const [filterPlan, setFilterPlan] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    plan: '',
    plan_expires_at: '',
    is_active: true,
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  function showToast(message: string) {
    setToast(message)
    setTimeout(() => setToast(''), 3000)
  }

  function openEdit(member: Member) {
    setEditingId(member.id)
    setEditForm({
      plan: member.plan || '',
      plan_expires_at: member.plan_expires_at
        ? new Date(member.plan_expires_at).toISOString().slice(0, 10)
        : '',
      is_active: member.is_active,
    })
  }

  async function handleSave(id: string) {
    setLoading(true)

    const payload = {
      plan: editForm.plan === '' ? null : editForm.plan,
      plan_expires_at: editForm.plan === 'lifetime' || editForm.plan === ''
        ? null
        : editForm.plan_expires_at
          ? new Date(editForm.plan_expires_at).toISOString()
          : null,
      is_active: editForm.is_active,
    }

    const { data } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (data) {
      setMembers(members.map(m => m.id === id ? data : m))

      // Audit log
      await supabase.from('audit_logs').insert({
        action: `Plan updated to ${editForm.plan}`,
        target_user_email: members.find(m => m.id === id)?.email,
      })
    }

    setEditingId(null)
    setLoading(false)
  }

  async function handleToggleActive(member: Member) {
    const { data } = await supabase
      .from('profiles')
      .update({ is_active: !member.is_active })
      .eq('id', member.id)
      .select()
      .single()

    if (data) {
      setMembers(members.map(m => m.id === member.id ? data : m))

      // Audit log
      await supabase.from('audit_logs').insert({
        action: !member.is_active ? 'Access granted' : 'Access revoked',
        target_user_email: member.email,
      })
    }
  }

  async function handleQuickPlan(member: Member, plan: 'monthly' | 'lifetime' | 'free') {
    const expiryDate = plan === 'monthly'
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : null

    const { data } = await supabase
      .from('profiles')
      .update({
        plan: plan === 'free' ? null : plan,
        plan_expires_at: expiryDate,
        is_active: true,
      })
      .eq('id', member.id)
      .select()
      .single()

    if (data) {
      setMembers(members.map(m => m.id === member.id ? data : m))

      // Audit log
      await supabase.from('audit_logs').insert({
        action: `Plan assigned: ${plan}`,
        target_user_email: member.email,
      })

      showToast(`✅ ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan assigned to ${member.full_name || member.email}`)
    }
  }

  // Filter Logic
  const filtered = members.filter(m => {
    const matchSearch =
      (m.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())

    const matchPlan = filterPlan === 'all' || m.plan === filterPlan

    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && m.is_active) ||
      (filterStatus === 'inactive' && !m.is_active)

    return matchSearch && matchPlan && matchStatus
  })

  function isExpiringSoon(member: Member) {
    return (
      member.plan === 'monthly' &&
      member.plan_expires_at &&
      new Date(member.plan_expires_at) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    )
  }

  return (
    <div>
      {/* Member Stats Row */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap',
      }}>
        {[
          {
            label: 'Total Members',
            value: members.length,
            bg: 'var(--color-tint-lavender)',
          },
          {
            label: 'Monthly',
            value: members.filter(m => m.plan === 'monthly').length,
            bg: 'var(--color-badge-monthly-bg)',
          },
          {
            label: 'Lifetime',
            value: members.filter(m => m.plan === 'lifetime').length,
            bg: 'var(--color-badge-lifetime-bg)',
          },
          {
            label: 'No Plan',
            value: members.filter(m => !m.plan).length,
            bg: 'var(--color-tint-peach)',
          },
          {
            label: 'Expiring Soon',
            value: members.filter(m =>
              m.plan === 'monthly' &&
              m.plan_expires_at &&
              new Date(m.plan_expires_at) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            ).length,
            bg: '#FEF2F2',
          },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: stat.bg,
            borderRadius: 'var(--radius-md)',
            padding: '12px 20px',
            minWidth: '120px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '22px',
              fontWeight: '600',
              color: 'var(--color-ink-deep)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 4px',
            }}>
              {stat.value}
            </p>
            <p style={{
              fontSize: '11px',
              color: 'var(--color-charcoal)',
              fontFamily: 'var(--font-sans)',
              margin: '0',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filters Row */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or email..."
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
          <option value="monthly">Monthly</option>
          <option value="lifetime">Lifetime</option>
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

        {/* Count */}
        <p style={{
          fontSize: '13px',
          color: 'var(--color-steel)',
          fontFamily: 'var(--font-sans)',
          margin: '0',
          marginLeft: 'auto',
        }}>
          {filtered.length} members
        </p>
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--color-canvas)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        overflowX: 'auto',
      }}>

        {/* Column Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 0.8fr 1fr 0.8fr 300px',
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-hairline)',
        }}>
          {['Name / Email', 'Plan', 'Expiry', 'Status', 'Actions'].map((col) => (
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
          filtered.map((member, index) => (
            <div key={member.id}>

              {/* Member Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 0.8fr 1fr 0.8fr 300px',
                borderBottom: editingId === member.id
                  ? 'none'
                  : index === filtered.length - 1
                    ? 'none'
                    : '1px solid var(--color-hairline-soft)',
                alignItems: 'center',
                background: isExpiringSoon(member)
                  ? '#FEF2F2'
                  : 'var(--color-canvas)',
              }}>

                {/* Name / Email */}
                <div style={{ padding: '14px 16px' }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'var(--color-ink-deep)',
                    fontFamily: 'var(--font-sans)',
                    margin: '0 0 2px',
                  }}>
                    {member.full_name || '—'}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--color-steel)',
                    fontFamily: 'var(--font-sans)',
                    margin: '0',
                  }}>
                    {member.email}
                  </p>
                </div>

                {/* Plan */}
                <div style={{ padding: '14px 16px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '500',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: member.plan === 'lifetime'
                      ? 'var(--color-badge-lifetime-bg)'
                      : member.plan === 'monthly'
                        ? 'var(--color-badge-monthly-bg)'
                        : '#F3F4F6',
                    color: member.plan === 'lifetime'
                      ? 'var(--color-badge-lifetime-text)'
                      : member.plan === 'monthly'
                        ? 'var(--color-badge-monthly-text)'
                        : '#6B7280',
                    fontFamily: 'var(--font-sans)',
                  }}>
                    {member.plan === 'lifetime' ? 'Lifetime' : member.plan === 'monthly' ? 'Monthly' : 'Free'}
                  </span>
                </div>

                {/* Expiry */}
                <div style={{ padding: '14px 16px' }}>
                  <p style={{
                    fontSize: '13px',
                    color: isExpiringSoon(member) ? '#DC2626' : 'var(--color-charcoal)',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: isExpiringSoon(member) ? '500' : '400',
                    margin: '0',
                  }}>
                    {member.plan === 'lifetime'
                      ? '∞ Lifetime'
                      : member.plan_expires_at
                        ? `${isExpiringSoon(member) ? '⚠️ ' : ''}${new Date(member.plan_expires_at).toLocaleDateString('en-PK', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}`
                        : '—'}
                  </p>
                </div>

                {/* Status */}
                <div style={{ padding: '14px 16px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '500',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: member.is_active ? '#EAF3DE' : '#FEF2F2',
                    color: member.is_active ? '#27500A' : '#DC2626',
                    fontFamily: 'var(--font-sans)',
                  }}>
                    {member.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Actions */}
                <div style={{
                  padding: '14px 16px',
                  display: 'flex',
                  gap: '8px',
                }}>
                  <button
                    onClick={() => handleQuickPlan(member, 'monthly')}
                    style={{
                      background: 'var(--color-badge-monthly-bg)',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      padding: '5px 10px',
                      fontSize: '12px',
                      color: 'var(--color-badge-monthly-text)',
                      fontFamily: 'var(--font-sans)',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => handleQuickPlan(member, 'lifetime')}
                    style={{
                      background: 'var(--color-badge-lifetime-bg)',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      padding: '5px 10px',
                      fontSize: '12px',
                      color: 'var(--color-badge-lifetime-text)',
                      fontFamily: 'var(--font-sans)',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Lifetime
                  </button>
                  <button
                    onClick={() => handleQuickPlan(member, 'free')}
                    style={{
                      background: '#F3F4F6',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      padding: '5px 10px',
                      fontSize: '12px',
                      color: '#6B7280',
                      fontFamily: 'var(--font-sans)',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Free
                  </button>
                  <button
                    onClick={() => handleToggleActive(member)}
                    style={{
                      background: member.is_active ? '#FEF2F2' : '#EAF3DE',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      padding: '5px 10px',
                      fontSize: '12px',
                      color: member.is_active ? '#DC2626' : '#27500A',
                      fontFamily: 'var(--font-sans)',
                      cursor: 'pointer',
                    }}
                  >
                    {member.is_active ? 'Block' : 'Unblock'}
                  </button>
                  <button
                    onClick={() => openEdit(member)}
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
                </div>
              </div>

              {/* Inline Edit Form */}
              {editingId === member.id && (
                <div style={{
                  background: 'var(--color-tint-lavender)',
                  borderBottom: index === filtered.length - 1
                    ? 'none'
                    : '1px solid var(--color-hairline)',
                  padding: '20px 16px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                }}>

                  {/* Plan */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'var(--color-ink)',
                      fontFamily: 'var(--font-sans)',
                      marginBottom: '6px',
                    }}>
                      Plan
                    </label>
                    <select
                      value={editForm.plan}
                      onChange={(e) => {
                        const newPlan = e.target.value
                        setEditForm({
                          ...editForm,
                          plan: newPlan,
                          plan_expires_at: newPlan === 'monthly'
                            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
                            : '',
                        })
                      }}
                      style={{
                        height: '36px',
                        padding: '0 10px',
                        background: 'var(--color-canvas)',
                        border: '1px solid var(--color-hairline-strong)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13px',
                        color: 'var(--color-ink)',
                        fontFamily: 'var(--font-sans)',
                        outline: 'none',
                      }}
                    >
                      <option value="">Free</option>
                      <option value="monthly">Monthly</option>
                      <option value="lifetime">Lifetime</option>
                    </select>
                  </div>

                  {/* Expiry Date */}
                  {editForm.plan === 'monthly' && (
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'var(--color-ink)',
                        fontFamily: 'var(--font-sans)',
                        marginBottom: '6px',
                      }}>
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        value={editForm.plan_expires_at}
                        onChange={(e) => setEditForm({ ...editForm, plan_expires_at: e.target.value })}
                        style={{
                          height: '36px',
                          padding: '0 10px',
                          background: 'var(--color-canvas)',
                          border: '1px solid var(--color-hairline-strong)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '13px',
                          color: 'var(--color-ink)',
                          fontFamily: 'var(--font-sans)',
                          outline: 'none',
                        }}
                      />
                    </div>
                  )}

                  {/* Active Toggle */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    paddingBottom: '4px',
                  }}>
                    <input
                      type="checkbox"
                      id={`active-${member.id}`}
                      checked={editForm.is_active}
                      onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <label htmlFor={`active-${member.id}`} style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'var(--color-ink)',
                      fontFamily: 'var(--font-sans)',
                      cursor: 'pointer',
                    }}>
                      Active
                    </label>
                  </div>

                  {/* Save / Cancel */}
                  <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                    <button
                      onClick={async () => {
                        await supabase
                          .from('profiles')
                          .update({ plan: null, is_active: false })
                          .eq('id', member.id)

                        await supabase.from('audit_logs').insert({
                          action: 'Plan revoked',
                          target_user_email: member.email,
                        })

                        setMembers(members.map(m => m.id === member.id
                          ? { ...m, plan: null, is_active: false } as Member
                          : m
                        ))
                        setEditingId(null)
                        showToast('❌ Plan revoked successfully')
                      }}
                      style={{
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: 'var(--radius-md)',
                        padding: '7px 16px',
                        fontSize: '13px',
                        color: '#DC2626',
                        fontFamily: 'var(--font-sans)',
                        cursor: 'pointer',
                        marginRight: 'auto',
                      }}
                    >
                      Revoke Plan
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--color-hairline-strong)',
                        borderRadius: 'var(--radius-md)',
                        padding: '7px 16px',
                        fontSize: '13px',
                        color: 'var(--color-slate)',
                        fontFamily: 'var(--font-sans)',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(member.id)}
                      disabled={loading}
                      style={{
                        background: loading ? 'var(--color-muted)' : 'var(--color-ink-deep)',
                        color: 'var(--color-on-dark)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        padding: '7px 16px',
                        fontSize: '13px',
                        fontWeight: '500',
                        fontFamily: 'var(--font-sans)',
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}
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
              No members found
            </p>
          </div>
        )}
      </div>

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
