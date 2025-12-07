import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImage } from '@/types'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

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

  let imageBuilder = builder.image(source).width(width).auto('format').quality(80)

  if (height) {
    imageBuilder = imageBuilder.height(height)
  }

  return imageBuilder.url()
}
