import { NextRequest, NextResponse } from 'next/server'
import { getTenantIdFromSiteId } from '@/lib/tenant'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 10 // 10 requests per window

/**
 * Verify Turnstile token with Cloudflare
 */
async function verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  
  if (!secret) {
    // If no Turnstile secret is configured, skip verification
    console.log('TURNSTILE_SECRET_KEY not configured, skipping verification')
    return true
  }
  
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: ip,
      }),
    })
    
    const result = await response.json()
    return result.success === true
  } catch (error) {
    console.error('Turnstile verification failed:', error)
    return false
  }
}

/**
 * Check rate limit for IP address
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    // No record or expired, create new one
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return true
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }
  
  // Increment count
  record.count++
  return true
}

/**
 * POST /api/v1/submissions
 * 
 * Headers:
 * - x-site-id: Site identifier for tenant resolution
 * - Content-Type: application/json or application/x-www-form-urlencoded
 * 
 * Body:
 * - form: string (form identifier)
 * - payload: object (form data)
 * - turnstileToken?: string (Cloudflare Turnstile token)
 * 
 * Behavior:
 * - CORS enabled for all origins
 * - Rate limiting by IP (10 requests per 15 minutes)
 * - Turnstile verification if TURNSTILE_* env vars exist
 * - Saves submission with tenantId resolved from siteId header
 */
export async function POST(request: NextRequest) {
  try {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-site-id',
          'Access-Control-Max-Age': '86400',
        },
      })
    }
    
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Retry-After': '900', // 15 minutes
          },
        }
      )
    }
    
    // Resolve tenant ID from siteId header
    const tenantId = await getTenantIdFromSiteId(request)
    
    // Parse request body
    const contentType = request.headers.get('content-type') || ''
    let body: any
    
    if (contentType.includes('application/json')) {
      body = await request.json()
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData()
      body = Object.fromEntries(formData.entries())
    } else {
      return NextResponse.json(
        { error: 'Content-Type must be application/json or application/x-www-form-urlencoded' },
        { 
          status: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
        }
      )
    }
    
    const { form, payload, turnstileToken } = body
    
    // Validate required fields
    if (!form || !payload) {
      return NextResponse.json(
        { error: 'Missing required fields: form, payload' },
        { 
          status: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
        }
      )
    }
    
    // Verify Turnstile token if provided
    if (turnstileToken) {
      const isValidTurnstile = await verifyTurnstileToken(turnstileToken, ip)
      if (!isValidTurnstile) {
        return NextResponse.json(
          { error: 'Invalid Turnstile token' },
          { 
            status: 400,
            headers: { 'Access-Control-Allow-Origin': '*' },
          }
        )
      }
    }
    
    // Get user agent
    const userAgent = request.headers.get('user-agent') || null
    
    // Save submission to database
    const submission = await prisma.submission.create({
      data: {
        tenantId,
        form: String(form),
        payload: typeof payload === 'string' ? JSON.parse(payload) : payload,
        ip,
        ua: userAgent,
      },
    })
    
    return NextResponse.json(
      { 
        success: true, 
        id: submission.id,
        message: 'Submission received successfully' 
      },
      { 
        status: 201,
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    )
    
  } catch (error) {
    console.error('Submissions API error:', error)
    
    if (error instanceof Error && error.message.includes('No tenant ID could be resolved')) {
      return NextResponse.json(
        { error: 'Invalid site configuration' },
        { 
          status: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
        }
      )
    }
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { 
          status: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
        }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    )
  }
}

/**
 * Handle OPTIONS requests for CORS
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-site-id',
      'Access-Control-Max-Age': '86400',
    },
  })
}
