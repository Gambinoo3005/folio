/**
 * Basic validation tests to ensure schemas work correctly
 * This is a simple verification that the schemas are properly structured
 */

import { describe, it, expect } from 'vitest'
import {
  PageUpsertSchema,
  CollectionUpsertSchema,
  ItemUpsertSchema,
  GlobalUpsertSchema,
  SlugSchema,
  StatusSchema,
} from '../index'

describe('Validation Schemas', () => {
  describe('SlugSchema', () => {
    it('should accept valid slugs', () => {
      expect(SlugSchema.parse('valid-slug')).toBe('valid-slug')
      expect(SlugSchema.parse('another-valid-slug-123')).toBe('another-valid-slug-123')
    })

    it('should reject invalid slugs', () => {
      expect(() => SlugSchema.parse('Invalid-Slug')).toThrow()
      expect(() => SlugSchema.parse('slug with spaces')).toThrow()
      expect(() => SlugSchema.parse('-starts-with-hyphen')).toThrow()
      expect(() => SlugSchema.parse('ends-with-hyphen-')).toThrow()
    })
  })

  describe('StatusSchema', () => {
    it('should accept valid statuses', () => {
      expect(StatusSchema.parse('DRAFT')).toBe('DRAFT')
      expect(StatusSchema.parse('PUBLISHED')).toBe('PUBLISHED')
    })

    it('should reject invalid statuses', () => {
      expect(() => StatusSchema.parse('draft')).toThrow()
      expect(() => StatusSchema.parse('INVALID')).toThrow()
    })
  })

  describe('PageUpsertSchema', () => {
    it('should accept valid page data', () => {
      const validPage = {
        title: 'Test Page',
        slug: 'test-page',
        status: 'DRAFT' as const,
        body: { content: 'test content' },
        seoTitle: 'Test SEO Title',
        seoDescription: 'Test SEO Description',
        ogImageId: null,
      }

      expect(() => PageUpsertSchema.parse(validPage)).not.toThrow()
    })

    it('should reject invalid page data', () => {
      const invalidPage = {
        title: '', // Empty title
        slug: 'invalid slug', // Invalid slug
        status: 'INVALID', // Invalid status
        body: { content: 'test content' },
      }

      expect(() => PageUpsertSchema.parse(invalidPage)).toThrow()
    })
  })

  describe('CollectionUpsertSchema', () => {
    it('should accept valid collection data', () => {
      const validCollection = {
        name: 'Test Collection',
        slug: 'test-collection',
        config: { fields: [] },
      }

      expect(() => CollectionUpsertSchema.parse(validCollection)).not.toThrow()
    })
  })

  describe('ItemUpsertSchema', () => {
    it('should accept valid item data', () => {
      const validItem = {
        title: 'Test Item',
        slug: 'test-item',
        status: 'DRAFT' as const,
        content: { body: 'test content' },
        seo: { title: 'Test SEO' },
        mediaRefs: [],
      }

      expect(() => ItemUpsertSchema.parse(validItem)).not.toThrow()
    })
  })

  describe('GlobalUpsertSchema', () => {
    it('should accept valid global data', () => {
      const validGlobal = {
        key: 'navigation',
        data: { items: [] },
      }

      expect(() => GlobalUpsertSchema.parse(validGlobal)).not.toThrow()
    })
  })
})
