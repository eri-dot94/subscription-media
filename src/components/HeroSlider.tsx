'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/types'

interface HeroPost extends Post {
  heroImageUrl?: string | null
}

interface HeroSliderProps {
  posts: HeroPost[]
}

export default function HeroSlider({ posts }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % posts.length)
  }, [posts.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length)
  }, [posts.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (posts.length <= 1) return

    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [posts.length, nextSlide])

  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden bg-gray-900">
      {/* Slides */}
      {posts.map((post, index) => (
        <div
          key={post._id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          {post.heroImageUrl && (
            <Image
              src={post.heroImageUrl}
              alt={post.heroImage?.alt || post.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-end">
            <div className="container-base pb-16 sm:pb-20 lg:pb-24">
              <div className="max-w-3xl">
                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.categories.map((category) => (
                      <span
                        key={category._id}
                        className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-full"
                      >
                        {category.title}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <Link href={`/blog/${post.slug.current}`}>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 hover:text-blue-300 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </Link>

                {/* Excerpt */}
                <p className="text-gray-200 text-sm sm:text-base lg:text-lg mb-6 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Read More Button */}
                <Link
                  href={`/blog/${post.slug.current}`}
                  className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  記事を読む
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {posts.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
            aria-label="前のスライド"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
            aria-label="次のスライド"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {posts.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`スライド ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
