import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { MetadataRoute } from 'next'

// XML special characters encode karo
function encodeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toSlug(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('public_courses')
    .select('slug, category, tags, created_at')
    .eq('is_published', true)

  const { data: blogs } = await supabase
    .from('blog_posts')
    .select('slug, created_at')
    .eq('is_published', true)

  const serviceSupabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: landingPages } = await serviceSupabase
    .from('landing_pages')
    .select('keyword')

  const baseUrl = 'https://pandacourses.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/how-to-buy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  // Course pages
  const coursePages: MetadataRoute.Sitemap = (courses || [])
    .filter(course => course.slug)
    .map(course => ({
      url: `${baseUrl}/course/${encodeXML(course.slug)}`,
      lastModified: new Date(course.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = (blogs || [])
    .filter(post => post.slug)
    .map(post => ({
      url: `${baseUrl}/blog/${encodeXML(post.slug)}`,
      lastModified: new Date(post.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  // Category pages
  const categories = new Set<string>()
  courses?.forEach(c => {
    if (c.category && typeof c.category === 'string') {
      categories.add(c.category)
    }
  })
  const categoryPages: MetadataRoute.Sitemap = [...categories].map(cat => ({
    url: `${baseUrl}/courses/category/${toSlug(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Tag pages
  const tags = new Set<string>()
  courses?.forEach(c => {
    if (Array.isArray(c.tags)) {
      c.tags.forEach((t: string) => {
        if (t && typeof t === 'string') tags.add(t)
      })
    }
  })
  const tagPages: MetadataRoute.Sitemap = [...tags].map(tag => ({
    url: `${baseUrl}/courses/tag/${toSlug(tag)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Landing pages
  const landingPageEntries: MetadataRoute.Sitemap = (landingPages || [])
    .filter(p => p.keyword)
    .map(p => ({
      url: `${baseUrl}/${p.keyword}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  return [
    ...staticPages,
    ...coursePages,
    ...blogPages,
    ...categoryPages,
    ...tagPages,
    ...landingPageEntries,
  ]
}
