import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title')
    .eq('slug', slug)
    .single()
  return { title: post?.title || 'Blog' }
}

export default async function BlogPostPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>
}) {
  const params = await paramsPromise
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (!post) notFound()

  // Related Posts
  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .neq('id', post.id)
    .limit(2)

  // Dynamic Table of Contents & Content ID injection
  const headings: { id: string; text: string }[] = []
  let processedContent = post.content || ''

  // Regex to find h2 and h3 tags (more robust to attributes)
  const headingRegex = /<(h[23])(?:\s+[^>]*)?>(.*?)<\/h[23]>/g
  let match
  const usedSlugs = new Set<string>()

  processedContent = processedContent.replace(headingRegex, (fullMatch: string, tag, text) => {
    // Remove HTML tags from text if any
    const cleanText = text.replace(/<[^>]*>/g, '')
    // Create a slug for the ID
    let slug = cleanText
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    // Ensure unique slug
    let uniqueSlug = slug
    let counter = 1
    while (usedSlugs.has(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }
    usedSlugs.add(uniqueSlug)

    headings.push({ id: uniqueSlug, text: cleanText })
    return `<${tag} id="${uniqueSlug}">${text}</${tag}>`
  })

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Navbar />

      <div style={{ flex: 1, width: '100%' }}>
        {/* Breadcrumb */}
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 32px',
          fontSize: '13px',
          color: 'var(--color-steel)',
          fontFamily: 'var(--font-sans)',
        }}>
          <Link href="/" style={{
            color: 'var(--color-steel)',
            textDecoration: 'none',
          }}>
            Home
          </Link>
          {' / '}
          <Link href="/blog" style={{
            color: 'var(--color-steel)',
            textDecoration: 'none',
          }}>
            Blog
          </Link>
          {' / '}
          <span style={{ color: 'var(--color-slate)' }}>
            {post.title}
          </span>
        </div>

        {/* Post Header */}
        <section style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px 48px',
        }}>


          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: '600',
            color: 'var(--color-ink-deep)',
            fontFamily: 'var(--font-sans)',
            margin: '0 0 24px',
            lineHeight: '1.2',
            letterSpacing: '-0.5px',
          }}>
            {post.title}
          </h1>


          {/* Cover Image */}
          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              style={{
                width: '100%',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-hairline)',
                marginBottom: '48px',
                display: 'block',
              }}
            />
          )}

          {/* Table of Contents */}
          {headings.length > 0 && (
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-hairline)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              marginBottom: '48px',
            }}>
              <p style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 16px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Table of Contents
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
                {headings.map((item, index) => (
                  <a key={item.id} href={`#${item.id}`} style={{
                    fontSize: '14px',
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-sans)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'opacity 0.2s',
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--color-steel)',
                      fontFamily: 'var(--font-sans)',
                    }}>
                      {index + 1}.
                    </span>
                    {item.text}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Blog Content */}
          <div 
            className="course-description" // Reuse course rich text styles
            style={{
              fontSize: '16px',
              color: 'var(--color-charcoal)',
              fontFamily: 'var(--font-sans)',
              lineHeight: '1.8',
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: processedContent }} />
          </div>

        </section>

        {/* Author Card */}
        <section style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px 64px',
        }}>
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}>
            <img
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=56&h=56&fit=crop&crop=face"
              alt="Author"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0,
                border: '2px solid var(--color-hairline)',
              }}
            />
            <div>
              <p style={{
                fontSize: '15px',
                fontWeight: '600',
                color: 'var(--color-ink-deep)',
                fontFamily: 'var(--font-sans)',
                margin: '0 0 4px',
              }}>
                PandaCourses Editorial Team
              </p>
              <p style={{
                fontSize: '13px',
                color: 'var(--color-slate)',
                fontFamily: 'var(--font-sans)',
                margin: '0',
                lineHeight: '1.6',
              }}>
                Every course and review on PandaCourses is manually verified by our team before publishing.
              </p>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 32px 96px',
          }}>
            <p style={{
              fontSize: '11px',
              fontWeight: '500',
              color: 'var(--color-steel)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 20px',
            }}>
              Related Posts
            </p>
            <div className="related-posts-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}>
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: 'var(--color-canvas)',
                    border: '1px solid var(--color-hairline)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '120px',
                      background: 'var(--color-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottom: '1px solid var(--color-hairline)',
                    }}>
                      <span style={{
                        fontSize: '12px',
                        color: 'var(--color-steel)',
                        fontFamily: 'var(--font-sans)',
                      }}>
                        Cover
                      </span>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--color-ink-deep)',
                        fontFamily: 'var(--font-sans)',
                        margin: '0 0 4px',
                        lineHeight: '1.4',
                      }}>
                        {related.title}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: 'var(--color-steel)',
                        fontFamily: 'var(--font-sans)',
                        margin: '0',
                      }}>
                        {related.author}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  )
}
