import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE = 'https://pandacourses.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  const [{ data: courses }, { data: posts }] = await Promise.all([
    supabase
      .from('public_courses')
      .select('slug, created_at')
      .eq('is_published', true),
    supabase
      .from('blog_posts')
      .select('slug, created_at')
      .eq('is_published', true),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date() },
    { url: `${BASE}/courses`, lastModified: new Date() },
    { url: `${BASE}/pricing`, lastModified: new Date() },
    { url: `${BASE}/how-to-buy`, lastModified: new Date() },
    { url: `${BASE}/blog`, lastModified: new Date() },
    { url: `${BASE}/about`, lastModified: new Date() },
    { url: `${BASE}/contact`, lastModified: new Date() },
    { url: `${BASE}/privacy`, lastModified: new Date() },
    { url: `${BASE}/terms`, lastModified: new Date() },
    { url: `${BASE}/refund`, lastModified: new Date() },
  ]

  const courseRoutes: MetadataRoute.Sitemap = (courses ?? [])
    .filter((c) => c.slug && c.slug.trim())
    .map((c) => ({
      url: `${BASE}/courses/${c.slug.trim()}`,
      lastModified: c.created_at ? new Date(c.created_at) : new Date(),
    }))

  const blogRoutes: MetadataRoute.Sitemap = (posts ?? [])
    .filter((p) => p.slug && p.slug.trim())
    .map((p) => ({
      url: `${BASE}/blog/${p.slug.trim()}`,
      lastModified: p.created_at ? new Date(p.created_at) : new Date(),
    }))

  return [
    ...staticRoutes,
    ...courseRoutes,
    ...blogRoutes,
  ]
}
