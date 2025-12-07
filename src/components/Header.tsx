import Link from 'next/link'

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Media Site'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container-base">
        <nav className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
          >
            {siteName}
          </Link>

          <ul className="flex items-center space-x-6">
            <li>
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                ホーム
              </Link>
            </li>
            <li>
              <Link
                href="/blog/"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                記事一覧
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
