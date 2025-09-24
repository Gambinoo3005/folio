import { NextRequest, NextResponse } from 'next/server'
import { getValidatedTenantId } from '@/lib/tenant'
import { getImageMetadata, generateDeliveryUrl } from '@/server/media'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * POST /api/v1/media/commit
 * 
 * Body: { 
 *   kind: 'image' | 'file',
 *   filename: string,
 *   mime: string,
 *   size: number,
 *   cfImageId?: string,
 *   r2Key?: string,
 *   alt?: string
 * }
 * 
 * Returns: { id: string, deliveryUrl: string, metadata: object }
 */
export async function POST(request: NextRequest) {
  try {
    // Resolve tenant ID and validate access
    const tenantId = await getValidatedTenantId()
    
    // Parse request body
    const body = await request.json()
    const { kind, filename, mime, size, cfImageId, r2Key, alt } = body
    
    // Validate required fields
    if (!kind || !filename || !mime || !size) {
      return NextResponse.json(
        { error: 'Missing required fields: kind, filename, mime, size' },
        { status: 400 }
      )
    }
    
    // Validate kind
    if (!['image', 'file'].includes(kind)) {
      return NextResponse.json(
        { error: 'Invalid kind. Must be "image" or "file"' },
        { status: 400 }
      )
    }
    
    // Validate that we have either cfImageId or r2Key
    if (!cfImageId && !r2Key) {
      return NextResponse.json(
        { error: 'Either cfImageId or r2Key is required' },
        { status: 400 }
      )
    }
    
    let width: number | undefined
    let height: number | undefined
    
    // Extract image metadata if it's an image
    if (kind === 'image' && cfImageId) {
      try {
        const metadata = await getImageMetadata(cfImageId)
        width = metadata.width
        height = metadata.height
      } catch (error) {
        console.warn('Failed to extract image metadata:', error)
        // Continue without metadata
      }
    }
    
    // Generate delivery URL
    const deliveryUrl = generateDeliveryUrl(kind, cfImageId, r2Key)
    
    // Create media record
    const media = await prisma.media.create({
      data: {
        tenantId,
        kind: kind.toUpperCase() as 'IMAGE' | 'FILE',
        filename,
        mime,
        size,
        width,
        height,
        cfImageId,
        r2Key,
        alt,
      },
      select: {
        id: true,
        kind: true,
        filename: true,
        mime: true,
        size: true,
        width: true,
        height: true,
        cfImageId: true,
        r2Key: true,
        alt: true,
        focalX: true,
        focalY: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    
    return NextResponse.json({
      success: true,
      data: {
        id: media.id,
        deliveryUrl,
        metadata: {
          width: media.width,
          height: media.height,
          size: media.size,
          mime: media.mime,
        },
        media,
      },
    })
    
  } catch (error) {
    console.error('Media commit error:', error)
    
    if (error instanceof Error && error.message.includes('No tenant ID could be resolved')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
