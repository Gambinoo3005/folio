import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { validateDevAutoLogin, getDevConfig } from '@/lib/dev-utils';

export async function GET(request: NextRequest) {
  // Guard: Check if dev auto-login is enabled and conditions are met
  if (!validateDevAutoLogin(request)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const token = request.nextUrl.searchParams.get('token');
  
  if (!token) {
    return new NextResponse('Missing token', { status: 400 });
  }

  try {
    // Initialize the Clerk client
    const client = await clerkClient();
    const config = getDevConfig();
    
    if (!config) {
      return new NextResponse('Dev config not found', { status: 500 });
    }

    // Find the dev user by email
    const users = await client.users.getUserList({
      emailAddress: [config.devEmail],
    });
    
    if (users.data.length === 0) {
      return new NextResponse('Dev user not found', { status: 404 });
    }
    
    const user = users.data[0];
    console.log('Found dev user:', user.id);

    // Create a session for the user
    const session = await client.sessions.createSession({
      userId: user.id,
    });

    console.log('Created session:', session.id);

    // Create response with redirect
    const response = NextResponse.redirect(new URL('/', request.url));
    
    // Set the session cookie using Clerk's expected format
    // Try multiple possible cookie names that Clerk might use
    const cookieNames = ['__clerk_session_jwt', '__session', 'clerk-session'];
    
    for (const cookieName of cookieNames) {
      response.cookies.set(cookieName, session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Error processing dev sign-in:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
