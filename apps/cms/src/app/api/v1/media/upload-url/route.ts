import { NextRequest, NextResponse } from 'next/server'
import { getValidatedTenantId } from '@/lib/tenant'
import { createSignedUploadUrl, validateFileUpload, sanitizeFilename } from '@/server/media'

/**
 * POST /api/v1/media/upload-url
 * 
 * Body: { kind: 'image' | 'file', filename: string, mime: string, size: number }
 * 
 * Returns: { url: string, fields?: object, expiresIn: number, key: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Resolve tenant ID and validate access
    const tenantId = await getValidatedTenantId()
    
    // Parse request body
    const body = await request.json()
    const { kind, filename, mime, size } = body
    
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
    
    // Validate file upload
    const validation = validateFileUpload(filename, mime, size)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }
    
    // Sanitize filename
    const sanitizedFilename = sanitizeFilename(filename)
    
    // Create signed upload URL
    const uploadUrl = await createSignedUploadUrl(kind, sanitizedFilename, mime)
    
    return NextResponse.json({
      success: true,
      data: uploadUrl,
    })
    
  } catch (error) {
    console.error('Upload URL generation error:', error)
    
    if (error instanceof Error && error.message.includes('No tenant ID could be resolved')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    if (error instanceof Error && error.message.includes('credentials not configured')) {
      return NextResponse.json(
        { error: 'Media service not configured' },
        { status: 500 }
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
