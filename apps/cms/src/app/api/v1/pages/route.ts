import { NextRequest, NextResponse } from 'next/server'
import { getValidatedTenantId, TENANT_TAG } from '@/lib/tenant'
import { getPreviewMode } from '@/lib/preview'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * GET /api/v1/pages
 * 
 * Query parameters:
 * - slug (optional): Return specific page by slug
 * 
 * Returns:
 * - Single page if slug provided
 * - List of pages if no slug provided
 * - All results scoped to current tenant
 */
export async function GET(request: NextRequest) {
  try {
    // Resolve tenant ID and validate access
    const tenantId = await getValidatedTenantId()
    
    // Check if in preview mode
    const preview = await getPreviewMode()
    const inPreview = preview !== null
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    if (slug) {
      // Return single page by slug
      const page = await prisma.page.findFirst({
        where: {
          tenantId,
          slug,
          deletedAt: null, // Exclude soft-deleted pages
          // In preview mode, show both draft and published content
          // Otherwise, only show published content
          ...(inPreview ? {} : { status: 'PUBLISHED' }),
        },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          body: true,
          seoTitle: true,
          seoDescription: true,
          ogImageId: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      
      if (!page) {
        return NextResponse.json(
          { error: 'Page not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        data: page,
      }, {
        headers: {
          'Cache-Control': 'public, max-age=0, must-revalidate',
        },
      })
      
    } else {
      // Return list of pages
      const pages = await prisma.page.findMany({
        where: {
          tenantId,
          deletedAt: null, // Exclude soft-deleted pages
          // In preview mode, show both draft and published content
          // Otherwise, only show published content
          ...(inPreview ? {} : { status: 'PUBLISHED' }),
        },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })
      
      return NextResponse.json({
        success: true,
        data: pages,
        count: pages.length,
      }, {
        headers: {
          'Cache-Control': 'public, max-age=0, must-revalidate',
        },
      })
    }
    
  } catch (error) {
    console.error('Pages API error:', error)
    
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
