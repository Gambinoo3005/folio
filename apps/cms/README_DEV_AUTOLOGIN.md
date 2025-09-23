# Dev Auto-Login Setup Guide

This document outlines the development auto-login system for the CMS application.

## Overview

The dev auto-login system allows developers to automatically sign in to the CMS during development without manual authentication. This feature is **only available in development mode** and is controlled by environment variables.

## Environment Variables

Create a `.env.local` file in `apps/cms/` with the following variables:

```bash
# Dev Auto-login Configuration
DEV_AUTOSIGNIN=true
DEV_EMAIL=dev@folio.local
DEV_ORG_NAME=Dev Org (Folio)
APP_HOST_DEV=localhost:3001

# Clerk Authentication (get from Doppler)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here

# Database (get from Doppler)
DATABASE_URL="postgresql://user:password@localhost:5432/folio_cms_dev"

# Other services (get from Doppler)
INNGEST_EVENT_KEY=your_inngest_key_here
INNGEST_SIGNING_KEY=your_inngest_signing_key_here
RESEND_API_KEY=your_resend_key_here
SENTRY_DSN=your_sentry_dsn_here
```

## Safety Rules

The dev auto-login feature is only enabled when **ALL** of the following conditions are met:

1. `process.env.NODE_ENV !== 'production'`
2. `process.env.DEV_AUTOSIGNIN === 'true'`
3. Request host exactly matches `process.env.APP_HOST_DEV`

If any rule fails, the system behaves normally (requires manual authentication).

## How It Works

### Automatic Redirect
- When visiting any protected route while signed out, the middleware checks if dev auto-login should be triggered
- If conditions are met, the user is redirected to `/dev/ensure`
- The `/dev/ensure` route creates or finds the dev user and organization, then signs them in

### Manual Trigger
- A "Sign in as Dev" button appears on the sign-in page in development mode
- Clicking this button manually triggers the dev auto-login process

### Dev Session Banner
- When signed in via dev auto-login, an orange "DEV SESSION" banner appears at the top
- The banner shows the dev email and organization name
- Includes a "Dev Logout" link to clear the session

## Routes

### `/dev/ensure` (GET)
- **Purpose**: Bootstrap dev user and organization, then sign in
- **Behavior**: 
  - Creates or finds user by `DEV_EMAIL`
  - Creates or finds organization by `DEV_ORG_NAME`
  - Ensures user is admin of the organization
  - Creates sign-in token and redirects to Clerk's ticket flow
- **Guards**: Only works when all safety rules are met

### `/dev/logout` (GET)
- **Purpose**: Sign out the current dev session
- **Behavior**: Clears the current session and redirects to `/sign-in`
- **Guards**: Only works when all safety rules are met

## Public Routes

These routes bypass authentication and dev auto-login:
- `/sign-in`
- `/sign-up`
- `/_next/*` (Next.js static assets)
- `/favicon.ico`
- `/*.png`, `/*.svg`, `/*.jpg`, `/*.webp` (image files)
- `/robots.txt`
- `/sitemap.xml`
- `/api/webhooks/clerk`
- `/api/webhooks/stripe`
- `/dev/ensure`
- `/dev/logout`

## Clerk Dashboard Configuration

Ensure your Clerk dashboard has the following settings:

### Development Settings
- **Allowed Origin**: `http://localhost:3001`
- **Authorized Redirect URLs**:
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

## Testing the System

1. **Start the development server**:
   ```bash
   cd apps/cms
   pnpm dev
   ```

2. **Test automatic redirect**:
   - Open incognito window
   - Visit `http://localhost:3001/`
   - Should automatically redirect and sign in as dev user

3. **Test manual trigger**:
   - Visit `http://localhost:3001/sign-in`
   - Click "Sign in as Dev" button
   - Should sign in as dev user

4. **Test dev logout**:
   - Click "Dev Logout" in the banner
   - Should clear session and redirect to sign-in

5. **Test disabling**:
   - Set `DEV_AUTOSIGNIN=false` in `.env.local`
   - Restart dev server
   - Visit `http://localhost:3001/` should show normal sign-in flow

## Troubleshooting

### Auto-login not working
- Check that all environment variables are set correctly
- Verify `DEV_AUTOSIGNIN=true`
- Ensure you're accessing `http://localhost:3001` (not other ports)
- Check browser console for errors

### Clerk errors
- Verify Clerk environment variables are set
- Check Clerk dashboard configuration
- Ensure allowed origins include `http://localhost:3001`

### Dev banner not showing
- Verify you're signed in via dev auto-login
- Check that `NODE_ENV` is not `production`
- Ensure `DEV_AUTOSIGNIN=true`

## Security Notes

- This feature is **completely disabled in production**
- Never commit `.env.local` files
- The dev user and organization are created automatically
- All dev routes return 404 when safety rules are not met
- The system gracefully falls back to normal authentication when disabled
