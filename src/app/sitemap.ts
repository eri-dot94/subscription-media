import { MetadataRoute } from 'next'
import { safeFetch } from '@/lib/sanity.client'
import { allPostSlugsQuery, allCategorySlugsQuery } from '@/lib/queries'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, categorySlugs] = await Promise.all([
    safeFetch<{ slug: string }[]>(allPostSlugsQuery, {}, []),
    safeFetch<{ slug: string }[]>(allCategorySlugsQuery, {}, []),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/blog/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  const postPages: MetadataRoute.Sitemap = postSlugs.map((item) => ({
    url: `${siteUrl}/blog/${item.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((item) => ({
    url: `${siteUrl}/category/${item.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...postPages, ...categoryPages]
}
