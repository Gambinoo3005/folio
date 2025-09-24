import { NextRequest, NextResponse } from 'next/server'
import { getValidatedTenantId, TENANT_TAG } from '@/lib/tenant'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * GET /api/v1/globals/:key
 * 
 * Returns:
 * - Global record's data for the specified key
 * - Scoped to current tenant
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params
  try {
    // Resolve tenant ID and validate access
    const tenantId = await getValidatedTenantId()
    
    // Validate key parameter
    if (!key || key.trim() === '') {
      return NextResponse.json(
        { error: 'Global key is required' },
        { status: 400 }
      )
    }
    
    // Find the global record by key
    const global = await prisma.global.findFirst({
      where: {
        tenantId,
        key,
      },
      select: {
        id: true,
        key: true,
        data: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    
    if (!global) {
      return NextResponse.json(
        { error: 'Global not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        key: global.key,
        data: global.data,
        updatedAt: global.updatedAt,
      },
    }, {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    })
    
  } catch (error) {
    console.error('Globals API error:', error)
    
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
