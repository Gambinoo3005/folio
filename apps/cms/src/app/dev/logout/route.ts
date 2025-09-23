import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { validateDevAutoLogin } from '@/lib/dev-utils';

export async function GET(request: NextRequest) {
  // Guard: Check if dev auto-login is enabled and conditions are met
  if (!validateDevAutoLogin(request)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    // Get the current session
    const { sessionId } = await auth();
    
    if (sessionId) {
      // Initialize the Clerk client and sign out the session
      const client = await clerkClient();
      await client.sessions.revokeSession(sessionId);
    }

    // Redirect to sign-in page
    return NextResponse.redirect(new URL('/sign-in', request.url));
  } catch (error) {
    console.error('Error in dev logout route:', error);
    // Even if there's an error, redirect to sign-in
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}
