import { FolioClient } from './client'
import { ClientConfig } from './types'

/**
 * Creates a new Folio client instance with the provided configuration
 */
export function getClient(config: ClientConfig): FolioClient {
  // Validate required configuration
  if (!config.apiBase) {
    throw new Error('apiBase is required in client configuration')
  }

  if (!config.siteId) {
    throw new Error('siteId is required in client configuration')
  }

  // Ensure apiBase ends with a slash for consistent URL building
  const normalizedConfig: ClientConfig = {
    ...config,
    apiBase: config.apiBase.endsWith('/') ? config.apiBase : `${config.apiBase}/`,
  }

  return new FolioClient(normalizedConfig)
}

/**
 * Creates a client from environment variables
 * This is a convenience function for common setups
 */
export function getClientFromEnv(): FolioClient {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE
  const siteId = process.env.SITE_ID

  if (!apiBase) {
    throw new Error('NEXT_PUBLIC_API_BASE environment variable is required')
  }

  if (!siteId) {
    throw new Error('SITE_ID environment variable is required')
  }

  return getClient({
    apiBase,
    siteId,
    cdnBase: process.env.NEXT_PUBLIC_CDN_BASE,
  })
}
