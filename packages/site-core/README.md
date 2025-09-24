# @portfolio-building-service/site-core

A public SDK for portfolio sites powered by the Folio CMS. This package provides typed client functions, utilities, and helpers for building portfolio websites.

## Features

- ✅ **Typed Client API** - Full TypeScript support with Zod validation
- ✅ **Automatic Headers** - Adds `x-folio-site-id` and `x-folio-preview` headers automatically
- ✅ **Retry Logic** - Built-in exponential backoff for failed requests
- ✅ **Caching** - 60-second cache for published resources (bypasses for preview mode)
- ✅ **Image Helper** - Cloudflare Images URL generation with variants
- ✅ **SEO Helper** - Extract and generate meta tags from CMS content

## Installation

```bash
pnpm add @portfolio-building-service/site-core
```

## Quick Start

```typescript
import { getClient } from '@portfolio-building-service/site-core'

// Create client instance
const client = getClient({
  apiBase: process.env.NEXT_PUBLIC_API_BASE,
  siteId: process.env.SITE_ID,
  cdnBase: process.env.NEXT_PUBLIC_CDN_BASE, // optional
})

// Fetch data
const pages = await client.pages.list()
const collections = await client.collections.list()
const items = await client.items.list('blog', { limit: 10 })
const global = await client.globals.get('site-settings')
```

## API Reference

### Client Configuration

```typescript
interface ClientConfig {
  apiBase: string        // CMS API base URL (e.g., 'http://localhost:3001')
  siteId: string         // Site identifier (e.g., 'dev-site-1')
  cdnBase?: string       // CDN base URL for images (optional)
  retryAttempts?: number // Number of retry attempts (default: 3)
  retryDelay?: number    // Initial retry delay in ms (default: 1000)
  cacheMaxAge?: number   // Cache TTL in ms (default: 60000)
}
```

### Pages API

```typescript
// Get all pages
const pages = await client.pages.list()

// Get page by slug
const page = await client.pages.getBySlug('about')
```

### Collections API

```typescript
// Get all collections
const collections = await client.collections.list()
```

### Items API

```typescript
// Get items from a collection
const response = await client.items.list('blog', {
  status: 'PUBLISHED', // 'DRAFT' | 'PUBLISHED' | 'ALL'
  limit: 10,
  offset: 0
})

// Get single item by slug
const item = await client.items.getBySlug('blog', 'my-first-post')
```

### Globals API

```typescript
// Get global value
const settings = await client.globals.get('site-settings')
```

### Request Options

```typescript
interface RequestOptions {
  preview?: boolean      // Enable preview mode
  cache?: RequestCache   // Override cache behavior
  next?: {              // Next.js cache options
    revalidate?: number
    tags?: string[]
  }
}
```

### Image Helper

```typescript
import { imageUrl, imageUrlWithPreset } from '@portfolio-building-service/site-core'

// Basic image URL
const url = imageUrl('cf-image-id', {
  width: 800,
  height: 600,
  quality: 80,
  format: 'webp'
})

// Using presets
const thumbnail = imageUrlWithPreset('cf-image-id', 'thumbnail')
const hero = imageUrlWithPreset('cf-image-id', 'hero', { quality: 90 })
```

### SEO Helper

```typescript
import { seoFrom, generateNextMetadata } from '@portfolio-building-service/site-core'

// Extract SEO from content
const seo = seoFrom({ page: myPage })
// or
const seo = seoFrom({ item: myItem })
// or
const seo = seoFrom({ global: myGlobal })

// Generate Next.js metadata
export async function generateMetadata({ params }) {
  const page = await client.pages.getBySlug(params.slug)
  return generateNextMetadata(seoFrom({ page }))
}
```

## Environment Variables

```env
NEXT_PUBLIC_API_BASE=http://localhost:3001
SITE_ID=dev-site-1
NEXT_PUBLIC_CDN_BASE=https://cdn.folio.com
```

## Error Handling

The SDK includes comprehensive error handling:

- **404 errors** return `null` for single resource requests
- **4xx client errors** are not retried
- **5xx server errors** are retried with exponential backoff
- **Network errors** are retried up to the configured limit

## Caching

- **Published content** is cached for 60 seconds by default
- **Preview mode** bypasses cache entirely
- **Cache can be cleared** using `client.clearCache()`
- **Next.js integration** supports revalidation tags

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type { 
  Page, 
  Item, 
  Collection, 
  Global,
  ClientConfig,
  RequestOptions 
} from '@portfolio-building-service/site-core'
```

## License

MIT
