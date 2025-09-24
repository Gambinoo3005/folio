import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, target } = body

    if (!slug || !target) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, target' },
        { status: 400 }
      )
    }

    if (!['page', 'item'].includes(target)) {
      return NextResponse.json(
        { error: 'Invalid target. Must be "page" or "item"' },
        { status: 400 }
      )
    }

    const siteId = process.env.SITE_ID
    if (!siteId) {
      return NextResponse.json(
        { error: 'SITE_ID not configured' },
        { status: 500 }
      )
    }

    // Forward to CMS preview start endpoint
    const cmsApiBase = process.env.NEXT_PUBLIC_API_BASE
    if (!cmsApiBase) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_API_BASE not configured' },
        { status: 500 }
      )
    }

    const cmsResponse = await fetch(`${cmsApiBase}/api/v1/preview/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-folio-site-id': siteId,
      },
      body: JSON.stringify({
        siteId,
        slug,
        target,
      }),
    })

    if (!cmsResponse.ok) {
      const errorText = await cmsResponse.text()
      return NextResponse.json(
        { error: `CMS preview start failed: ${errorText}` },
        { status: cmsResponse.status }
      )
    }

    const cmsData = await cmsResponse.json()

    // Create site-side preview cookie
    const secret = process.env.PREVIEW_COOKIE_SECRET || 'dev-secret-key'
    const token = await new SignJWT({
      siteId,
      slug,
      target,
      timestamp: Date.now(),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(secret))

    const response = NextResponse.json({
      success: true,
      previewUrl: `/preview/${target}/${slug}`,
      cmsData,
    })

    // Set preview cookie
    response.cookies.set('folio-preview', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Preview start error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
