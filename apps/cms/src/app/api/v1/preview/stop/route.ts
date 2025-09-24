import { NextRequest, NextResponse } from 'next/server'
import { getValidatedTenantId } from '@/lib/tenant'

/**
 * POST /api/v1/preview/stop
 * 
 * Behavior:
 * - Clears the preview cookie to exit preview mode
 * - Returns 204 on success
 */
export async function POST(request: NextRequest) {
  try {
    // Resolve tenant ID and validate access
    const tenantId = await getValidatedTenantId()
    
    // Create response
    const response = new NextResponse(null, { status: 204 })
    
    // Clear the preview cookie by setting it with an expired date
    response.cookies.set('folio-preview', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    })
    
    return response
    
  } catch (error) {
    console.error('Preview stop error:', error)
    
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
