import { NextRequest, NextResponse } from 'next/server'
import { getValidatedTenantId } from '@/lib/tenant'
import { generateDeliveryUrl, generateThumbnailUrl } from '@/server/media'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * GET /api/v1/media
 * 
 * Query parameters:
 * - kind (optional): Filter by media kind (IMAGE, FILE)
 * - search (optional): Search by filename
 * - limit (optional): Number of items to return (default: 50, max: 100)
 * - offset (optional): Number of items to skip (default: 0)
 * - sort (optional): Sort field (default: createdAt)
 * - order (optional): Sort order (default: desc)
 * 
 * Returns: List of media items with delivery URLs
 */
export async function GET(request: NextRequest) {
  try {
    // Resolve tenant ID and validate access
    const tenantId = await getValidatedTenantId()
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const kind = searchParams.get('kind')
    const search = searchParams.get('search')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'
    
    // Validate pagination parameters
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: 'Invalid limit parameter. Must be a positive number.' },
        { status: 400 }
      )
    }
    
    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        { error: 'Invalid offset parameter. Must be a non-negative number.' },
        { status: 400 }
      )
    }
    
    // Validate sort parameters
    const validSortFields = ['createdAt', 'updatedAt', 'filename', 'size']
    if (!validSortFields.includes(sort)) {
      return NextResponse.json(
        { error: `Invalid sort field. Must be one of: ${validSortFields.join(', ')}.` },
        { status: 400 }
      )
    }
    
    const validOrders = ['asc', 'desc']
    if (!validOrders.includes(order)) {
      return NextResponse.json(
        { error: `Invalid order. Must be one of: ${validOrders.join(', ')}.` },
        { status: 400 }
      )
    }
    
    // Build where clause
    const where: any = {
      tenantId,
      deletedAt: null, // Exclude soft-deleted media
    }
    
    if (kind && ['IMAGE', 'FILE'].includes(kind.toUpperCase())) {
      where.kind = kind.toUpperCase()
    }
    
    if (search) {
      where.filename = {
        contains: search,
        mode: 'insensitive',
      }
    }
    
    // Get media items
    const media = await prisma.media.findMany({
      where,
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
      orderBy: {
        [sort]: order,
      },
      take: limit,
      skip: offset,
    })
    
    // Get total count for pagination
    const totalCount = await prisma.media.count({ where })
    
    // Add delivery URLs and thumbnails
    const mediaWithUrls = media.map(item => {
      const deliveryUrl = generateDeliveryUrl(
        item.kind.toLowerCase() as 'image' | 'file',
        item.cfImageId || undefined,
        item.r2Key || undefined
      )
      
      let thumbnailUrl: string | undefined
      if (item.kind === 'IMAGE' && item.cfImageId) {
        thumbnailUrl = generateThumbnailUrl(item.cfImageId, 300, 300, 'cover')
      }
      
      return {
        ...item,
        deliveryUrl,
        thumbnailUrl,
      }
    })
    
    return NextResponse.json({
      success: true,
      data: mediaWithUrls,
      pagination: {
        limit,
        offset,
        total: totalCount,
        hasMore: offset + limit < totalCount,
      },
    }, {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    })
    
  } catch (error) {
    console.error('Media list API error:', error)
    
    if (error instanceof Error && error.message.includes('No tenant ID could be resolved')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
