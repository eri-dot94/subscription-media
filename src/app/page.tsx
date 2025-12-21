import { Metadata } from 'next'
import Link from 'next/link'
import { safeFetch, getImageUrl } from '@/lib/sanity.client'
import { latestPostsQuery, heroPostsQuery } from '@/lib/queries'
import type { Post } from '@/types'
import PostCard from '@/components/PostCard'
import HeroSlider from '@/components/HeroSlider'

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Media Site'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export const metadata: Metadata = {
  title: `${siteName} - 最新のニュースと情報`,
  description:
    '最新のニュースと情報をお届けするメディアサイト。テクノロジー、ビジネス、ライフスタイルなど幅広いトピックをカバーしています。',
  openGraph: {
    title: `${siteName} - 最新のニュースと情報`,
    description:
      '最新のニュースと情報をお届けするメディアサイト。テクノロジー、ビジネス、ライフスタイルなど幅広いトピックをカバーしています。',
    url: siteUrl,
    siteName: siteName,
    locale: 'ja_JP',
    type: 'website',
  },
  alternates: {
    canonical: siteUrl,
  },
}

async function getLatestPosts(): Promise<Post[]> {
  return safeFetch<Post[]>(latestPostsQuery, { limit: 6 }, [])
}

async function getHeroPosts() {
  const result = await safeFetch<{ heroPosts: Post[] } | null>(
    heroPostsQuery,
    {},
    null
  )

  if (!result?.heroPosts) return []

  // Add pre-computed image URLs for the slider
  return result.heroPosts.map((post) => ({
    ...post,
    heroImageUrl: getImageUrl(post.heroImage, 1920, 1080),
  }))
}

export default async function HomePage() {
  const [posts, heroPosts] = await Promise.all([
    getLatestPosts(),
    getHeroPosts(),
  ])

  const hasHeroPosts = heroPosts.length > 0

  return (
    <>
      {/* Hero Section */}
      {hasHeroPosts ? (
        <HeroSlider posts={heroPosts} />
      ) : (
        <section className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
          <div className="container-base text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              {siteName}
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              最新のニュースと情報をお届けします。
              <br className="hidden sm:block" />
              テクノロジー、ビジネス、ライフスタイルなど幅広いトピックをカバー。
            </p>
          </div>
        </section>
      )}

      {/* Latest Posts Section */}
      <section className="py-12 sm:py-16">
        <div className="container-base">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">最新の記事</h2>
            <Link
              href="/blog/"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              すべて見る →
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <PostCard key={post._id} post={post} priority={index < 3} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">まだ記事がありません。</p>
            </div>
          )}
        </div>
      </section>

      {/* AdSense Placeholder */}
      <section className="py-8">
        <div className="container-base">
          <div className="ad-container">
            <span className="text-sm text-gray-400">広告スペース</span>
          </div>
        </div>
      </section>
    </>
  )
}
