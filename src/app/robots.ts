import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/dashboard',
          '/dashboard/',
          '/no-plan',
          '/login',
          '/signup',
        ],
      },
    ],
    sitemap: 'https://pandacourses.com/sitemap.xml',
  }
}
