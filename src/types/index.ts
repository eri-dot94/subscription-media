export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

export interface Category {
  _id: string
  _type: 'category'
  title: string
  slug: {
    current: string
  }
  description?: string
}

export interface Author {
  _id: string
  _type: 'author'
  name: string
  bio?: string
  avatar?: SanityImage
}

export interface Post {
  _id: string
  _type: 'post'
  _createdAt: string
  _updatedAt: string
  title: string
  slug: {
    current: string
  }
  body: any[]
  excerpt: string
  categories?: Category[]
  tags?: string[]
  heroImage?: SanityImage
  author?: Author
  publishedAt: string
  isPublished: boolean
}

export interface PaginatedPosts {
  posts: Post[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
