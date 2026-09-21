import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import AdminSidebar from '@/components/admin/AdminSidebar'
import EmailManager from '@/components/admin/EmailManager'

export const metadata: Metadata = {
  title: 'Emails | Admin Panel',
}

export default async function AdminEmailsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const admin = createAdminClient()

  // 1. Fetch campaigns
  const { data: campaigns } = await admin
    .from('email_campaigns')
    .select('*')
    .order('created_at', { ascending: false })

  // 2. Fetch recent email logs (latest 50)
  const { data: logs } = await admin
    .from('email_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  // 3. Fetch published courses for course picker in new_courses template
  const { data: courses } = await admin
    .from('public_courses')
    .select('id, course_name, slug, image_url')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(30)

  return (
    <div
      className="admin-layout"
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--color-surface)',
      }}
    >
      <AdminSidebar />
      <main
        style={{
          flex: 1,
          padding: '40px',
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ marginBottom: '32px' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: '500',
              color: 'var(--color-steel)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 8px',
            }}
          >
            Admin Panel
          </p>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '600',
              color: 'var(--color-ink-deep)',
              fontFamily: 'var(--font-sans)',
              margin: '0',
              letterSpacing: '-0.5px',
            }}
          >
            Email Campaigns &amp; Logs
          </h1>
        </div>

        <EmailManager
          initialCampaigns={campaigns || []}
          initialLogs={logs || []}
          publishedCourses={courses || []}
          adminEmail={user?.email || ''}
        />
      </main>
    </div>
  )
}
