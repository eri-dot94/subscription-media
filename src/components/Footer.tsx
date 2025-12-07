import Link from 'next/link'

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Media Site'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="container-base py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="text-lg font-bold text-gray-900">
              {siteName}
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              最新のニュースと情報をお届けします。
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              ナビゲーション
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ホーム
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  記事一覧
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              法的情報
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/privacy/"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="/terms/"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  利用規約
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            &copy; {currentYear} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
