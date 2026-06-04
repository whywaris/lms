import { createAdminClient } from '@/lib/supabase/server'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'
import CoursesGrid from '@/components/sections/CoursesGrid'

export const metadata = {
  title: 'All Courses — PandaCourses',
  description: 'Browse 2000+ premium courses on YouTube automation, trading, dropshipping, freelancing, and more. Instant Mega/Google Drive access after purchase.',
  openGraph: {
    title: 'All Courses — PandaCourses',
    description: 'Browse 2000+ premium courses. Instant access after purchase.',
    url: 'https://pandacourses.com/courses',
    siteName: 'PandaCourses',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Courses — PandaCourses',
    description: 'Browse 2000+ premium courses. Instant access after purchase.',
  },
  alternates: {
    canonical: 'https://pandacourses.com/courses',
  },
}

export const revalidate = 0

export default async function CoursesPage() {
  const supabase = createAdminClient()
  
  const { data: courses } = await supabase
    .from('public_courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const categories = ['All', ...Array.from(new Set(courses?.filter(c => c.category).map(c => c.category) || []))] as string[]

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        background: 'var(--color-brand-navy)',
        padding: '48px 32px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: '500',
            color: 'var(--color-on-dark-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 12px',
          }}>
            ALL COURSES
          </p>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: '600',
            color: 'white',
            letterSpacing: '-0.5px',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 12px',
            lineHeight: '1.2',
          }}>
            Browse Our Course Library
          </h1>
          <p style={{
            fontSize: '15px',
            color: 'var(--color-on-dark-muted)',
            fontFamily: 'var(--font-sans)',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Explore 2000+ premium courses — instant Mega/Gdrive access after purchase.
          </p>
        </div>
      </section>

      {/* Courses Grid Content */}
      <div style={{ flex: 1 }}>
        <CoursesGrid 
          courses={courses || []} 
          categories={categories} 
        />
      </div>

      <Footer />
    </main>
  )
}
