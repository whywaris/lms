import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import RedirectManager from '@/components/admin/RedirectManager'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Redirects' }

export default async function RedirectsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: redirectsData } = await supabase
    .from('redirects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '40px', overflow: 'auto' }}>
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
            Redirects
          </h1>
        </div>

        <RedirectManager initialRedirects={redirectsData || []} />
      </main>
    </div>
  )
}
