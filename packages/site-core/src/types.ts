import { z } from 'zod'

// Base API response schema
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
  error: z.string().optional(),
})

// Collection schema
export const CollectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Page schema
export const PageSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  content: z.any(),
  seo: z.any().optional(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Item schema
export const ItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  content: z.any(),
  seo: z.any().optional(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Global schema
export const GlobalSchema = z.object({
  key: z.string(),
  data: z.any(),
  updatedAt: z.string(),
})

// Pagination schema
export const PaginationSchema = z.object({
  limit: z.number(),
  offset: z.number(),
  total: z.number(),
  hasMore: z.boolean(),
})

// Collections list response
export const CollectionsListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(CollectionSchema),
  count: z.number(),
})

// Pages response (single or list)
export const PagesResponseSchema = z.object({
  success: z.boolean(),
  data: z.union([PageSchema, z.array(PageSchema)]),
})

// Items list response
export const ItemsListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(ItemSchema),
  collection: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  }),
  pagination: PaginationSchema,
})

// Global response
export const GlobalResponseSchema = z.object({
  success: z.boolean(),
  data: GlobalSchema,
})

// Client configuration
export interface ClientConfig {
  apiBase: string
  siteId: string
  cdnBase?: string
  retryAttempts?: number
  retryDelay?: number
  cacheMaxAge?: number
}

// Request options
export interface RequestOptions {
  preview?: boolean
  cache?: 'default' | 'force-cache' | 'no-cache' | 'no-store' | 'only-if-cached' | 'reload'
  next?: {
    revalidate?: number
    tags?: string[]
  }
}

// Image URL parameters
export interface ImageUrlParams {
  width?: number
  height?: number
  quality?: number
  format?: 'auto' | 'webp' | 'jpeg' | 'png' | 'gif'
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad'
  gravity?: 'auto' | 'side' | 'top' | 'bottom' | 'left' | 'right' | 'center'
  blur?: number
  sharpen?: number
  brightness?: number
  contrast?: number
  gamma?: number
  pixelate?: number
}

// SEO metadata
export interface SeoMetadata {
  title?: string
  description?: string
  'og:title'?: string
  'og:description'?: string
  'og:image'?: string
  'og:url'?: string
  'og:type'?: string
  'twitter:card'?: string
  'twitter:title'?: string
  'twitter:description'?: string
  'twitter:image'?: string
}

// Type exports
export type Collection = z.infer<typeof CollectionSchema>
export type Page = z.infer<typeof PageSchema>
export type Item = z.infer<typeof ItemSchema>
export type Global = z.infer<typeof GlobalSchema>
export type Pagination = z.infer<typeof PaginationSchema>
export type CollectionsListResponse = z.infer<typeof CollectionsListResponseSchema>
export type PagesResponse = z.infer<typeof PagesResponseSchema>
export type ItemsListResponse = z.infer<typeof ItemsListResponseSchema>
export type GlobalResponse = z.infer<typeof GlobalResponseSchema>
