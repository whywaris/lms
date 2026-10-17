import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/dashboard', '/login', '/signup', '/api'],
    },
    sitemap: 'https://pandacourses.com/sitemap.xml',
  }
}
