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
          '/api/',
          '/actions/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/dashboard',
          '/dashboard/',
          '/no-plan',
          '/login',
          '/signup',
          '/api/',
          '/actions/',
        ],
      },
    ],
    sitemap: [
      'https://pandacourses.com/sitemap.xml',
    ],
  }
}
