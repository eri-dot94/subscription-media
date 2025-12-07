# SEO Media Site

Next.js + Sanity CMS で構築された SEO に強い静的メディアサイト。

## 技術スタック

- **Frontend**: Next.js 14 (App Router, SSG)
- **CMS**: Sanity v3
- **Styling**: Tailwind CSS
- **Hosting**: Cloudflare Pages
- **Language**: TypeScript

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
cd sanity && npm install && cd ..
```

### 2. 環境変数の設定

```bash
cp .env.local.example .env.local
```

`.env.local` を編集し、以下の値を設定:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=Your Media Site
```

### 3. Sanity プロジェクトの作成

```bash
cd sanity
npx sanity init --env
```

または [sanity.io](https://sanity.io) でプロジェクトを作成し、Project ID を取得。

### 4. 開発サーバーの起動

```bash
# Next.js 開発サーバー
npm run dev

# Sanity Studio（別ターミナル）
npm run sanity:dev
```

## Cloudflare Pages へのデプロイ

### ビルド設定

| 設定項目 | 値 |
|---------|-----|
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | `/` |

### 環境変数

Cloudflare Pages のダッシュボードで以下を設定:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SITE_NAME`

## フォルダ構成

```
├── sanity/              # Sanity Studio
│   ├── schemas/         # コンテンツスキーマ
│   └── sanity.config.ts
├── src/
│   ├── app/             # Next.js App Router
│   ├── components/      # React コンポーネント
│   ├── lib/             # ユーティリティ
│   └── types/           # TypeScript 型定義
└── public/              # 静的アセット
```

## 主な機能

- ✅ SSG (Static Site Generation)
- ✅ SEO 最適化 (meta, OGP, JSON-LD)
- ✅ レスポンシブデザイン
- ✅ ページネーション
- ✅ カテゴリ別記事一覧
- ✅ 自動 sitemap.xml 生成
- ✅ Google AdSense 対応構成

## Lighthouse スコア目標

- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## ライセンス

MIT
