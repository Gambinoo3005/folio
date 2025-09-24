import Image from 'next/image'
import { imageUrl, ImageUrlParams } from '@portfolio-building-service/site-core'

interface FolioImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  focalPoint?: {
    x: number // 0-1
    y: number // 0-1
  }
  imageParams?: ImageUrlParams
}

export function FolioImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
  focalPoint,
  imageParams = {},
}: FolioImageProps) {
  // Determine if this is a Cloudflare Image ID or a regular URL
  const isCloudflareImage = src && !src.startsWith('http') && !src.startsWith('/')
  
  let imageSrc = src
  let imageStyle: React.CSSProperties = {}

  if (isCloudflareImage) {
    // Use the imageUrl helper for Cloudflare Images
    imageSrc = imageUrl(src, {
      width,
      height,
      quality: 80,
      format: 'auto',
      ...imageParams,
    }, process.env.NEXT_PUBLIC_CDN_BASE)
  }

  // Calculate object position from focal point
  if (focalPoint && width && height) {
    const x = focalPoint.x * 100
    const y = focalPoint.y * 100
    imageStyle.objectPosition = `${x}% ${y}%`
  }

  // If no width/height provided, use Next.js Image with fill
  if (!width || !height) {
    return (
      <div className={`relative ${className || ''}`}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className="object-cover"
          style={imageStyle}
          priority={priority}
          sizes={sizes || '100vw'}
        />
      </div>
    )
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={imageStyle}
      priority={priority}
      sizes={sizes}
    />
  )
}

// Helper component for R2 files
interface FolioFileProps {
  src: string
  alt: string
  className?: string
}

export function FolioFile({ src, alt, className }: FolioFileProps) {
  // For R2 files, construct the CDN URL
  const cdnBase = process.env.NEXT_PUBLIC_CDN_BASE || 'https://cdn.folio.com'
  const fileUrl = src.startsWith('http') ? src : `${cdnBase}/files/${src}`

  return (
    <img
      src={fileUrl}
      alt={alt}
      className={className}
    />
  )
}
