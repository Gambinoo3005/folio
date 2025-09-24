import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

/**
 * Media server utilities for Cloudflare Images and R2 integration
 */

export interface SignedUploadUrl {
  url: string
  fields?: Record<string, string>
  expiresIn: number
  key: string
}

export interface ImageMetadata {
  width: number
  height: number
  format: string
  size: number
}

export interface MediaUploadResult {
  id: string
  cfImageId?: string
  r2Key?: string
  deliveryUrl: string
  metadata: {
    width?: number
    height?: number
    size: number
    mime: string
  }
}

/**
 * Creates a signed upload URL for direct client uploads
 * 
 * @param kind - Type of media ('image' for Cloudflare Images, 'file' for R2)
 * @param filename - Original filename
 * @param mime - MIME type
 * @returns Signed upload URL with necessary fields
 */
export async function createSignedUploadUrl(
  kind: 'image' | 'file',
  filename: string,
  mime: string
): Promise<SignedUploadUrl> {
  const timestamp = Date.now()
  const extension = filename.split('.').pop() || 'bin'
  const key = `${kind}s/${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`

  if (kind === 'image') {
    return await createCloudflareImagesUploadUrl(key, mime)
  } else {
    return await createR2SignedUploadUrl(key, mime)
  }
}

/**
 * Creates a signed upload URL for Cloudflare Images
 */
async function createCloudflareImagesUploadUrl(
  key: string,
  mime: string
): Promise<SignedUploadUrl> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const token = process.env.CLOUDFLARE_IMAGES_TOKEN

  if (!accountId || !token) {
    throw new Error('Cloudflare Images credentials not configured')
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requireSignedURLs: false,
        metadata: {
          key,
          mime,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Cloudflare Images API error: ${error}`)
  }

  const data = await response.json()
  
  if (!data.success) {
    throw new Error(`Cloudflare Images API error: ${data.errors?.[0]?.message || 'Unknown error'}`)
  }

  return {
    url: data.result.uploadURL,
    fields: data.result.fields,
    expiresIn: 3600, // 1 hour
    key,
  }
}

/**
 * Creates a signed upload URL for R2
 */
async function createR2SignedUploadUrl(
  key: string,
  mime: string
): Promise<SignedUploadUrl> {
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  const bucket = process.env.CLOUDFLARE_R2_BUCKET
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID

  if (!accessKeyId || !secretAccessKey || !bucket || !accountId) {
    throw new Error('R2 credentials not configured')
  }

  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: mime,
  })

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

  return {
    url,
    expiresIn: 3600,
    key,
  }
}

/**
 * Extracts image metadata from Cloudflare Images
 */
export async function getImageMetadata(cfImageId: string): Promise<ImageMetadata> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const token = process.env.CLOUDFLARE_IMAGES_TOKEN

  if (!accountId || !token) {
    throw new Error('Cloudflare Images credentials not configured')
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${cfImageId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Cloudflare Images API error: ${error}`)
  }

  const data = await response.json()
  
  if (!data.success) {
    throw new Error(`Cloudflare Images API error: ${data.errors?.[0]?.message || 'Unknown error'}`)
  }

  const image = data.result
  return {
    width: image.metadata?.width || 0,
    height: image.metadata?.height || 0,
    format: image.metadata?.format || 'unknown',
    size: image.size || 0,
  }
}

/**
 * Generates a delivery URL for media
 */
export function generateDeliveryUrl(
  kind: 'image' | 'file',
  cfImageId?: string,
  r2Key?: string,
  variant?: string
): string {
  const cdnBase = process.env.NEXT_PUBLIC_CDN_BASE || 'https://cdn.folio.com'

  if (kind === 'image' && cfImageId) {
    // Cloudflare Images delivery URL
    if (variant) {
      return `${cdnBase}/cdn-cgi/image/${variant}/${cfImageId}`
    }
    return `${cdnBase}/cdn-cgi/image/${cfImageId}`
  } else if (r2Key) {
    // R2 delivery URL
    return `${cdnBase}/${r2Key}`
  }

  throw new Error('Invalid media configuration')
}

/**
 * Generates thumbnail URL for images
 */
export function generateThumbnailUrl(
  cfImageId: string,
  width: number = 300,
  height: number = 300,
  fit: 'cover' | 'contain' | 'fill' = 'cover'
): string {
  const cdnBase = process.env.NEXT_PUBLIC_CDN_BASE || 'https://cdn.folio.com'
  return `${cdnBase}/cdn-cgi/image/width=${width},height=${height},fit=${fit}/${cfImageId}`
}

/**
 * Validates file type and size
 */
export function validateFileUpload(
  filename: string,
  mime: string,
  size: number
): { valid: boolean; error?: string } {
  const maxSize = 50 * 1024 * 1024 // 50MB
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed',
  ]

  if (size > maxSize) {
    return { valid: false, error: 'File size exceeds 50MB limit' }
  }

  const isImage = allowedImageTypes.includes(mime)
  const isFile = allowedFileTypes.includes(mime)

  if (!isImage && !isFile) {
    return { valid: false, error: 'File type not supported' }
  }

  return { valid: true }
}

/**
 * Sanitizes filename for storage
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase()
}
