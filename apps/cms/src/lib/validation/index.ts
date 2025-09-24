/**
 * Validation schemas for the CMS
 * 
 * This module exports all validation schemas used across the CMS
 * for consistent data validation and type safety.
 */

// Common schemas
export * from './common'

// Entity-specific schemas
export * from './page'
export * from './collection'
export * from './item'
export * from './global'

// Re-export commonly used schemas and types for convenience
export {
  // Common schemas
  SlugSchema,
  StatusSchema,
  OptionalUuidSchema,
  RequiredUuidSchema,
  JsonContentSchema,
  SeoMetadataSchema,
  MediaReferenceSchema,
  MediaReferencesSchema,
} from './common'

export type {
  // Common types
  SlugSchema as SlugSchemaType,
  StatusSchema as StatusSchemaType,
  OptionalUuidSchema as OptionalUuidSchemaType,
  RequiredUuidSchema as RequiredUuidSchemaType,
  JsonContentSchema as JsonContentSchemaType,
  SeoMetadataSchema as SeoMetadataSchemaType,
  MediaReferenceSchema as MediaReferenceSchemaType,
  MediaReferencesSchema as MediaReferencesSchemaType,
} from './common'

export type {
  // Page types
  PageUpsertInput,
  PageCreateInput,
  PageUpdateInput,
  PageQueryInput,
  PageListItem,
  PageResponse,
} from './page'

export type {
  // Collection types
  CollectionUpsertInput,
  CollectionCreateInput,
  CollectionUpdateInput,
  CollectionQueryInput,
  CollectionListItem,
  CollectionResponse,
  CollectionFieldConfig,
  CollectionConfig,
} from './collection'

export type {
  // Item types
  ItemUpsertInput,
  ItemCreateInput,
  ItemUpdateInput,
  ItemQueryInput,
  ItemListItem,
  ItemResponse,
  ItemContent,
  ProjectContent,
  PostContent,
} from './item'

export type {
  // Global types
  GlobalUpsertInput,
  GlobalCreateInput,
  GlobalUpdateInput,
  GlobalQueryInput,
  GlobalListItem,
  GlobalResponse,
  NavigationData,
  FooterData,
  SocialData,
  SeoDefaultsData,
  ContactData,
} from './global'

// Re-export server action types
export type { ActionResult } from '../../server/actions/types'