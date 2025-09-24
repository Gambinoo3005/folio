import { HttpClient } from './http-client'
import {
  ClientConfig,
  RequestOptions,
  CollectionsListResponse,
  PagesResponse,
  ItemsListResponse,
  GlobalResponse,
  Page,
  Item,
  Collection,
  Global,
} from './types'

export class FolioClient {
  private http: HttpClient

  constructor(config: ClientConfig) {
    this.http = new HttpClient(config)
  }

  // Pages API
  get pages() {
    return {
      /**
       * Get a page by slug
       */
      getBySlug: async (slug: string, options?: RequestOptions): Promise<Page | null> => {
        try {
          const response = await this.http.get<PagesResponse>(
            `/api/v1/pages?slug=${encodeURIComponent(slug)}`,
            {
              ...options,
              next: {
                ...options?.next,
                tags: [`tenant:${this.http['config'].siteId}`, ...(options?.next?.tags || [])],
              },
            }
          )
          
          if (Array.isArray(response.data)) {
            return response.data.length > 0 ? response.data[0] : null
          }
          
          return response.data
        } catch (error) {
          if (error instanceof Error && error.message.includes('404')) {
            return null
          }
          throw error
        }
      },

      /**
       * Get all pages
       */
      list: async (options?: RequestOptions): Promise<Page[]> => {
        const response = await this.http.get<PagesResponse>('/api/v1/pages', {
          ...options,
          next: {
            ...options?.next,
            tags: [`tenant:${this.http['config'].siteId}`, ...(options?.next?.tags || [])],
          },
        })
        
        if (Array.isArray(response.data)) {
          return response.data
        }
        
        return [response.data]
      },
    }
  }

  // Collections API
  get collections() {
    return {
      /**
       * Get all collections
       */
      list: async (options?: RequestOptions): Promise<Collection[]> => {
        const response = await this.http.get<CollectionsListResponse>('/api/v1/collections', {
          ...options,
          next: {
            ...options?.next,
            tags: [`tenant:${this.http['config'].siteId}`, ...(options?.next?.tags || [])],
          },
        })
        return response.data
      },
    }
  }

  // Items API
  get items() {
    return {
      /**
       * Get items from a collection
       */
      list: async (
        collectionSlug: string,
        options?: RequestOptions & {
          status?: 'DRAFT' | 'PUBLISHED' | 'ALL'
          limit?: number
          offset?: number
        }
      ): Promise<ItemsListResponse> => {
        const params = new URLSearchParams()
        
        if (options?.status) {
          params.set('status', options.status)
        }
        if (options?.limit) {
          params.set('limit', options.limit.toString())
        }
        if (options?.offset) {
          params.set('offset', options.offset.toString())
        }

        const queryString = params.toString()
        const endpoint = `/api/v1/collections/${encodeURIComponent(collectionSlug)}/items${
          queryString ? `?${queryString}` : ''
        }`

        return this.http.get<ItemsListResponse>(endpoint, {
          ...options,
          next: {
            ...options?.next,
            tags: [`tenant:${this.http['config'].siteId}`, ...(options?.next?.tags || [])],
          },
        })
      },

      /**
       * Get a single item by slug from a collection
       */
      getBySlug: async (
        collectionSlug: string,
        slug: string,
        options?: RequestOptions
      ): Promise<Item | null> => {
        try {
          const response = await this.items.list(collectionSlug, {
            ...options,
            limit: 1,
            offset: 0,
          })

          const item = response.data.find((item: Item) => item.slug === slug)
          return item || null
        } catch (error) {
          if (error instanceof Error && error.message.includes('404')) {
            return null
          }
          throw error
        }
      },
    }
  }

  // Globals API
  get globals() {
    return {
      /**
       * Get a global value by key
       */
      get: async (key: string, options?: RequestOptions): Promise<Global | null> => {
        try {
        const response = await this.http.get<GlobalResponse>(
          `/api/v1/globals/${encodeURIComponent(key)}`,
          {
            ...options,
            next: {
              ...options?.next,
              tags: [`tenant:${this.http['config'].siteId}`, ...(options?.next?.tags || [])],
            },
          }
        )
          return response.data
        } catch (error) {
          if (error instanceof Error && error.message.includes('404')) {
            return null
          }
          throw error
        }
      },
    }
  }

  // Utility methods
  /**
   * Clear cache for all requests
   */
  clearCache(): void {
    this.http.clearCache()
  }

  /**
   * Clear cache for a specific endpoint
   */
  clearCacheFor(endpoint: string, options?: RequestOptions): void {
    this.http.clearCacheFor(endpoint, options)
  }
}
