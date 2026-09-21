import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'
import LockedContent from '@/components/ui/LockedContent'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Lifetime Members Only | PandaCourses',
  robots: {
    index: false,
    follow: true,
  },
}

export default async function NoPlanPage() {
  let isLoggedIn = false
  let courseCount: number | undefined = undefined

  try {
    const supabase = await createClient()

    const [{ data: { user } }, { count }] = await Promise.all([
      supabase.auth.getUser(),
      supabase
        .from('public_courses')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true),
    ])

    isLoggedIn = !!user
    if (typeof count === 'number' && count > 0) {
      courseCount = count
    }
  } catch (err) {
    console.error('Error loading locked content data:', err)
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <section
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-canvas)',
          padding: '64px 24px 80px',
        }}
      >
        <LockedContent isLoggedIn={isLoggedIn} courseCount={courseCount} />
      </section>
      <Footer />
    </main>
  )
}
