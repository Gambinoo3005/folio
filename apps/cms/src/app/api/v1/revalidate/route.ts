import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { TENANT_TAG } from '@/lib/tenant'

/**
 * POST /api/v1/revalidate
 * 
 * Headers: x-folio-revalidate-secret must equal REVALIDATE_WEBHOOK_SECRET
 * Body: { tenantId: string, tags?: string[] }
 * 
 * Behavior:
 * - Validates webhook secret
 * - Calls revalidateTag(TENANT_TAG(tenantId)) and any extra tags
 * - Returns 204 on success
 */
export async function POST(request: NextRequest) {
  try {
    // Validate webhook secret
    const secret = request.headers.get('x-folio-revalidate-secret')
    const expectedSecret = process.env.REVALIDATE_WEBHOOK_SECRET
    
    if (!expectedSecret) {
      console.error('REVALIDATE_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Revalidation not configured' },
        { status: 500 }
      )
    }
    
    if (!secret || secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Invalid or missing revalidation secret' },
        { status: 401 }
      )
    }
    
    // Parse request body
    const body = await request.json()
    const { tenantId, tags = [] } = body
    
    // Validate required fields
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Missing required field: tenantId' },
        { status: 400 }
      )
    }
    
    // Validate tenantId format
    if (typeof tenantId !== 'string' || !tenantId.startsWith('org_')) {
      return NextResponse.json(
        { error: 'Invalid tenantId format' },
        { status: 400 }
      )
    }
    
    // Validate tags array
    if (!Array.isArray(tags)) {
      return NextResponse.json(
        { error: 'Tags must be an array' },
        { status: 400 }
      )
    }
    
    // Create the list of tags to revalidate
    const tagsToRevalidate = [
      TENANT_TAG(tenantId), // Primary tenant tag
      ...tags, // Additional custom tags
    ]
    
    // Remove duplicates
    const uniqueTags = [...new Set(tagsToRevalidate)]
    
    // Revalidate each tag
    const revalidationResults = []
    for (const tag of uniqueTags) {
      try {
        revalidateTag(tag)
        revalidationResults.push({ tag, status: 'success' })
        console.log(`✅ Revalidated tag: ${tag}`)
      } catch (error) {
        console.error(`❌ Failed to revalidate tag: ${tag}`, error)
        revalidationResults.push({ tag, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }
    
    // Check if any revalidations failed
    const failedRevalidations = revalidationResults.filter(result => result.status === 'error')
    
    if (failedRevalidations.length > 0) {
      console.error('Some revalidations failed:', failedRevalidations)
      return NextResponse.json(
        { 
          error: 'Some revalidations failed',
          details: failedRevalidations,
          successful: revalidationResults.filter(result => result.status === 'success').length,
          failed: failedRevalidations.length,
        },
        { status: 207 } // Multi-status
      )
    }
    
    // All revalidations successful
    console.log(`✅ Successfully revalidated ${revalidationResults.length} tags for tenant: ${tenantId}`)
    
    return new NextResponse(null, { status: 204 })
    
  } catch (error) {
    console.error('Revalidation error:', error)
    
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
