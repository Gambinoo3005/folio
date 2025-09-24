import { NextRequest, NextResponse } from 'next/server'
import { getValidatedTenantId, TENANT_TAG } from '@/lib/tenant'
import { getPreviewMode } from '@/lib/preview'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * GET /api/v1/collections/:slug/items
 * 
 * Query parameters:
 * - status (optional): Filter by status (default: PUBLISHED)
 * - limit (optional): Number of items to return (default: 50, max: 100)
 * - offset (optional): Number of items to skip (default: 0)
 * 
 * Returns:
 * - List of items for the specified collection
 * - Scoped to current tenant
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  try {
    // Resolve tenant ID and validate access
    const tenantId = await getValidatedTenantId()
    
    // Check if in preview mode
    const preview = await getPreviewMode()
    const inPreview = preview !== null
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || (inPreview ? 'ALL' : 'PUBLISHED')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Validate status parameter
    const validStatuses = inPreview ? ['DRAFT', 'PUBLISHED', 'ALL'] : ['DRAFT', 'PUBLISHED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status parameter. Must be one of: ${validStatuses.join(', ')}.` },
        { status: 400 }
      )
    }
    
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
    
    // Find the collection by slug
    const collection = await prisma.collection.findFirst({
      where: {
        tenantId,
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    })
    
    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }
    
    // Get items for the collection
    const items = await prisma.item.findMany({
      where: {
        tenantId,
        collectionId: collection.id,
        ...(status === 'ALL' ? {} : { status: status as 'DRAFT' | 'PUBLISHED' }),
        deletedAt: null, // Exclude soft-deleted items
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        content: true,
        seo: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
      skip: offset,
    })
    
    // Get total count for pagination
    const totalCount = await prisma.item.count({
      where: {
        tenantId,
        collectionId: collection.id,
        ...(status === 'ALL' ? {} : { status: status as 'DRAFT' | 'PUBLISHED' }),
        deletedAt: null,
      },
    })
    
    return NextResponse.json({
      success: true,
      data: items,
      collection: {
        id: collection.id,
        name: collection.name,
        slug: collection.slug,
      },
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
    console.error('Collection items API error:', error)
    
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
