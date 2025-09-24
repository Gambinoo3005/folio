import { getClient } from '@portfolio-building-service/site-core'

export default async function sitemap() {
  const client = getClient({
    apiBase: process.env.NEXT_PUBLIC_API_BASE!,
    siteId: process.env.SITE_ID!,
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'
  
  try {
    // Get all published pages
    const pages = await client.pages.list({ preview: false })
    
    // Get all collections
    const collections = await client.collections.list({ preview: false })
    
    // Get all published items from each collection
    const collectionItems = await Promise.all(
      collections.map(async (collection) => {
        try {
          const response = await client.items.list(collection.slug, {
            preview: false,
            status: 'PUBLISHED',
            limit: 100, // Adjust as needed
          })
          return response.data.map(item => ({
            url: `${baseUrl}/${collection.slug}/${item.slug}`,
            lastModified: new Date(item.updatedAt),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          }))
        } catch (error) {
          console.error(`Error fetching items for collection ${collection.slug}:`, error)
          return []
        }
      })
    )

    // Flatten collection items
    const allCollectionItems = collectionItems.flat()

    // Create sitemap entries
    const sitemap = [
      // Home page
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      // All pages
      ...pages
        .filter(page => page.status === 'PUBLISHED')
        .map(page => ({
          url: `${baseUrl}/${page.slug}`,
          lastModified: new Date(page.updatedAt),
          changeFrequency: 'weekly' as const,
          priority: page.slug === 'home' ? 1 : 0.9,
        })),
      // Collection list pages
      ...collections.map(collection => ({
        url: `${baseUrl}/${collection.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      // Collection items
      ...allCollectionItems,
    ]

    return sitemap
  } catch (error) {
    console.error('Sitemap generation error:', error)
    
    // Return minimal sitemap on error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
    ]
  }
}
