import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/(protected)/',
          '/test-*',
          '/debug-*',
          '/admin/',
          '/auth/action',
          '/verify-email',
          '/reset-password',
          '/unsubscribe',
          '/payment/',
          '/preview-templates',
          '/offline',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
    ],
    sitemap: 'https://quizzicallabz.qzz.io/sitemap.xml',
  }
}