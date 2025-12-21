import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { safeFetch } from '@/lib/sanity.client'

export const runtime = 'edge'

import {
  postsByCategoryQuery,
  postsByCategoryCountQuery,
  categoryBySlugQuery,
} from '@/lib/queries'
import type { Post, Category } from '@/types'
import PostCard from '@/components/PostCard'
import Pagination from '@/components/Pagination'

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Media Site'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

const PAGE_SIZE = 12

interface CategoryPageProps {
  params: { slug: string }
  searchParams: { page?: string }
}

async function getCategory(slug: string): Promise<Category | null> {
  return safeFetch<Category | null>(categoryBySlugQuery, { slug }, null)
}

async function getPostsByCategory(categorySlug: string, page: number) {
  const start = (page - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  const [posts, total] = await Promise.all([
    safeFetch<Post[]>(postsByCategoryQuery, { categorySlug, start, end }, []),
    safeFetch<number>(postsByCategoryCountQuery, { categorySlug }, 0),
  ])

  return {
    posts,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE) || 1,
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.slug)

  if (!category) {
    return {
      title: 'カテゴリが見つかりません',
    }
  }

  const description =
    category.description ||
    `${category.title}に関する記事一覧です。${siteName}で最新の情報をチェック。`

  return {
    title: `${category.title}の記事一覧`,
    description,
    openGraph: {
      title: `${category.title}の記事一覧 | ${siteName}`,
      description,
      url: `${siteUrl}/category/${category.slug.current}/`,
      siteName: siteName,
      locale: 'ja_JP',
      type: 'website',
    },
    alternates: {
      canonical: `${siteUrl}/category/${category.slug.current}/`,
    },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const category = await getCategory(params.slug)

  if (!category) {
    notFound()
  }

  const currentPage = Math.max(1, parseInt(searchParams.page || '1', 10))
  const { posts, totalPages } = await getPostsByCategory(params.slug, currentPage)

  return (
    <section className="py-12 sm:py-16">
      <div className="container-base">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{category.title}</h1>
          {category.description && (
            <p className="mt-2 text-gray-600">{category.description}</p>
          )}
        </div>

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
              basePath={`/category/${params.slug}/`}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">このカテゴリにはまだ記事がありません。</p>
          </div>
        )}
      </div>
    </section>
  )
}
