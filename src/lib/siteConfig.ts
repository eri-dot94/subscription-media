export const getSiteUrl = (): string => {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.CF_PAGES_URL ||
    'http://localhost:3000'
  )
}
