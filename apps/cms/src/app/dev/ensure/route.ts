import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { validateDevAutoLogin, getDevConfig } from '@/lib/dev-utils';

export async function GET(request: NextRequest) {
  // Guard: Check if dev auto-login is enabled and conditions are met
  if (!validateDevAutoLogin(request)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const config = getDevConfig();
  if (!config) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Check if Clerk keys are properly configured
  if (!process.env.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY === 'sk_test_placeholder' || process.env.CLERK_SECRET_KEY === '__set_me__') {
    return new NextResponse(
      `Dev auto-login requires proper Clerk configuration. Please set up your Clerk keys in .env.local:
      
Current CLERK_SECRET_KEY: ${process.env.CLERK_SECRET_KEY || 'not set'}

To fix this:
1. Get your Clerk keys from the Clerk dashboard
2. Update .env.local with real values:
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_real_key
   CLERK_SECRET_KEY=sk_test_your_real_secret
3. Restart the dev server

Or use Doppler:
   doppler secrets download --project folio-platform --config dev --no-file --format=env > .env.local`,
      { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      }
    );
  }

  try {
    // Initialize the Clerk client
    const client = await clerkClient();

    // Find or create the dev user
    let user;
    try {
      const existingUsers = await client.users.getUserList({
        emailAddress: [config.devEmail],
      });
      
      if (existingUsers.data.length > 0) {
        user = existingUsers.data[0];
        console.log('Found existing dev user:', user.id);
      } else {
        // Create new user with minimal required fields
        try {
          user = await client.users.createUser({
            emailAddress: [config.devEmail],
            firstName: 'Dev',
            lastName: 'User',
          });
          console.log('Created new dev user:', user.id);
        } catch (createError: any) {
          console.error('Error creating dev user:', createError);
          
          // If user creation fails, try to find by email again (in case it was created between calls)
          const retryUsers = await client.users.getUserList({
            emailAddress: [config.devEmail],
          });
          
          if (retryUsers.data.length > 0) {
            user = retryUsers.data[0];
            console.log('Found dev user on retry:', user.id);
          } else {
            // Return detailed error information
            return new NextResponse(
              `Failed to create dev user. Error: ${createError.message || 'Unknown error'}
              
Details:
- Email: ${config.devEmail}
- Error: ${JSON.stringify(createError.errors || {}, null, 2)}

This might be because:
1. The user already exists but with different email format
2. Clerk configuration issues
3. Email domain restrictions

Try checking your Clerk dashboard for existing users.`,
              { 
                status: 500,
                headers: { 'Content-Type': 'text/plain' }
              }
            );
          }
        }
      }
    } catch (error: any) {
      console.error('Error finding/creating dev user:', error);
      return new NextResponse(
        `Error with dev user setup: ${error.message || 'Unknown error'}`,
        { 
          status: 500,
          headers: { 'Content-Type': 'text/plain' }
        }
      );
    }

    // Find or create the dev organization
    let organization;
    try {
      const existingOrgs = await client.organizations.getOrganizationList();
      
      // Find organization by name
      const existingOrg = existingOrgs.data.find(org => org.name === config.devOrgName);
      
      if (existingOrg) {
        organization = existingOrg;
      } else {
        // Create new organization
        organization = await client.organizations.createOrganization({
          name: config.devOrgName,
          createdBy: user.id,
        });
      }
    } catch (error) {
      console.error('Error finding/creating dev organization:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }

    // Ensure user is a member of the organization (as owner/admin)
    try {
      const memberships = await client.organizations.getOrganizationMembershipList({
        organizationId: organization.id,
        userId: [user.id],
      });
      
      if (memberships.data.length === 0) {
        // Add user as admin to the organization
        await client.organizations.createOrganizationMembership({
          organizationId: organization.id,
          userId: user.id,
          role: 'admin',
        });
      }
    } catch (error) {
      console.error('Error ensuring organization membership:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }

    // For dev auto-login, redirect directly to the dev ticket handler
    // The ticket handler will find the user and create a session
    const redirectUrl = new URL('/dev/ticket', request.url);
    redirectUrl.searchParams.set('token', 'dev-auto-login');
    
    console.log('Redirecting to dev ticket handler for auto-login');
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Unexpected error in dev ensure route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
