import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client, getImageUrl } from '@/lib/sanity.client'
import { postBySlugQuery, allPostSlugsQuery } from '@/lib/queries'
import type { Post } from '@/types'
import PortableTextRenderer from '@/components/PortableTextRenderer'

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Media Site'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

interface PostPageProps {
  params: { slug: string }
}

async function getPost(slug: string): Promise<Post | null> {
  return client.fetch(postBySlugQuery, { slug })
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(allPostSlugsQuery)
  return slugs.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: '記事が見つかりません',
    }
  }

  const imageUrl = getImageUrl(post.heroImage, 1200, 630)

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${post.slug.current}/`,
      siteName: siteName,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: post.heroImage?.alt || post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug.current}/`,
    },
  }
}

function generateJsonLd(post: Post) {
  const imageUrl = getImageUrl(post.heroImage, 1200, 630)

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: imageUrl || undefined,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt,
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.name,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug.current}/`,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  const imageUrl = getImageUrl(post.heroImage, 1200, 675)
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const jsonLd = generateJsonLd(post)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="py-8 sm:py-12">
        <div className="container-base">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm" aria-label="パンくずリスト">
            <ol className="flex items-center space-x-2 text-gray-500">
              <li>
                <Link href="/" className="hover:text-gray-900">
                  ホーム
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/blog/" className="hover:text-gray-900">
                  記事一覧
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 truncate max-w-[200px]">
                {post.title}
              </li>
            </ol>
          </nav>

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/category/${category.slug.current}/`}
                  className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
            <time dateTime={post.publishedAt}>{formattedDate}</time>
            {post.author && (
              <>
                <span>•</span>
                <span>{post.author.name}</span>
              </>
            )}
          </div>

          {/* Hero Image */}
          {imageUrl && (
            <div className="mt-8 relative aspect-video overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={imageUrl}
                alt={post.heroImage?.alt || post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* AdSense Placeholder - Above Content */}
          <div className="ad-container my-8">
            <span className="text-sm text-gray-400">広告スペース</span>
          </div>

          {/* Content */}
          <div className="mt-8 max-w-none">
            <PortableTextRenderer value={post.body || []} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">タグ</h2>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AdSense Placeholder - Below Content */}
          <div className="ad-container my-8">
            <span className="text-sm text-gray-400">広告スペース</span>
          </div>

          {/* Share */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              この記事をシェア
            </h2>
            <div className="flex space-x-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${siteUrl}/blog/${post.slug.current}/`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-500 transition-colors"
                aria-label="Twitterでシェア"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${siteUrl}/blog/${post.slug.current}/`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="Facebookでシェア"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={`https://line.me/R/msg/text/?${encodeURIComponent(`${post.title} ${siteUrl}/blog/${post.slug.current}/`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-green-500 transition-colors"
                aria-label="LINEでシェア"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
