import { z } from 'zod'
import { SlugSchema, JsonContentSchema } from './common'

/**
 * Collection validation schemas
 * Matches the Collection model in Prisma schema
 */

export const CollectionUpsertSchema = z.object({
  // Required fields
  name: z
    .string()
    .min(1, 'Collection name is required')
    .max(100, 'Collection name must be 100 characters or less'),
  
  slug: SlugSchema,
  
  // Configuration as JSON - flexible structure for collection field definitions
  config: JsonContentSchema,
})

// Schema for creating a new collection (without ID)
export const CollectionCreateSchema = CollectionUpsertSchema

// Schema for updating an existing collection (includes ID)
export const CollectionUpdateSchema = CollectionUpsertSchema.extend({
  id: z.string().uuid('Invalid collection ID'),
})

// Schema for collection queries/filters
export const CollectionQuerySchema = z.object({
  slug: SlugSchema.optional(),
  search: z.string().max(100, 'Search term too long').optional(),
})

// Schema for collection list response
export const CollectionListItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  itemCount: z.number().int().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Schema for full collection response
export const CollectionResponseSchema = CollectionListItemSchema.extend({
  config: JsonContentSchema,
})

// Schema for collection field configuration
export const CollectionFieldConfigSchema = z.object({
  name: z.string().min(1, 'Field name is required'),
  type: z.enum(['text', 'textarea', 'rich_text', 'image', 'gallery', 'date', 'boolean', 'select', 'multiselect']),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(), // For select/multiselect fields
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
})

// Schema for collection configuration structure
export const CollectionConfigSchema = z.object({
  fields: z.array(CollectionFieldConfigSchema),
  displayField: z.string().optional(), // Which field to use as the primary display
  sortField: z.string().optional(), // Which field to sort by default
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Type exports for use in components and actions
export type CollectionUpsertInput = z.infer<typeof CollectionUpsertSchema>
export type CollectionCreateInput = z.infer<typeof CollectionCreateSchema>
export type CollectionUpdateInput = z.infer<typeof CollectionUpdateSchema>
export type CollectionQueryInput = z.infer<typeof CollectionQuerySchema>
export type CollectionListItem = z.infer<typeof CollectionListItemSchema>
export type CollectionResponse = z.infer<typeof CollectionResponseSchema>
export type CollectionFieldConfig = z.infer<typeof CollectionFieldConfigSchema>
export type CollectionConfig = z.infer<typeof CollectionConfigSchema>
