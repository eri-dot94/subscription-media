import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImage } from '@/types'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

// Use placeholder to prevent build error when env vars are not set
const clientProjectId = projectId || 'placeholder'

export const client = createClient({
  projectId: clientProjectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: {
    enabled: false,
  },
})

// Safe fetch wrapper with timeout
export async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  defaultValue: T
): Promise<T> {
  // Return default if projectId is not actually configured
  if (!projectId || projectId === 'placeholder') {
    console.warn('Sanity project ID is not configured')
    return defaultValue
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const result = await client.fetch<T>(query, params, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return result ?? defaultValue
  } catch (error) {
    console.error('Sanity fetch error:', error)
    return defaultValue
  }
}

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImage) {
  return builder.image(source)
}

export function getImageUrl(
  source: SanityImage | undefined,
  width: number = 1200,
  height?: number
): string | null {
  if (!source?.asset) return null
  if (!projectId) return null

  let imageBuilder = builder.image(source).width(width).auto('format').quality(80)

  if (height) {
    imageBuilder = imageBuilder.height(height)
  }

  return imageBuilder.url()
}
