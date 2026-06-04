import { createAdminClient } from '@/lib/supabase/server'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'
import BlogContent from '@/components/blog/BlogContent'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panda Courses Blog',
  description: 'Explore courses, read success stories, and stay ahead with Dev Tips & Tutorials.',
}

export const revalidate = 0

export default async function BlogPage() {
  const supabase = createAdminClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        background: 'var(--color-brand-navy)',
        padding: '100px 32px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{
            fontSize: '12px',
            fontWeight: '600',
            color: 'var(--color-primary)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 16px',
          }}>
            Our Blog
          </p>
          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: '700',
            color: 'var(--color-on-dark)',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 24px',
            lineHeight: '1',
            letterSpacing: '-2px',
          }}>
            Learn. Grow. Succeed.
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            color: 'var(--color-on-dark-muted)',
            fontFamily: 'var(--font-sans)',
            margin: '0',
            lineHeight: '1.6',
            maxWidth: '600px',
            marginInline: 'auto',
          }}>
            Explore courses, read success stories, and stay ahead with our latest insights and tutorials.
          </p>
        </div>
      </section>

      {/* Filter & Content Area (Client Side) */}
      <div style={{ flex: 1, width: '100%' }}>
        <BlogContent posts={posts || []} />
      </div>

      <Footer />
    </main>
  )
}
