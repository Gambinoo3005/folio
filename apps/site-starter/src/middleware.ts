import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getClient } from '@portfolio-building-service/site-core';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host');

  // Skip middleware for API routes, Next.js assets, and health checks
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/.well-known/')
  ) {
    return NextResponse.next();
  }

  const client = getClient({
    apiBase: process.env.NEXT_PUBLIC_API_BASE!,
    siteId: process.env.SITE_ID!,
  });

  try {
    // This is a placeholder for getting the primary domain.
    // In a real implementation, you might fetch this from an API endpoint
    // that you expose from your CMS, which in turn reads from the `Domain` table.
    // For now, we'll assume an environment variable holds the primary domain.
    const primaryDomain = process.env.PRIMARY_DOMAIN;

    if (primaryDomain && host && host !== primaryDomain) {
      const newUrl = new URL(pathname, `https://${primaryDomain}`);
      return NextResponse.redirect(newUrl, 301);
    }
  } catch (error) {
    console.error('Error in middleware while fetching primary domain:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
