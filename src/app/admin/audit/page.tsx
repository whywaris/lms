import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AuditLog from '@/components/admin/AuditLog'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Audit Log' }

export default async function AdminAuditPage() {
  const supabase = await createClient()

  const { data: logs } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '40px', height: '100vh', overflowY: 'auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: '500',
            color: 'var(--color-steel)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 8px',
          }}>
            Admin Panel
          </p>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: 'var(--color-ink-deep)',
            fontFamily: 'var(--font-sans)',
            margin: '0',
            letterSpacing: '-0.5px',
          }}>
            Audit Log
          </h1>
        </div>
        <AuditLog initialLogs={logs || []} />
      </main>
    </div>
  )
}
