import { ClientConfig, RequestOptions } from './types'

export class HttpClient {
  private config: Required<ClientConfig>
  private cache = new Map<string, { data: any; timestamp: number }>()

  constructor(config: ClientConfig) {
    this.config = {
      retryAttempts: 3,
      retryDelay: 1000,
      cacheMaxAge: 60000, // 60 seconds
      cdnBase: '',
      ...config,
    }
  }

  private getCacheKey(url: string, options?: RequestOptions): string {
    const preview = options?.preview ? 'preview' : 'published'
    return `${url}:${preview}`
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const now = Date.now()
    if (now - cached.timestamp > this.config.cacheMaxAge) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private getHeaders(options?: RequestOptions): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'x-folio-site-id': this.config.siteId,
    }

    if (options?.preview) {
      headers['x-folio-preview'] = '1'
    }

    return headers
  }

  private async makeRequest(
    url: string,
    options?: RequestOptions & { method?: string; body?: any }
  ): Promise<Response> {
    const headers = this.getHeaders(options)
    
    const fetchOptions: RequestInit = {
      method: options?.method || 'GET',
      headers,
      cache: options?.cache || 'default',
    }

    if (options?.body) {
      fetchOptions.body = JSON.stringify(options.body)
    }

    // Add Next.js cache options if provided
    if (options?.next) {
      // This will be handled by Next.js fetch API
      Object.assign(fetchOptions, { next: options.next })
    }

    return fetch(url, fetchOptions)
  }

  async request<T>(
    endpoint: string,
    options?: RequestOptions & { method?: string; body?: any }
  ): Promise<T> {
    const url = `${this.config.apiBase}${endpoint}`
    const cacheKey = this.getCacheKey(url, options)

    // Check cache for GET requests (unless preview mode)
    if ((!options?.method || options.method === 'GET') && !options?.preview) {
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        return cached
      }
    }

    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await this.makeRequest(url, options)

        if (!response.ok) {
          const errorText = await response.text()
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`
          
          try {
            const errorData = JSON.parse(errorText)
            errorMessage = errorData.error || errorMessage
          } catch {
            // Use the text as-is if not JSON
          }

          throw new Error(errorMessage)
        }

        const data = await response.json()

        // Cache successful GET responses (unless preview mode)
        if ((!options?.method || options.method === 'GET') && !options?.preview) {
          this.setCache(cacheKey, data)
        }

        return data

      } catch (error) {
        lastError = error as Error
        
        // Don't retry on client errors (4xx)
        if (error instanceof Error && error.message.includes('HTTP 4')) {
          throw error
        }

        // Don't retry on the last attempt
        if (attempt === this.config.retryAttempts) {
          break
        }

        // Exponential backoff
        const delay = this.config.retryDelay * Math.pow(2, attempt - 1)
        await this.sleep(delay)
      }
    }

    throw lastError || new Error('Request failed after all retry attempts')
  }

  // Convenience methods
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, body: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body })
  }

  async put<T>(endpoint: string, body: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body })
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear()
  }

  // Clear cache for specific endpoint
  clearCacheFor(endpoint: string, options?: RequestOptions): void {
    const url = `${this.config.apiBase}${endpoint}`
    const cacheKey = this.getCacheKey(url, options)
    this.cache.delete(cacheKey)
  }
}
