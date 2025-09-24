import { z } from 'zod'

/**
 * Common validation schemas used across the CMS
 */

// Slug validation: lowercase alphanumeric with hyphens only
export const SlugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(100, 'Slug must be 100 characters or less')
  .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
  .refine(
    (slug) => !slug.startsWith('-') && !slug.endsWith('-'),
    'Slug cannot start or end with a hyphen'
  )

// Status validation matching Prisma enum
export const StatusSchema = z.enum(['DRAFT', 'PUBLISHED'], {
  errorMap: () => ({ message: 'Status must be either DRAFT or PUBLISHED' })
})

// Optional UUID validation for references
export const OptionalUuidSchema = z.string().uuid().nullable().optional()

// Required UUID validation
export const RequiredUuidSchema = z.string().uuid('Invalid UUID format')

// JSON content validation - allows any valid JSON structure
export const JsonContentSchema = z.any()

// SEO metadata validation
export const SeoMetadataSchema = z.object({
  title: z.string().max(60, 'SEO title should be 60 characters or less').optional(),
  description: z.string().max(160, 'SEO description should be 160 characters or less').optional(),
  canonical: z.string().url('Invalid canonical URL').optional(),
  noindex: z.boolean().optional(),
  ogImageId: OptionalUuidSchema,
})

// Media reference validation
export const MediaReferenceSchema = z.object({
  id: RequiredUuidSchema,
  alt: z.string().min(1, 'Alt text is required for accessibility').max(200, 'Alt text should be 200 characters or less'),
  focalX: z.number().min(0).max(1).optional(),
  focalY: z.number().min(0).max(1).optional(),
})

// Array of media references
export const MediaReferencesSchema = z.array(MediaReferenceSchema).optional()
