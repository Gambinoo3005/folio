import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    // Validate webhook secret
    const secret = request.headers.get('x-folio-revalidate-secret')
    const expectedSecret = process.env.FOLIO_REVALIDATE_SECRET
    
    if (!expectedSecret) {
      console.error('FOLIO_REVALIDATE_SECRET not configured')
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
      `tenant:${tenantId}`, // Primary tenant tag
      ...tags, // Additional custom tags
    ]
    
    // Remove duplicates
    const uniqueTags = [...new Set(tagsToRevalidate)]
    
    // Revalidate each tag
    for (const tag of uniqueTags) {
      try {
        revalidateTag(tag)
        console.log(`Revalidated tag: ${tag}`)
      } catch (error) {
        console.error(`Failed to revalidate tag ${tag}:`, error)
      }
    }
    
    return NextResponse.json({
      success: true,
      revalidated: uniqueTags,
      timestamp: new Date().toISOString(),
    })
    
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
