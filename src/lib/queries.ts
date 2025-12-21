import { groq } from 'next-sanity'

// 共通のフィールド
const postFields = groq`
  _id,
  _createdAt,
  _updatedAt,
  title,
  slug,
  excerpt,
  heroImage,
  publishedAt,
  isPublished,
  "categories": categories[]->{
    _id,
    title,
    slug
  },
  tags,
  "author": author->{
    _id,
    name,
    bio,
    avatar
  }
`

// 最新記事取得（トップページ用）
export const latestPostsQuery = groq`
  *[_type == "post" && isPublished == true] | order(publishedAt desc)[0...$limit] {
    ${postFields}
  }
`

// 記事一覧取得（ページネーション対応）
export const postsQuery = groq`
  *[_type == "post" && isPublished == true] | order(publishedAt desc)[$start...$end] {
    ${postFields}
  }
`

// 記事総数取得
export const postsCountQuery = groq`
  count(*[_type == "post" && isPublished == true])
`

// slug から記事取得（詳細ページ用）
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && isPublished == true][0] {
    ${postFields},
    body
  }
`

// 全記事のslug取得（generateStaticParams用）
export const allPostSlugsQuery = groq`
  *[_type == "post" && isPublished == true] {
    "slug": slug.current
  }
`

// カテゴリ別記事取得
export const postsByCategoryQuery = groq`
  *[_type == "post" && isPublished == true && $categorySlug in categories[]->slug.current] | order(publishedAt desc)[$start...$end] {
    ${postFields}
  }
`

// カテゴリ別記事総数取得
export const postsByCategoryCountQuery = groq`
  count(*[_type == "post" && isPublished == true && $categorySlug in categories[]->slug.current])
`

// カテゴリ情報取得
export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description
  }
`

// 全カテゴリ取得
export const allCategoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`

// 全カテゴリのslug取得（generateStaticParams用）
export const allCategorySlugsQuery = groq`
  *[_type == "category"] {
    "slug": slug.current
  }
`

// 関連記事取得
export const relatedPostsQuery = groq`
  *[_type == "post" && isPublished == true && _id != $currentId && count((categories[]->slug.current)[@ in $categorySlugs]) > 0] | order(publishedAt desc)[0...3] {
    ${postFields}
  }
`

// ヒーローエリア記事取得
export const heroPostsQuery = groq`
  *[_type == "siteSettings"][0] {
    "heroPosts": heroPosts[]->{
      ${postFields}
    }
  }
`
