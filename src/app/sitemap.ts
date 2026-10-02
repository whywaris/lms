import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE = 'https://pandacourses.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [{ data: courses }, { data: posts }] = await Promise.all([
    supabase.from('public_courses').select('slug, created_at').eq('is_published', true),
    supabase.from('blog_posts').select('slug, created_at').eq('is_published', true),
  ])

  return [
    { url: BASE, lastModified: new Date() },
    { url: `${BASE}/blog`, lastModified: new Date() },
    { url: `${BASE}/pricing`, lastModified: new Date() },
    ...(courses ?? []).map((c) => ({
      url: `${BASE}/courses/${c.slug}`,
      lastModified: new Date(c.created_at),
    })),
    ...(posts ?? []).map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.created_at),
    })),
  ]
}
