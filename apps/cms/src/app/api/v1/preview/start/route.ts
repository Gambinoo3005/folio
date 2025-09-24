import { NextRequest, NextResponse } from 'next/server'
import { getValidatedTenantId } from '@/lib/tenant'
import { SignJWT } from 'jose'

/**
 * POST /api/v1/preview/start
 * 
 * Body: { token: string, target: "page" | "item", id: string }
 * 
 * Behavior:
 * - Validates the request body
 * - Sets a signed cookie enabling preview for this tenant
 * - Returns 204 on success
 */
export async function POST(request: NextRequest) {
  try {
    // Resolve tenant ID and validate access
    const tenantId = await getValidatedTenantId()
    
    // Parse request body
    const body = await request.json()
    const { token, target, id } = body
    
    // Validate required fields
    if (!token || !target || !id) {
      return NextResponse.json(
        { error: 'Missing required fields: token, target, id' },
        { status: 400 }
      )
    }
    
    // Validate target type
    if (!['page', 'item'].includes(target)) {
      return NextResponse.json(
        { error: 'Invalid target. Must be "page" or "item"' },
        { status: 400 }
      )
    }
    
    // For V1, we accept any token (future will verify against actual tokens)
    // Create preview payload
    const previewPayload = {
      tenantId,
      target,
      id,
      token,
      timestamp: Date.now(),
    }
    
    // Get the preview cookie secret
    const secret = process.env.PREVIEW_COOKIE_SECRET
    if (!secret) {
      console.error('PREVIEW_COOKIE_SECRET not configured')
      return NextResponse.json(
        { error: 'Preview mode not configured' },
        { status: 500 }
      )
    }
    
    // Create signed JWT token
    const jwt = await new SignJWT(previewPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h') // Preview mode expires in 1 hour
      .sign(new TextEncoder().encode(secret))
    
    // Create response with signed cookie
    const response = new NextResponse(null, { status: 204 })
    
    // Set the preview cookie
    response.cookies.set('folio-preview', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
      path: '/',
    })
    
    return response
    
  } catch (error) {
    console.error('Preview start error:', error)
    
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
