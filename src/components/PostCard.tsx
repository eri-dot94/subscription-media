import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/types'
import { getImageUrl } from '@/lib/sanity.client'

interface PostCardProps {
  post: Post
  priority?: boolean
}

export default function PostCard({ post, priority = false }: PostCardProps) {
  const imageUrl = getImageUrl(post.heroImage, 600, 400)
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="group">
      <Link href={`/blog/${post.slug.current}/`} className="block">
        <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.heroImage?.alt || post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="mt-4">
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {post.categories.map((category) => (
                <span
                  key={category._id}
                  className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded"
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}

          <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h2>

          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {post.excerpt}
          </p>

          <time
            dateTime={post.publishedAt}
            className="mt-3 block text-xs text-gray-500"
          >
            {formattedDate}
          </time>
        </div>
      </Link>
    </article>
  )
}
