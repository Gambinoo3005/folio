import { z } from 'zod'
import { SlugSchema, StatusSchema, OptionalUuidSchema, JsonContentSchema, SeoMetadataSchema } from './common'

/**
 * Page validation schemas
 * Matches the Page model in Prisma schema
 */

export const PageUpsertSchema = z.object({
  // Required fields
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  
  slug: SlugSchema,
  
  status: StatusSchema,
  
  // JSON body content - flexible structure for page content
  body: JsonContentSchema,
  
  // SEO fields
  seoTitle: z
    .string()
    .max(60, 'SEO title should be 60 characters or less')
    .optional(),
  
  seoDescription: z
    .string()
    .max(160, 'SEO description should be 160 characters or less')
    .optional(),
  
  // Open Graph image reference
  ogImageId: OptionalUuidSchema,
})

// Schema for creating a new page (without ID)
export const PageCreateSchema = PageUpsertSchema

// Schema for updating an existing page (includes ID)
export const PageUpdateSchema = PageUpsertSchema.extend({
  id: z.string().uuid('Invalid page ID'),
})

// Schema for page queries/filters
export const PageQuerySchema = z.object({
  status: StatusSchema.optional(),
  slug: SlugSchema.optional(),
  search: z.string().max(100, 'Search term too long').optional(),
})

// Schema for page list response
export const PageListItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  status: StatusSchema,
  publishedAt: z.date().nullable(),
  updatedAt: z.date(),
  updatedBy: z.string().nullable(),
})

// Schema for full page response
export const PageResponseSchema = PageListItemSchema.extend({
  body: JsonContentSchema,
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  ogImageId: z.string().uuid().nullable(),
  createdAt: z.date(),
})

// Type exports for use in components and actions
export type PageUpsertInput = z.infer<typeof PageUpsertSchema>
export type PageCreateInput = z.infer<typeof PageCreateSchema>
export type PageUpdateInput = z.infer<typeof PageUpdateSchema>
export type PageQueryInput = z.infer<typeof PageQuerySchema>
export type PageListItem = z.infer<typeof PageListItemSchema>
export type PageResponse = z.infer<typeof PageResponseSchema>
