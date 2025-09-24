import { z } from 'zod'
import { SlugSchema, StatusSchema, JsonContentSchema, SeoMetadataSchema, MediaReferencesSchema } from './common'

/**
 * Item validation schemas
 * Matches the Item model in Prisma schema
 */

export const ItemUpsertSchema = z.object({
  // Required fields
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  
  slug: SlugSchema,
  
  status: StatusSchema,
  
  // JSON content - flexible structure for item content based on collection config
  content: JsonContentSchema,
  
  // SEO metadata as JSON object
  seo: SeoMetadataSchema,
  
  // Media references (array of media IDs with metadata)
  mediaRefs: MediaReferencesSchema,
})

// Schema for creating a new item (without ID, but requires collectionId)
export const ItemCreateSchema = ItemUpsertSchema.extend({
  collectionId: z.string().uuid('Invalid collection ID'),
})

// Schema for updating an existing item (includes ID)
export const ItemUpdateSchema = ItemUpsertSchema.extend({
  id: z.string().uuid('Invalid item ID'),
})

// Schema for item queries/filters
export const ItemQuerySchema = z.object({
  collectionId: z.string().uuid().optional(),
  status: StatusSchema.optional(),
  slug: SlugSchema.optional(),
  search: z.string().max(100, 'Search term too long').optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
})

// Schema for item list response
export const ItemListItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  status: StatusSchema,
  publishedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  collectionId: z.string().uuid(),
})

// Schema for full item response
export const ItemResponseSchema = ItemListItemSchema.extend({
  content: JsonContentSchema,
  seo: SeoMetadataSchema,
  mediaRefs: MediaReferencesSchema,
})

// Schema for item content structure (common fields)
export const ItemContentSchema = z.object({
  // Common content fields that most items will have
  subtitle: z.string().max(300, 'Subtitle must be 300 characters or less').optional(),
  summary: z.string().max(500, 'Summary must be 500 characters or less').optional(),
  body: z.string().optional(), // Rich text content
  excerpt: z.string().max(200, 'Excerpt must be 200 characters or less').optional(),
  
  // Metadata fields
  date: z.string().datetime().optional(),
  author: z.string().max(100, 'Author name must be 100 characters or less').optional(),
  tags: z.array(z.string().max(50, 'Tag must be 50 characters or less')).optional(),
  categories: z.array(z.string().max(50, 'Category must be 50 characters or less')).optional(),
  
  // Feature flags
  featured: z.boolean().default(false),
  
  // External links
  externalLinks: z.array(z.object({
    label: z.string().min(1, 'Link label is required'),
    url: z.string().url('Invalid URL'),
  })).optional(),
  
  // Gallery/media
  gallery: z.array(z.string().uuid()).optional(),
  heroImage: z.string().uuid().optional(),
})

// Schema for project-specific content (extends base content)
export const ProjectContentSchema = ItemContentSchema.extend({
  role: z.string().max(100, 'Role must be 100 characters or less').optional(),
  stack: z.array(z.string().max(50, 'Stack item must be 50 characters or less')).optional(),
  client: z.string().max(100, 'Client name must be 100 characters or less').optional(),
  duration: z.string().max(50, 'Duration must be 50 characters or less').optional(),
  githubUrl: z.string().url('Invalid GitHub URL').optional(),
  liveUrl: z.string().url('Invalid live URL').optional(),
})

// Schema for post-specific content (extends base content)
export const PostContentSchema = ItemContentSchema.extend({
  readingTime: z.number().int().min(1).optional(),
  publishedDate: z.string().datetime().optional(),
  lastModified: z.string().datetime().optional(),
})

// Type exports for use in components and actions
export type ItemUpsertInput = z.infer<typeof ItemUpsertSchema>
export type ItemCreateInput = z.infer<typeof ItemCreateSchema>
export type ItemUpdateInput = z.infer<typeof ItemUpdateSchema>
export type ItemQueryInput = z.infer<typeof ItemQuerySchema>
export type ItemListItem = z.infer<typeof ItemListItemSchema>
export type ItemResponse = z.infer<typeof ItemResponseSchema>
export type ItemContent = z.infer<typeof ItemContentSchema>
export type ProjectContent = z.infer<typeof ProjectContentSchema>
export type PostContent = z.infer<typeof PostContentSchema>
