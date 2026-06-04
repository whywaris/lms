import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import RedirectManager from '@/components/admin/RedirectManager'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  // Stats fetch
  const [
    { count: totalCourses },
    { count: totalMembers },

    { count: lifetimeMembers },
    { count: totalBlogs },
    { count: totalPublicCourses },
    { data: recentMembers },
    { data: redirects },
  ] = await Promise.all([
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),

    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('plan', 'lifetime').eq('role', 'student'),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('public_courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('profiles').select('*').eq('role', 'student').order('created_at', { ascending: false }).limit(5),
    supabase.from('redirects').select('*').order('created_at', { ascending: false }),
  ])

  const stats = [
    { label: 'Total Courses', value: totalCourses || 0, icon: '📚', tint: 'var(--color-tint-lavender)' },
    { label: 'Public Courses', value: totalPublicCourses || 0, icon: '🌐', tint: 'var(--color-tint-sky)' },
    { label: 'Total Members', value: totalMembers || 0, icon: '👥', tint: 'var(--color-tint-mint)' },

    { label: 'Lifetime Members', value: lifetimeMembers || 0, icon: '⭐', tint: 'var(--color-tint-yellow)' },
    { label: 'Blog Posts', value: totalBlogs || 0, icon: '✍️', tint: 'var(--color-tint-rose)' },
  ]

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-surface)' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '40px', height: '100vh', overflowY: 'auto' }}>

        {/* Header */}
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
            Dashboard
          </h1>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '40px',
        }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{
              background: stat.tint,
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
            }}>
              <p style={{
                fontSize: '28px',
                margin: '0 0 8px',
                lineHeight: '1',
              }}>
                {stat.icon}
              </p>
              <p style={{
                fontSize: '28px',
                fontWeight: '600',
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 4px',
                lineHeight: '1',
              }}>
                {stat.value}
              </p>
              <p style={{
                fontSize: '13px',
                color: 'var(--color-charcoal)',
                fontFamily: 'var(--font-sans)',
                margin: '0',
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Members */}
        <div style={{
          background: 'var(--color-canvas)',
          border: '1px solid var(--color-hairline)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>

          {/* Table Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-hairline)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--color-ink-deep)',
              fontFamily: 'var(--font-sans)',
              margin: '0',
            }}>
              Recent Members
            </h2>
            <a href="/admin/members" style={{
              fontSize: '13px',
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
              fontWeight: '500',
            }}>
              View all →
            </a>
          </div>

          {/* Column Headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-hairline)',
          }}>
            {['Name / Email', 'Plan', 'Expiry', 'Status'].map((col) => (
              <div key={col} style={{
                padding: '10px 20px',
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
          {recentMembers && recentMembers.length > 0 ? (
            recentMembers.map((member, index) => {


              return (
                <div
                  key={member.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    borderBottom: index === recentMembers.length - 1
                      ? 'none'
                      : '1px solid var(--color-hairline-soft)',
                  }}
                >
                  {/* Name / Email */}
                  <div style={{ padding: '16px 20px' }}>
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
                  <div style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '500',
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: member.plan === 'lifetime'
                        ? 'var(--color-badge-lifetime-bg)'
                        : 'var(--color-surface-soft)',
                      color: member.plan === 'lifetime'
                        ? 'var(--color-badge-lifetime-text)'
                        : 'var(--color-slate)',
                      fontFamily: 'var(--font-sans)',
                    }}>
                      {member.plan === 'lifetime' ? 'Lifetime' : 'Free'}
                    </span>
                  </div>

                  {/* Expiry */}
                  <div style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    <span style={{
                      fontSize: '13px',
                      color: 'var(--color-charcoal)',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: '400',
                    }}>
                      {member.plan === 'lifetime'
                        ? '∞ Lifetime'
                        : member.plan_expires_at
                          ? new Date(member.plan_expires_at).toLocaleDateString('en-PK', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                          : '—'}
                    </span>
                  </div>

                  {/* Status */}
                  <div style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
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
                </div>
              )
            })
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
                No members yet
              </p>
            </div>
          )}
        </div>

        {/* Redirects Section */}
        <RedirectManager initialRedirects={redirects || []} />
      </main>
    </div>
  )
}
