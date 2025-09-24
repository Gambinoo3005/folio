import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

/**
 * Preview mode utilities for handling preview cookies and validation.
 */

export interface PreviewPayload {
  tenantId: string
  target: 'page' | 'item'
  id: string
  token: string
  timestamp: number
}

/**
 * Checks if the current request is in preview mode by validating the preview cookie.
 * 
 * @returns Promise<PreviewPayload | null> - The preview payload if valid, null otherwise
 */
export async function getPreviewMode(): Promise<PreviewPayload | null> {
  try {
    const cookieStore = await cookies()
    const previewCookie = cookieStore.get('folio-preview')
    
    if (!previewCookie) {
      return null
    }
    
    const secret = process.env.PREVIEW_COOKIE_SECRET
    if (!secret) {
      console.error('PREVIEW_COOKIE_SECRET not configured')
      return null
    }
    
    // Verify the JWT token
    const { payload } = await jwtVerify(
      previewCookie.value,
      new TextEncoder().encode(secret)
    )
    
    // Validate payload structure
    if (
      typeof payload.tenantId === 'string' &&
      typeof payload.target === 'string' &&
      typeof payload.id === 'string' &&
      typeof payload.token === 'string' &&
      typeof payload.timestamp === 'number'
    ) {
      return {
        tenantId: payload.tenantId as string,
        target: payload.target as 'page' | 'item',
        id: payload.id as string,
        token: payload.token as string,
        timestamp: payload.timestamp as number
      }
    }
    
    return null
    
  } catch (error) {
    console.error('Preview mode validation failed:', error)
    return null
  }
}

/**
 * Checks if the current request is in preview mode for a specific target and ID.
 * 
 * @param target - The target type ('page' or 'item')
 * @param id - The target ID
 * @returns Promise<boolean> - True if in preview mode for the specified target
 */
export async function isPreviewModeFor(target: 'page' | 'item', id: string): Promise<boolean> {
  const preview = await getPreviewMode()
  return preview?.target === target && preview?.id === id
}

/**
 * Gets the tenant ID from preview mode if available.
 * 
 * @returns Promise<string | null> - The tenant ID from preview mode, null if not in preview
 */
export async function getPreviewTenantId(): Promise<string | null> {
  const preview = await getPreviewMode()
  return preview?.tenantId || null
}

/**
 * Creates a preview URL for a specific target and ID.
 * 
 * @param target - The target type ('page' or 'item')
 * @param id - The target ID
 * @param baseUrl - The base URL (defaults to current origin)
 * @returns string - The preview URL
 */
export function createPreviewUrl(target: 'page' | 'item', id: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  return `${base}/preview/${target}/${id}`
}

/**
 * Validates that a preview token is still valid (not expired).
 * 
 * @param preview - The preview payload
 * @returns boolean - True if the preview is still valid
 */
export function isPreviewValid(preview: PreviewPayload): boolean {
  const now = Date.now()
  const maxAge = 3600 * 1000 // 1 hour in milliseconds
  return (now - preview.timestamp) < maxAge
}

/**
 * Simple helper to check if the current request is in preview mode.
 * 
 * @returns Promise<boolean> - True if in preview mode, false otherwise
 */
export async function isPreview(): Promise<boolean> {
  const preview = await getPreviewMode()
  return preview !== null && isPreviewValid(preview)
}