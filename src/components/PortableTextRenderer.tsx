'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity.client'

interface PortableTextRendererProps {
  value: any[]
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null
      }

      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(1200).quality(80).url()}
            alt={value.alt || ''}
            width={1200}
            height={675}
            className="rounded-lg w-full h-auto"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-600">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    code: ({ value }) => {
      return (
        <pre className="my-6 p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto">
          <code className="text-sm font-mono">{value.code}</code>
        </pre>
      )
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-gray-200">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold mt-8 mb-3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mt-6 mb-2">{children}</h4>
    ),
    normal: ({ children }) => <p className="my-4 leading-relaxed">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 pl-4 border-l-4 border-gray-300 text-gray-600 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 pl-6 list-disc space-y-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 pl-6 list-decimal space-y-1">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    underline: ({ children }) => <span className="underline">{children}</span>,
    link: ({ value, children }) => {
      const target = (value?.href || '').startsWith('http')
        ? '_blank'
        : undefined
      const rel = target === '_blank' ? 'noopener noreferrer' : undefined

      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {children}
        </a>
      )
    },
  },
}

export default function PortableTextRenderer({
  value,
}: PortableTextRendererProps) {
  return (
    <div className="prose-custom">
      <PortableText value={value} components={components} />
    </div>
  )
}
