import { createClient } from '@/lib/supabase/server'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('public_courses')
    .select('slug, category, tags, created_at')
    .eq('is_published', true)

  const baseUrl = 'https://pandacourses.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/how-to-buy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  // Course pages
  const coursePages: MetadataRoute.Sitemap = (courses || []).map(course => ({
    url: `${baseUrl}/course/${course.slug}`,
    lastModified: new Date(course.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Category pages
  const categories = new Set<string>()
  courses?.forEach(c => { if (c.category) categories.add(c.category) })
  const categoryPages: MetadataRoute.Sitemap = [...categories].map(cat => ({
    url: `${baseUrl}/courses/category/${cat.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Tag pages
  const tags = new Set<string>()
  courses?.forEach(c => { c.tags?.forEach((t: string) => tags.add(t)) })
  const tagPages: MetadataRoute.Sitemap = [...tags].map(tag => ({
    url: `${baseUrl}/courses/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticPages, ...coursePages, ...categoryPages, ...tagPages]
}
