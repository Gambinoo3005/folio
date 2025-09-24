import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export interface PreviewPayload {
  siteId: string
  slug: string
  target: 'page' | 'item'
  timestamp: number
}

/**
 * Checks if the current request is in preview mode by validating the preview cookie.
 */
export async function isPreview(): Promise<boolean> {
  try {
    const preview = await getPreviewMode()
    return preview !== null && isPreviewValid(preview)
  } catch {
    return false
  }
}

/**
 * Gets the preview mode payload if valid
 */
export async function getPreviewMode(): Promise<PreviewPayload | null> {
  try {
    const cookieStore = await cookies()
    const previewCookie = cookieStore.get('folio-preview')
    
    if (!previewCookie) {
      return null
    }
    
    const secret = process.env.PREVIEW_COOKIE_SECRET || 'dev-secret-key'
    
    // Verify the JWT token
    const { payload } = await jwtVerify(
      previewCookie.value,
      new TextEncoder().encode(secret)
    )
    
    // Validate payload structure
    if (
      typeof payload.siteId === 'string' &&
      typeof payload.slug === 'string' &&
      typeof payload.target === 'string' &&
      typeof payload.timestamp === 'number'
    ) {
      return {
        siteId: payload.siteId as string,
        slug: payload.slug as string,
        target: payload.target as 'page' | 'item',
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
 * Validates that a preview token is still valid (not expired).
 */
export function isPreviewValid(preview: PreviewPayload): boolean {
  const now = Date.now()
  const maxAge = 3600 * 1000 // 1 hour in milliseconds
  return (now - preview.timestamp) < maxAge
}

/**
 * Gets the preview slug if in preview mode
 */
export async function getPreviewSlug(): Promise<string | null> {
  const preview = await getPreviewMode()
  return preview?.slug || null
}

/**
 * Gets the preview target if in preview mode
 */
export async function getPreviewTarget(): Promise<'page' | 'item' | null> {
  const preview = await getPreviewMode()
  return preview?.target || null
}
