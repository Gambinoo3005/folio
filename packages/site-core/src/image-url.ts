import { ImageUrlParams } from './types'

/**
 * Generates a Cloudflare Images URL with the specified parameters
 */
export function imageUrl(
  cfImageId: string,
  params: ImageUrlParams = {},
  cdnBase?: string
): string {
  if (!cfImageId) {
    throw new Error('Cloudflare Image ID is required')
  }

  // Default CDN base if not provided
  const base = cdnBase || 'https://cdn.folio.com'
  
  // Check if this is already a full URL
  if (cfImageId.startsWith('http')) {
    return cfImageId
  }

  // Check if this is an R2 file (has file extension)
  if (cfImageId.includes('.') && !cfImageId.includes('/')) {
    return `${base}/files/${cfImageId}`
  }

  // Build the variant parameters for Cloudflare Images
  const variantParams: string[] = []

  if (params.width) {
    variantParams.push(`w=${params.width}`)
  }

  if (params.height) {
    variantParams.push(`h=${params.height}`)
  }

  if (params.quality !== undefined) {
    variantParams.push(`q=${Math.max(1, Math.min(100, params.quality))}`)
  }

  if (params.format && params.format !== 'auto') {
    variantParams.push(`f=${params.format}`)
  }

  if (params.fit && params.fit !== 'scale-down') {
    variantParams.push(`fit=${params.fit}`)
  }

  if (params.gravity && params.gravity !== 'auto') {
    variantParams.push(`gravity=${params.gravity}`)
  }

  if (params.blur !== undefined) {
    variantParams.push(`blur=${Math.max(0, Math.min(250, params.blur))}`)
  }

  if (params.sharpen !== undefined) {
    variantParams.push(`sharpen=${Math.max(0, Math.min(5, params.sharpen))}`)
  }

  if (params.brightness !== undefined) {
    variantParams.push(`brightness=${Math.max(-100, Math.min(100, params.brightness))}`)
  }

  if (params.contrast !== undefined) {
    variantParams.push(`contrast=${Math.max(-100, Math.min(100, params.contrast))}`)
  }

  if (params.gamma !== undefined) {
    variantParams.push(`gamma=${Math.max(0.1, Math.min(10, params.gamma))}`)
  }

  if (params.pixelate !== undefined) {
    variantParams.push(`pixelate=${Math.max(1, Math.min(100, params.pixelate))}`)
  }

  // Build the URL
  const variant = variantParams.length > 0 ? `/${variantParams.join(',')}` : ''
  
  return `${base}/cdn-cgi/imagedelivery/${cfImageId}${variant}`
}

/**
 * Common image size presets
 */
export const imageSizes = {
  thumbnail: { width: 150, height: 150, fit: 'cover' as const },
  small: { width: 300, height: 300, fit: 'cover' as const },
  medium: { width: 600, height: 600, fit: 'cover' as const },
  large: { width: 1200, height: 1200, fit: 'cover' as const },
  hero: { width: 1920, height: 1080, fit: 'cover' as const },
  square: { width: 400, height: 400, fit: 'cover' as const },
  portrait: { width: 400, height: 600, fit: 'cover' as const },
  landscape: { width: 800, height: 600, fit: 'cover' as const },
} as const

/**
 * Helper to get a preset image size
 */
export function imageUrlWithPreset(
  cfImageId: string,
  preset: keyof typeof imageSizes,
  additionalParams?: Partial<ImageUrlParams>,
  cdnBase?: string
): string {
  return imageUrl(cfImageId, { ...imageSizes[preset], ...additionalParams }, cdnBase)
}
