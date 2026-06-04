import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AnnouncementManager from '@/components/admin/AnnouncementManager'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Announcements' }

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient()

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

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
            Announcements
          </h1>
        </div>
        <AnnouncementManager initialAnnouncements={announcements || []} />
      </main>
    </div>
  )
}
