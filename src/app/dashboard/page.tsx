import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'

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

  // No Plan State
  if (!profile.plan) redirect('/no-plan')

  // Plan expired check
  const isExpired = profile.plan === 'monthly' &&
    profile.plan_expires_at &&
    new Date(profile.plan_expires_at) < new Date()

  // Courses fetch — plan ke hisaab se
  let query = supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // Monthly sirf monthly courses, Lifetime sab, No plan 0
  if (profile.plan === 'monthly') {
    query = query.in('plan_access', ['monthly', 'both'])
  } else if (profile.plan !== 'lifetime') {
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
              : 'var(--color-badge-monthly-bg)',
            color: profile.plan === 'lifetime'
              ? 'var(--color-badge-lifetime-text)'
              : 'var(--color-badge-monthly-text)',
            fontSize: '12px',
            fontWeight: '500',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-sans)',
          }}>
            {profile.plan === 'lifetime' 
              ? '⭐ Lifetime Member' 
              : profile.plan === 'monthly' 
                ? '📅 Monthly Member' 
                : '🚫 No Active Plan'}
          </div>
        </div>
      </nav>

      {isExpired ? (
        /* Plan Expired State */
        <div style={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
        }}>
          <div style={{
            background: 'var(--color-canvas)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-lg)',
            padding: '48px',
            textAlign: 'center',
            maxWidth: '480px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <p style={{ fontSize: '48px', marginBottom: '16px', margin: '0 0 16px' }}>⏰</p>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'var(--color-ink-deep)',
              marginBottom: '8px',
              fontFamily: 'var(--font-sans)',
            }}>
              Your Plan Has Expired
            </h2>
            <p style={{
              fontSize: '15px',
              color: 'var(--color-slate)',
              lineHeight: '1.7',
              marginBottom: '32px',
              fontFamily: 'var(--font-sans)',
            }}>
              Renew your monthly plan or upgrade to Lifetime and never worry about expiry again.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link 
                href={process.env.NEXT_PUBLIC_GUMROAD_MONTHLY_URL || '#'} 
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'var(--color-ink-deep)',
                  color: 'white',
                  padding: '11px 24px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Renew Monthly
              </Link>
              <Link 
                href={process.env.NEXT_PUBLIC_GUMROAD_LIFETIME_URL || '#'} 
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'var(--color-primary)',
                  color: 'white',
                  padding: '11px 24px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  marginLeft: '12px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Upgrade to Lifetime ⭐
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
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
                  { label: 'Plan', value: profile.plan ? (profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)) : 'None', icon: '🎯' },
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
            {/* Upgrade Banner for Monthly users */}
            {profile.plan === 'monthly' && (
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
                  ⭐ Upgrade to Lifetime — get access to all future courses, never pay again.
                </p>
                <Link 
                  href={process.env.NEXT_PUBLIC_GUMROAD_LIFETIME_URL || '#'} 
                  target="_blank"
                  rel="noopener noreferrer"
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
                  Upgrade Now
                </Link>
              </div>
            )}

            {/* Search + Filter Bar (Static Info Line) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <p style={{
                fontSize: '13px',
                color: 'var(--color-steel)',
                fontFamily: 'var(--font-sans)',
                margin: '0',
              }}>
                {courses?.length || 0} courses available in your plan
              </p>
              {profile.plan === 'monthly' && (
                <a 
                  href={process.env.NEXT_PUBLIC_GUMROAD_LIFETIME_URL} 
                  target='_blank' 
                  rel='noopener noreferrer' 
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-sans)',
                    textDecoration: 'none',
                    fontWeight: '500',
                  }}
                >
                  ⭐ Upgrade to Lifetime for more courses →
                </a>
              )}
            </div>

            {/* Table */}
            {courses && courses.length > 0 ? (
              <div className="dashboard-table" style={{
                background: 'var(--color-canvas)',
                border: '1px solid var(--color-hairline)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
              }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1fr',
                  borderBottom: '1px solid var(--color-hairline)',
                  background: 'var(--color-surface)',
                }}>
                  {['Course Name', 'Mentor', 'Category', 'Drive Link', 'Source'].map((col) => (
                    <div key={col} style={{
                      padding: '12px 20px',
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

                {/* Table Rows */}
                {courses.map((course, index) => (
                  <div
                    key={course.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1fr',
                      borderBottom: index === courses.length - 1
                        ? 'none'
                        : '1px solid var(--color-hairline-soft)',
                      background: index % 2 === 0
                        ? 'var(--color-canvas)'
                        : 'var(--color-surface-soft)',
                    }}
                  >
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-ink-deep)', fontFamily: 'var(--font-sans)', margin: '0' }}>
                        {course.course_name}
                      </p>
                    </div>
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                      <p style={{ fontSize: '13px', color: 'var(--color-charcoal)', fontFamily: 'var(--font-sans)', margin: '0' }}>
                        {course.mentor || '—'}
                      </p>
                    </div>
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                      {course.category ? (
                        <span style={{ fontSize: '11px', fontWeight: '500', padding: '3px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--color-tint-lavender)', color: 'var(--color-badge-monthly-text)', fontFamily: 'var(--font-sans)' }}>
                          {course.category}
                        </span>
                      ) : (
                        <span style={{ fontSize: '13px', color: 'var(--color-muted)', fontFamily: 'var(--font-sans)' }}>—</span>
                      )}
                    </div>
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                      {course.drive_link ? (
                        <a href={course.drive_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-primary)', textDecoration: 'none', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          📁 Open Link
                        </a>
                      ) : (
                        <span style={{ fontSize: '13px', color: 'var(--color-muted)', fontFamily: 'var(--font-sans)' }}>—</span>
                      )}
                    </div>
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                      {course.source ? (
                        <a
                          href={course.source.startsWith('http') ? course.source : `https://${course.source}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          style={{
                            fontSize: '13px',
                            fontWeight: '500',
                            color: 'var(--color-primary)',
                            textDecoration: 'none',
                            fontFamily: 'var(--font-sans)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          🔗 Visit Source
                        </a>
                      ) : (
                        <span style={{ fontSize: '13px', color: 'var(--color-muted)', fontFamily: 'var(--font-sans)' }}>—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '64px 32px', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-hairline)' }}>
                <p style={{ fontSize: '32px', margin: '0 0 16px' }}>📚</p>
                <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--color-ink)', fontFamily: 'var(--font-sans)', margin: '0 0 8px' }}>
                  No courses available yet
                </p>
                <p style={{ fontSize: '14px', color: 'var(--color-slate)', fontFamily: 'var(--font-sans)', margin: '0' }}>
                  The admin will add courses soon — please check back later for updates!
                </p>
              </div>
            )}
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
        </>
      )}
    </main>
  )
}
