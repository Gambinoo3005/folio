# Clerk Authentication Setup

This document outlines the Clerk authentication integration for the CMS application.

## Overview

The CMS is now protected with Clerk authentication, requiring users to sign in before accessing any protected routes.

## Implementation Details

### ClerkProvider Integration

- **Location**: `apps/cms/src/app/layout.tsx`
- **Purpose**: Wraps the entire application with Clerk's authentication context
- **Implementation**: The `ClerkProvider` component wraps the HTML structure while preserving existing fonts, styles, and metadata

### Authentication Routes

#### Sign In Page
- **Path**: `/sign-in`
- **File**: `apps/cms/src/app/sign-in/page.tsx`
- **Features**: 
  - Google OAuth
  - GitHub OAuth  
  - Email code verification
  - On-brand styling matching CMS theme

#### Sign Up Page
- **Path**: `/sign-up`
- **File**: `apps/cms/src/app/sign-up/page.tsx`
- **Features**:
  - Google OAuth
  - GitHub OAuth
  - Email code verification
  - On-brand styling matching CMS theme

### Route Protection

- **Middleware**: `apps/cms/middleware.ts`
- **Behavior**: All routes require authentication by default
- **Public Routes** (no authentication required):
  - `/sign-in`
  - `/sign-up`
  - `/_next/*` (Next.js static assets)
  - `/favicon.ico`
  - `/robots.txt`
  - `/sitemap.xml`
  - `/api/webhooks/clerk`
  - `/api/webhooks/stripe`

### Authentication Methods

The following authentication methods are enabled:
- **Google OAuth**: Social login via Google
- **GitHub OAuth**: Social login via GitHub
- **Email Code**: Email verification with one-time codes

**Disabled Methods**:
- Password authentication
- Magic link authentication

## Environment Variables

Required environment variables for development:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Clerk Dashboard Configuration

### Development Settings

**Allowed Origin**:
- `http://localhost:3001`

**Authorized Redirect URLs**:
- `http://localhost:3001/sign-in`
- `http://localhost:3001/sign-up`

### Authentication Methods
- ✅ Google OAuth
- ✅ GitHub OAuth
- ✅ Email code verification
- ❌ Password authentication
- ❌ Magic link authentication

### Organizations
- ✅ Enabled

## Styling and Appearance

The Clerk components are styled to match the CMS theme using:

- **CSS Variables**: Leverages existing CSS custom properties for colors
- **Tailwind Classes**: Uses consistent spacing and typography
- **Theme Integration**: Matches the application's design system

### Customization

To modify the appearance of Clerk components:

1. **Via Appearance Props**: Update the `appearance` prop in sign-in/sign-up pages
2. **Via CSS Variables**: Modify the CSS custom properties in `globals.css`
3. **Via Clerk Dashboard**: Use Clerk's appearance customization in the dashboard

## Development Workflow

### Starting the Development Server

```bash
cd apps/cms
pnpm dev
```

The application will be available at `http://localhost:3001`

### Testing Authentication

1. **Route Protection**: Visit `http://localhost:3001/` while signed out → should redirect to `/sign-in`
2. **Email Sign-in**: Use a non-Google email → receive verification code → complete sign-in
3. **Social Sign-in**: Test Google and GitHub OAuth flows
4. **Account Linking**: Clerk automatically links accounts with the same email address

### Public Route Testing

- `/sign-in` and `/sign-up` should be accessible without authentication
- Static assets (`/_next/*`, `/favicon.ico`) should load without redirects
- Webhook endpoints (`/api/webhooks/*`) should be accessible without authentication

## Troubleshooting

### Common Issues

1. **Infinite Redirect Loops**: Check that public routes are properly configured in middleware
2. **Styling Issues**: Verify CSS variables are properly defined in `globals.css`
3. **Environment Variables**: Ensure all required Clerk environment variables are set
4. **Clerk Dashboard**: Verify allowed origins and redirect URLs match your development setup

### Debug Mode

To enable Clerk debug mode, add to your environment variables:
```bash
NEXT_PUBLIC_CLERK_DEBUG=true
```

## Security Considerations

- All routes are protected by default
- Webhook endpoints are explicitly made public for external services
- Static assets bypass authentication for performance
- Clerk handles secure session management and token validation

## Next Steps

1. Configure production environment variables
2. Update Clerk dashboard with production URLs
3. Test authentication flows in staging environment
4. Implement user role-based access control if needed
5. Add user profile management features
