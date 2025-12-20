import { MetadataRoute } from 'next'

import { getSiteUrl } from '@/lib/siteConfig'

const siteUrl = getSiteUrl()

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/studio/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
