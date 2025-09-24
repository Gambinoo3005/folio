import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Provisioning is only available in development' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    const { siteId } = body

    if (!siteId) {
      return NextResponse.json(
        { error: 'Missing required field: siteId' },
        { status: 400 }
      )
    }

    if (typeof siteId !== 'string') {
      return NextResponse.json(
        { error: 'siteId must be a string' },
        { status: 400 }
      )
    }

    // Update .env.local file
    const envPath = join(process.cwd(), '.env.local')
    let envContent = ''

    // Read existing .env.local if it exists
    if (existsSync(envPath)) {
      envContent = readFileSync(envPath, 'utf8')
    }

    // Parse existing environment variables
    const envLines = envContent.split('\n')
    const envVars: Record<string, string> = {}

    envLines.forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          envVars[key] = valueParts.join('=')
        }
      }
    })

    // Update SITE_ID
    envVars['SITE_ID'] = siteId

    // Ensure other required variables exist
    if (!envVars['NEXT_PUBLIC_API_BASE']) {
      envVars['NEXT_PUBLIC_API_BASE'] = 'http://localhost:3001'
    }
    if (!envVars['NEXT_PUBLIC_CDN_BASE']) {
      envVars['NEXT_PUBLIC_CDN_BASE'] = 'https://cdn.folio.com'
    }

    // Write updated .env.local
    const newEnvContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')

    writeFileSync(envPath, newEnvContent)

    return NextResponse.json({
      success: true,
      message: 'Site ID updated successfully',
      siteId,
      envPath,
      note: 'Restart the development server for changes to take effect',
    })

  } catch (error) {
    console.error('Provisioning error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Provisioning is only available in development' },
      { status: 403 }
    )
  }

  try {
    const currentSiteId = process.env.SITE_ID || 'Not set'
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'Not set'
    const cdnBase = process.env.NEXT_PUBLIC_CDN_BASE || 'Not set'

    return NextResponse.json({
      current: {
        siteId: currentSiteId,
        apiBase,
        cdnBase,
      },
      usage: {
        method: 'POST',
        endpoint: '/api/provision',
        body: { siteId: 'your-site-id' },
        description: 'Update the SITE_ID for this client site',
      },
    })

  } catch (error) {
    console.error('Provisioning status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
