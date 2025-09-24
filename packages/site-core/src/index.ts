// Main client
export { FolioClient } from './client'
export { getClient } from './get-client'

// Types
export type {
  ClientConfig,
  RequestOptions,
  Collection,
  Page,
  Item,
  Global,
  Pagination,
  CollectionsListResponse,
  PagesResponse,
  ItemsListResponse,
  GlobalResponse,
  ImageUrlParams,
  SeoMetadata,
} from './types'

// Utilities
export { imageUrl, imageUrlWithPreset, imageSizes } from './image-url'
export { 
  seoFrom, 
  seoFromPage, 
  seoFromItem, 
  seoFromGlobal,
  generateMetaTags,
  generateNextMetadata 
} from './seo'

// Re-export commonly used types for convenience
export type { FolioClient as Client } from './client'
