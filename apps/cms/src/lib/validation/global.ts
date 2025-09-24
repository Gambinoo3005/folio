import { z } from 'zod'
import { JsonContentSchema } from './common'

/**
 * Global validation schemas
 * Matches the Global model in Prisma schema
 */

export const GlobalUpsertSchema = z.object({
  // Required fields
  key: z
    .string()
    .min(1, 'Global key is required')
    .max(100, 'Global key must be 100 characters or less')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Global key must contain only letters, numbers, underscores, and hyphens'),
  
  // JSON data - flexible structure for global content
  data: JsonContentSchema,
})

// Schema for creating a new global (without ID)
export const GlobalCreateSchema = GlobalUpsertSchema

// Schema for updating an existing global (includes ID)
export const GlobalUpdateSchema = GlobalUpsertSchema.extend({
  id: z.string().uuid('Invalid global ID'),
})

// Schema for global queries/filters
export const GlobalQuerySchema = z.object({
  key: z.string().optional(),
  search: z.string().max(100, 'Search term too long').optional(),
})

// Schema for global list response
export const GlobalListItemSchema = z.object({
  id: z.string().uuid(),
  key: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Schema for full global response
export const GlobalResponseSchema = GlobalListItemSchema.extend({
  data: JsonContentSchema,
})

// Common global data structures
export const NavigationDataSchema = z.object({
  items: z.array(z.object({
    label: z.string().min(1, 'Navigation label is required'),
    url: z.string().min(1, 'Navigation URL is required'),
    external: z.boolean().default(false),
    children: z.array(z.object({
      label: z.string().min(1, 'Sub-navigation label is required'),
      url: z.string().min(1, 'Sub-navigation URL is required'),
      external: z.boolean().default(false),
    })).optional(),
  })),
})

export const FooterDataSchema = z.object({
  copyright: z.string().optional(),
  links: z.array(z.object({
    label: z.string().min(1, 'Footer link label is required'),
    url: z.string().min(1, 'Footer link URL is required'),
    external: z.boolean().default(false),
  })).optional(),
  socialLinks: z.array(z.object({
    platform: z.string().min(1, 'Social platform is required'),
    url: z.string().url('Invalid social URL'),
    label: z.string().optional(),
  })).optional(),
})

export const SocialDataSchema = z.object({
  platforms: z.array(z.object({
    name: z.string().min(1, 'Social platform name is required'),
    url: z.string().url('Invalid social URL'),
    username: z.string().optional(),
    verified: z.boolean().default(false),
  })),
})

export const SeoDefaultsDataSchema = z.object({
  title: z.string().max(60, 'Default SEO title should be 60 characters or less').optional(),
  description: z.string().max(160, 'Default SEO description should be 160 characters or less').optional(),
  keywords: z.array(z.string().max(50, 'Keyword must be 50 characters or less')).optional(),
  ogImageId: z.string().uuid().optional(),
  twitterHandle: z.string().max(50, 'Twitter handle must be 50 characters or less').optional(),
  siteName: z.string().max(100, 'Site name must be 100 characters or less').optional(),
})

export const ContactDataSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().max(20, 'Phone number must be 20 characters or less').optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  hours: z.string().optional(),
  timezone: z.string().optional(),
})

// Type exports for use in components and actions
export type GlobalUpsertInput = z.infer<typeof GlobalUpsertSchema>
export type GlobalCreateInput = z.infer<typeof GlobalCreateSchema>
export type GlobalUpdateInput = z.infer<typeof GlobalUpdateSchema>
export type GlobalQueryInput = z.infer<typeof GlobalQuerySchema>
export type GlobalListItem = z.infer<typeof GlobalListItemSchema>
export type GlobalResponse = z.infer<typeof GlobalResponseSchema>

// Common global data types
export type NavigationData = z.infer<typeof NavigationDataSchema>
export type FooterData = z.infer<typeof FooterDataSchema>
export type SocialData = z.infer<typeof SocialDataSchema>
export type SeoDefaultsData = z.infer<typeof SeoDefaultsDataSchema>
export type ContactData = z.infer<typeof ContactDataSchema>
