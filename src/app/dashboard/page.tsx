import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import DashboardCourseList from '@/components/dashboard/DashboardCourseList'
import BackToTop from '@/components/ui/BackToTop'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Profile fetch
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')


  // Plan expired check (deprecated)
  const isExpired = false

  // Courses fetch — plan ke hisaab se
  let query = supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (profile.plan !== 'lifetime') {
    // Guest or No plan
    query = query.eq('id', '00000000-0000-0000-0000-000000000000')
  }

  const { data: courses } = await query

  return (
    <main style={{ background: 'var(--color-canvas)', minHeight: '100vh' }}>
      {/* Dashboard Top Bar */}
      <nav style={{
        background: 'var(--color-canvas)',
        borderBottom: '1px solid var(--color-hairline)',
        height: '64px',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Link href="/" style={{
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--color-ink-deep)',
          textDecoration: 'none',
          fontFamily: 'var(--font-sans)',
        }}>
          PandaCourses
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 14px',
            fontSize: '13px',
            color: 'var(--color-ink)',
            fontFamily: 'var(--font-sans)',
            fontWeight: '500',
          }}>
            👤 {profile.full_name || user.email}
          </div>
          <div style={{
            background: profile.plan === 'lifetime'
              ? 'var(--color-badge-lifetime-bg)'
              : 'var(--color-surface-soft)',
            color: profile.plan === 'lifetime'
              ? 'var(--color-badge-lifetime-text)'
              : 'var(--color-slate)',
            fontSize: '12px',
            fontWeight: '500',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-sans)',
          }}>
            {profile.plan === 'lifetime' 
              ? '⭐ Lifetime Member' 
              : '🆓 Free Plan'}
          </div>
        </div>
      </nav>


          {/* Dashboard Header Section */}
          <header style={{
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-hairline)',
            padding: '32px 32px',
          }}>
            <div style={{
              maxWidth: '1280px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}>
              <div>
                <p style={{
                  fontSize: '11px',
                  fontWeight: '500',
                  color: 'var(--color-steel)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                  fontFamily: 'var(--font-sans)',
                  margin: '0 0 6px',
                }}>
                  YOUR COURSES
                </p>
                <h1 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'var(--color-ink-deep)',
                  margin: '0',
                  fontFamily: 'var(--font-sans)',
                }}>
                  Welcome back, {profile.full_name?.split(' ')[0] || 'Student'} 👋
                </h1>
              </div>

              <div className="dashboard-stats" style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
              }}>
                {[
                  { label: 'Total Courses', value: courses?.length || 0, icon: '📚' },
                  { label: 'Plan', value: profile.plan ? (profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)) : 'Free', icon: '🎯' },
                  { label: 'Status', value: profile.plan ? (profile.is_active ? 'Active' : 'Inactive') : 'Inactive', icon: '✅' },
                ].map((stat) => (
                  <div key={stat.label} style={{
                    background: 'var(--color-canvas)',
                    border: '1px solid var(--color-hairline)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 20px',
                    textAlign: 'center',
                    minWidth: '120px',
                  }}>
                    <p style={{ fontSize: '20px', margin: '0 0 4px' }}>{stat.icon}</p>
                    <p style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-ink-deep)', fontFamily: 'var(--font-sans)', margin: '0 0 2px' }}>{stat.value}</p>
                    <p style={{ fontSize: '11px', color: 'var(--color-steel)', fontFamily: 'var(--font-sans)', margin: '0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </header>

          {/* Courses Content */}
          <section style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '48px 32px 96px',
          }}>
            {/* Upgrade Banner for Free Plan users */}
            {!profile.plan && (
              <div style={{
                background: 'var(--color-tint-lavender)',
                border: '1px solid rgba(107,78,255,0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 20px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--color-ink-deep)',
                  fontFamily: 'var(--font-sans)',
                  margin: 0,
                }}>
                  🚀 You are on the Free Plan — upgrade to access all courses.
                </p>
                <Link 
                  href="/pricing"
                  style={{
                    background: 'var(--color-primary)',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '500',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  View Plans
                </Link>
              </div>
            )}



            <DashboardCourseList courses={courses || []} />
            {/* Bottom Motivational Line */}
            <div style={{
              textAlign: 'center',
              padding: '32px',
              marginTop: '16px',
            }}>
              <p style={{
                fontSize: '14px',
                color: 'var(--color-steel)',
                fontFamily: 'var(--font-sans)',
                margin: '0',
              }}>
                🚀 New courses are added regularly — check back soon!
              </p>
            </div>
          </section>
      <BackToTop />
    </main>
  )
}
