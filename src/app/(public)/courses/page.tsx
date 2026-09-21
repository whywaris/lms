import { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/server'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/sections/Footer'
import CoursesCatalog from '@/components/courses/CoursesCatalog'
import { PRICE_USD } from '@/lib/siteConfig'

export const revalidate = 0

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: string; category?: string; page?: string }>
}): Promise<Metadata> {
  const params = await searchParams
  const supabase = createAdminClient()
  const { count: totalCourses } = await supabase
    .from('public_courses')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)

  const count = totalCourses || 0
  const hasSearchOrSort = Boolean(params.search || params.sort)

  const baseUrl = 'https://pandacourses.com/courses'
  const urlParams = new URLSearchParams()
  if (params.category) urlParams.set('category', params.category)
  if (params.page) urlParams.set('page', params.page)
  const canonical = urlParams.toString() ? `${baseUrl}?${urlParams.toString()}` : baseUrl

  return {
    title: 'All Courses | PandaCourses',
    description: `Browse ${count} premium courses with instant Mega / Google Drive access. One payment, lifetime access.`,
    robots: hasSearchOrSort
      ? { index: false, follow: true }
      : { index: true, follow: true },
    alternates: {
      canonical,
    },
    openGraph: {
      title: 'All Courses | PandaCourses',
      description: `Browse ${count} premium courses with instant Mega / Google Drive access. One payment, lifetime access.`,
      url: canonical,
      siteName: 'PandaCourses',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'All Courses | PandaCourses',
      description: `Browse ${count} premium courses with instant Mega / Google Drive access. One payment, lifetime access.`,
    },
  }
}

export default async function CoursesPage() {
  const supabase = createAdminClient()

  // Fetch all published courses
  const { data: courses } = await supabase
    .from('public_courses')
    .select('id, course_name, mentor, category, image_url, slug, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const allCourses = courses || []
  const totalCount = allCourses.length

  // Category counts (group by category on published courses, ordered by course count desc)
  const countMap: Record<string, number> = {}
  for (const c of allCourses) {
    if (c.category && c.category.trim()) {
      const cat = c.category.trim()
      countMap[cat] = (countMap[cat] || 0) + 1
    }
  }

  const sortedCategories = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }))

  const categoriesWithCounts = [
    { category: 'All', count: totalCount },
    ...sortedCategories,
  ]

  const price = typeof PRICE_USD === 'number' ? PRICE_USD : 99

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-surface)' }}>
      <Navbar />
      <CoursesCatalog
        initialCourses={allCourses}
        categoriesWithCounts={categoriesWithCounts}
        totalCount={totalCount}
        price={price}
      />
      <Footer />
    </main>
  )
}
