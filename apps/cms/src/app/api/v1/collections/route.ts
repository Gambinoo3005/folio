import { NextRequest, NextResponse } from 'next/server'
import { getValidatedTenantId, TENANT_TAG } from '@/lib/tenant'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * GET /api/v1/collections
 * 
 * Returns:
 * - List of collections (id, name, slug) for current tenant
 * - Ordered by name
 */
export async function GET(request: NextRequest) {
  try {
    // Resolve tenant ID and validate access
    const tenantId = await getValidatedTenantId()
    
    // Get collections for the tenant
    const collections = await prisma.collection.findMany({
      where: {
        tenantId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
    
    return NextResponse.json({
      success: true,
      data: collections,
      count: collections.length,
    }, {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    })
    
  } catch (error) {
    console.error('Collections API error:', error)
    
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
