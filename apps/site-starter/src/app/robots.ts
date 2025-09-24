export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/test-cms'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
