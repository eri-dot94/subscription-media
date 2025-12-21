import { Metadata } from 'next'
import { safeFetch } from '@/lib/sanity.client'

export const runtime = 'edge'
import { postsQuery, postsCountQuery } from '@/lib/queries'
import type { Post } from '@/types'
import PostCard from '@/components/PostCard'
import Pagination from '@/components/Pagination'

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Media Site'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export const metadata: Metadata = {
  title: '記事一覧',
  description: `${siteName}の記事一覧ページです。最新のニュースと情報をお届けします。`,
  openGraph: {
    title: `記事一覧 | ${siteName}`,
    description: `${siteName}の記事一覧ページです。最新のニュースと情報をお届けします。`,
    url: `${siteUrl}/blog/`,
    siteName: siteName,
    locale: 'ja_JP',
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/blog/`,
  },
}

const PAGE_SIZE = 12

interface BlogPageProps {
  searchParams: { page?: string }
}

async function getPosts(page: number) {
  const start = (page - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  const [posts, total] = await Promise.all([
    safeFetch<Post[]>(postsQuery, { start, end }, []),
    safeFetch<number>(postsCountQuery, {}, 0),
  ])

  return {
    posts,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE) || 1,
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = Math.max(1, parseInt(searchParams.page || '1', 10))
  const { posts, totalPages } = await getPosts(currentPage)

  return (
    <section className="py-12 sm:py-16">
      <div className="container-base">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">記事一覧</h1>

        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <PostCard
                  key={post._id}
                  post={post}
                  priority={currentPage === 1 && index < 6}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/blog/"
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">まだ記事がありません。</p>
          </div>
        )}
      </div>
    </section>
  )
}
