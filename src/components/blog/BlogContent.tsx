'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string | null
  reading_time: number | null
  cover_image: string | null
  author: string | null
  category?: string | null
  is_published: boolean
  created_at: string
}

interface Props {
  posts: BlogPost[]
}

export default function BlogContent({ posts }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  function stripHtml(html: string) {
    if (!html) return ''
    // Basic HTML strip
    return html.replace(/<[^>]*>?/gm, '').trim()
  }

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [posts, search, activeCategory])

  const featuredPost = filteredPosts[0]
  const remainingPosts = filteredPosts.slice(1)

  const categories = useMemo(() => {
    const cats = new Set(posts.map(p => p.category).filter(Boolean) as string[])
    return ['All', ...Array.from(cats).sort()]
  }, [posts])

  return (
    <div>
      {/* Search & Filter Bar */}
      <section style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-hairline)',
        position: 'sticky',
        top: '64px',
        zIndex: 40,
        padding: '16px 32px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap',
        }}>
          {/* Categories */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }} className="no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: '500',
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  border: '1px solid',
                  background: activeCategory === cat ? 'var(--color-ink-deep)' : 'transparent',
                  color: activeCategory === cat ? 'var(--color-on-dark)' : 'var(--color-slate)',
                  borderColor: activeCategory === cat ? 'var(--color-ink-deep)' : 'var(--color-hairline-strong)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 16px 0 36px',
                background: 'var(--color-canvas)',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
              }}
            />
            <span style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '14px',
              opacity: 0.5,
            }}>
              🔍
            </span>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '48px 32px 96px',
      }}>
        {filteredPosts.length > 0 ? (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <Link href={`/blog/${featuredPost.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  background: 'var(--color-canvas)',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  marginBottom: '48px',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'transform 0.2s ease',
                }} className="hover-lift">
                  {/* Cover Image */}
                  <div style={{
                    height: '100%',
                    minHeight: '300px',
                    background: 'var(--color-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRight: '1px solid var(--color-hairline)',
                    position: 'relative',
                  }}>
                    {featuredPost.cover_image ? (
                      <img
                        src={featuredPost.cover_image}
                        alt={featuredPost.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '48px' }}>📝</span>
                    )}
                  </div>
                  {/* Details */}
                  <div style={{ padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--color-tint-lavender)',
                        color: 'var(--color-ink-deep)',
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontFamily: 'var(--font-sans)',
                      }}>
                        {featuredPost.category || 'Featured'}
                      </span>
                    </div>
                    <h2 style={{
                      fontSize: 'clamp(24px, 3vw, 32px)',
                      fontWeight: '700',
                      color: 'var(--color-ink-deep)',
                      fontFamily: 'var(--font-sans)',
                      margin: '0 0 16px',
                      lineHeight: '1.2',
                    }}>
                      {featuredPost.title}
                    </h2>
                    <p style={{
                      fontSize: '16px',
                      color: 'var(--color-slate)',
                      fontFamily: 'var(--font-sans)',
                      margin: '0 0 32px',
                      lineHeight: '1.6',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {stripHtml(featuredPost.content || '')}
                    </p>
                    <div style={{
                      marginTop: 'auto',
                      paddingTop: '24px',
                      borderTop: '1px solid var(--color-hairline-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-ink)', fontFamily: 'var(--font-sans)', margin: 0 }}>
                        {featuredPost.author}
                      </p>
                      <p style={{ fontSize: '13px', color: 'var(--color-steel)', fontFamily: 'var(--font-sans)', margin: 0 }}>
                        {new Date(featuredPost.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Posts Grid */}
            <div className="blog-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '32px',
            }}>
              {remainingPosts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--color-canvas)',
                    border: '1px solid var(--color-hairline)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                  }} className="hover-lift">
                    {/* Cover Image */}
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    ) : (
                      <div style={{
                        height: '200px',
                        background: 'var(--color-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottom: '1px solid var(--color-hairline)',
                      }}>
                        <span style={{ fontSize: '32px' }}>📝</span>
                      </div>
                    )}
                    {/* Content */}
                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--color-tint-lavender)',
                          color: 'var(--color-ink-deep)',
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          fontFamily: 'var(--font-sans)',
                        }}>
                          {post.category || 'Article'}
                        </span>
                      </div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'var(--color-ink-deep)',
                        fontFamily: 'var(--font-sans)',
                        margin: '0 0 10px',
                        lineHeight: '1.4',
                      }}>
                        {post.title}
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        color: 'var(--color-slate)',
                        fontFamily: 'var(--font-sans)',
                        margin: '0 0 20px',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {stripHtml(post.content || '')}
                      </p>
                      <div style={{
                        marginTop: 'auto',
                        paddingTop: '16px',
                        borderTop: '1px solid var(--color-hairline-soft)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-ink)', fontFamily: 'var(--font-sans)', margin: 0 }}>
                          {post.author}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--color-steel)', fontFamily: 'var(--font-sans)', margin: 0 }}>
                          {new Date(post.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
          <div style={{
            textAlign: 'center',
            padding: '96px 32px',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px dashed var(--color-hairline-strong)',
          }}>
            <p style={{ fontSize: '48px', margin: '0 0 24px' }}>🔍</p>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'var(--color-ink-deep)',
              fontFamily: 'var(--font-sans)',
              margin: '0 0 8px',
            }}>
              No posts yet
            </h3>
            <p style={{
              fontSize: '15px',
              color: 'var(--color-slate)',
              fontFamily: 'var(--font-sans)',
              margin: '0',
            }}>
              Check back soon — new content is on the way.
            </p>
          </div>
        )}
      </section>

      <style jsx global>{`
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg) !important;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
