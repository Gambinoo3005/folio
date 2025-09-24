import { SeoMetadata, Page, Item, Global } from './types'

/**
 * Extracts SEO metadata from a page, item, or global
 */
export function seoFrom(source: { page?: Page; item?: Item; global?: Global }): SeoMetadata {
  const { page, item, global } = source

  // Determine the content source
  const content = page || item || global
  if (!content) {
    return {}
  }

  // Extract SEO data from the content
  const seoData = (content as any).seo || {}
  const title = (content as any).title || seoData.title
  const description = seoData.description

  // Build the metadata
  const metadata: SeoMetadata = {}

  if (title) {
    metadata.title = title
    metadata['og:title'] = title
    metadata['twitter:title'] = title
  }

  if (description) {
    metadata.description = description
    metadata['og:description'] = description
    metadata['twitter:description'] = description
  }

  // Handle images
  if (seoData.image) {
    const imageUrl = typeof seoData.image === 'string' 
      ? seoData.image 
      : seoData.image.url || seoData.image.src

    if (imageUrl) {
      metadata['og:image'] = imageUrl
      metadata['twitter:image'] = imageUrl
    }
  }

  // Set default Open Graph type
  if (page) {
    metadata['og:type'] = 'website'
  } else if (item) {
    metadata['og:type'] = 'article'
  }

  // Set default Twitter card
  metadata['twitter:card'] = 'summary_large_image'

  return metadata
}

/**
 * Helper to extract SEO from a page
 */
export function seoFromPage(page: Page): SeoMetadata {
  return seoFrom({ page })
}

/**
 * Helper to extract SEO from an item
 */
export function seoFromItem(item: Item): SeoMetadata {
  return seoFrom({ item })
}

/**
 * Helper to extract SEO from a global
 */
export function seoFromGlobal(global: Global): SeoMetadata {
  return seoFrom({ global })
}

/**
 * Generates a complete meta tags object for Next.js
 */
export function generateMetaTags(metadata: SeoMetadata): Record<string, string> {
  const metaTags: Record<string, string> = {}

  // Standard meta tags
  if (metadata.title) {
    metaTags.title = metadata.title
  }

  if (metadata.description) {
    metaTags.description = metadata.description
  }

  // Open Graph tags
  Object.entries(metadata).forEach(([key, value]) => {
    if (key.startsWith('og:') && value) {
      metaTags[key] = value
    }
  })

  // Twitter tags
  Object.entries(metadata).forEach(([key, value]) => {
    if (key.startsWith('twitter:') && value) {
      metaTags[key] = value
    }
  })

  return metaTags
}

/**
 * Generates Next.js metadata object
 */
export function generateNextMetadata(metadata: SeoMetadata) {
  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata['og:title'],
      description: metadata['og:description'],
      images: metadata['og:image'] ? [{ url: metadata['og:image'] }] : undefined,
      type: metadata['og:type'] || 'website',
    },
    twitter: {
      card: metadata['twitter:card'] || 'summary_large_image',
      title: metadata['twitter:title'],
      description: metadata['twitter:description'],
      images: metadata['twitter:image'] ? [metadata['twitter:image']] : undefined,
    },
  }
}
