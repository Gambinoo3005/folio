# CMS Setup Hand-off Notes

## Current Status: Phase 10 Complete ✅
The CMS is fully functional with complete content management capabilities:
- ✅ Complete UI shell (layout, navigation, theming)
- ✅ Authentication & route guards with Clerk
- ✅ Dashboard with real-time data from database
- ✅ Full CRUD operations for Pages, Collections, Items, and Globals
- ✅ Rich content editor with live preview
- ✅ Media library with Cloudflare R2 integration
- ✅ Submissions endpoint for contact forms
- ✅ Domain management with re-check functionality
- ✅ Role-based access control (RBAC)
- ✅ Cache revalidation system
- ✅ Quality gates (lint, typecheck, tests)
- ✅ Error logging (Sentry in prod, console in dev)

## Visual Parity
- CMS inherits tailwind/postcss/globals.css/fonts from marketing
- Any design tokens will move to packages/site-core later
- Both apps use Tailwind v4 with CSS-based configuration
- shadcn/ui configured with "new-york" style matching marketing

## Port Configuration
- Dev runs on port 3001 by default
- Scripts configured: `dev`, `build`, `start` all use port 3001
- Marketing runs on port 3000, CMS on port 3001

## Authentication
- Clerk installed and configured
- Allowed origin must include http://localhost:3001 in Clerk dashboard
- **TODO**: Add http://localhost:3001 to Clerk dashboard allowed origins

## Database
- Prisma initialized with PostgreSQL provider
- DATABASE_URL present in .env.local (placeholder)
- Complete schema implemented with all content types
- **Migration**: Run `prisma migrate dev` to apply schema
- **Seed**: Run `prisma db seed` to populate with sample data

## Platform Services
- inngest/resend/sentry installed but not configured
- Environment variables are placeholders
- **TODO**: Configure these services when business logic is implemented

## Environment Workflow
- .env.local created with placeholder values
- **TODO**: Replace with actual values from Doppler using:
  ```bash
  doppler secrets download --project folio-platform --config dev --no-file --format=env > .env.local
  ```
- Regenerate files if secrets change

## CMS Shell Structure

### Layout Components
- `src/components/cms-layout.tsx` - Main CMS layout wrapper
- `src/components/sidebar.tsx` - Left navigation sidebar
- `src/components/topbar.tsx` - Top navigation bar
- `src/components/theme-provider.tsx` - Theme context provider

### Dashboard Components
- `src/components/dashboard/dashboard-with-states.tsx` - Main dashboard with loading/error states
- `src/components/dashboard/quick-actions-section.tsx` - Quick action buttons
- `src/components/dashboard/recent-edits-section.tsx` - Recent content edits
- `src/components/dashboard/usage-section.tsx` - Usage statistics
- `src/components/dashboard/publishing-status-section.tsx` - Publishing status

### Editor Components
- `src/components/editor/editor-layout.tsx` - Main editor layout
- `src/components/editor/content-editor-form.tsx` - Rich text content form
- `src/components/editor/content-tab.tsx` - Content editing tab
- `src/components/editor/media-tab.tsx` - Media management tab
- `src/components/editor/seo-tab.tsx` - SEO settings tab
- `src/components/editor/settings-tab.tsx` - Content settings tab
- `src/components/editor/preview-panel.tsx` - Live preview panel

### Media Components
- `src/components/media/media-with-states.tsx` - Media library with states
- `src/components/media/media-grid.tsx` - Media grid display
- `src/components/media/media-filters.tsx` - Media filtering
- `src/components/media/upload-modal.tsx` - File upload modal
- `src/components/media/media-detail-drawer.tsx` - Media details drawer
- `src/components/media/focal-point-editor.tsx` - Image focal point editor

### State Management
- `src/components/loading-wrapper.tsx` - Loading state wrapper
- `src/components/ui/empty-states.tsx` - Empty state components
- `src/lib/adapters/dashboard-adapters.ts` - Stub data adapters

### Testing
- `tests/smoke.spec.ts` - Basic smoke tests
- `tests/accessibility.spec.ts` - Accessibility tests with axe-core
- `playwright.config.ts` - Playwright configuration

## Stub Adapters Location
All stub data adapters are in `src/lib/adapters/dashboard-adapters.ts`. These provide:
- Mock dashboard data
- Mock collections data
- Mock media data
- Mock analytics data

**Next Phase**: Replace these with real Prisma/API calls.

## Quality Gates
- ✅ `pnpm lint` - ESLint with Next.js rules
- ✅ `pnpm typecheck` - TypeScript compilation check
- ✅ `pnpm test` - Playwright smoke tests
- ✅ Accessibility tests with axe-core

## Dependencies Installed
- UI/theming: tailwindcss@4.1.9, next-themes, framer-motion, lucide-react
- Headless primitives: @radix-ui packages (including react-select)
- Forms/validation: react-hook-form, zod, @hookform/resolvers
- Platform services: @clerk/nextjs, inngest, resend, @sentry/nextjs
- DX utilities: clsx, tailwind-merge
- Data layer: @prisma/client, prisma
- Testing: @playwright/test, @axe-core/playwright

## File Structure
```
apps/cms/
├── src/
│   ├── app/
│   │   ├── (auth)/ - Authentication pages
│   │   ├── (dashboard)/ - Protected dashboard pages
│   │   ├── dev/ - Development utilities
│   │   ├── globals.css (copied from marketing)
│   │   └── layout.tsx
│   ├── components/
│   │   ├── auth-*.tsx - Authentication components
│   │   ├── dashboard/ - Dashboard components
│   │   ├── editor/ - Content editor components
│   │   ├── media/ - Media management components
│   │   ├── ui/ - shadcn/ui components
│   │   └── *.tsx - Layout components
│   ├── hooks/ - Custom React hooks
│   └── lib/
│       ├── adapters/ - Stub data adapters
│       └── *.ts - Utilities
├── tests/ - Playwright tests
├── prisma/
│   └── schema.prisma
├── components.json (shadcn config)
├── postcss.config.mjs (copied from marketing)
├── playwright.config.ts
├── .env.local (placeholder values)
└── package.json (configured for port 3001)
```

## CRUD Endpoints & Actions

### API Routes
- `GET/POST /api/v1/pages` - Pages management
- `GET/POST /api/v1/collections` - Collections management
- `GET/POST /api/v1/collections/[slug]/items` - Collection items
- `GET/POST /api/v1/globals/[key]` - Global settings
- `GET/POST /api/v1/media` - Media management
- `POST /api/v1/media/upload-url` - Direct upload URLs
- `POST /api/v1/media/commit` - Commit uploaded media
- `POST /api/v1/submissions` - Contact form submissions
- `POST /api/v1/domains/check` - Domain verification
- `POST /api/v1/revalidate` - Cache revalidation

### Server Actions
- `src/lib/actions/pages.ts` - Page CRUD operations
- `src/lib/actions/collections.ts` - Collection CRUD operations
- `src/lib/actions/submissions.ts` - Submission management
- All actions include RBAC permission checks

## Preview Flow

### Preview Mode
- **Start Preview**: `POST /api/v1/preview/start` with target and ID
- **Stop Preview**: `POST /api/v1/preview/stop`
- **Preview Cookie**: Signed JWT with 1-hour expiration
- **Usage**: Set preview cookie to enable draft content viewing

### Implementation
```typescript
// Start preview mode
const response = await fetch('/api/v1/preview/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: 'preview-token',
    target: 'page', // or 'item'
    id: 'page-id'
  })
})

// Preview mode is automatically detected in pages
const preview = await getPreviewMode()
if (preview) {
  // Show draft content
}
```

## Media Upload Steps (Direct Upload)

### 1. Request Upload URL
```typescript
const response = await fetch('/api/v1/media/upload-url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    filename: 'image.jpg',
    mimeType: 'image/jpeg',
    size: 1024000
  })
})
const { uploadUrl, mediaId } = await response.json()
```

### 2. Upload to Cloudflare R2
```typescript
const uploadResponse = await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type }
})
```

### 3. Commit Upload
```typescript
await fetch('/api/v1/media/commit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mediaId,
    alt: 'Image description',
    focalX: 0.5,
    focalY: 0.5
  })
})
```

## RBAC Expectations

### Role Hierarchy
- **OWNER**: Full access to all features and settings
- **ADMIN**: Administrative access to most features
- **EDITOR**: Can create and edit content (write operations)
- **VIEWER**: Read-only access to content

### Permission Enforcement
```typescript
// Require write permission (EDITOR+)
await requireWritePermission()

// Require admin permission (ADMIN+)
await requireAdminPermission()

// Require owner permission (OWNER only)
await requireOwnerPermission()
```

### Role Resolution
- Roles are resolved from Clerk organization membership
- Membership table is hydrated lazily on login
- Fallback to DEV_TENANT_ID in development

## Revalidation Usage

### Cache Tags
- Tenant-specific tags: `tenant:${tenantId}`
- Custom tags for specific content types
- Automatic revalidation on content updates

### Webhook Endpoint
```typescript
// Revalidate cache
const response = await fetch('/api/v1/revalidate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-folio-revalidate-secret': process.env.REVALIDATE_WEBHOOK_SECRET
  },
  body: JSON.stringify({
    tenantId: 'org_123',
    tags: ['custom-tag']
  })
})
```

### Usage in Server Actions
```typescript
import { revalidateTag } from 'next/cache'
import { TENANT_TAG } from '@/lib/tenant'

// After updating content
revalidateTag(TENANT_TAG(tenantId))
```

## Submissions System

### Public Endpoint
- **URL**: `POST /api/v1/submissions`
- **CORS**: Enabled for all origins
- **Rate Limiting**: 10 requests per 15 minutes per IP
- **Turnstile**: Optional verification if configured

### Usage
```typescript
const response = await fetch('/api/v1/submissions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-site-id': 'tenant-id'
  },
  body: JSON.stringify({
    form: 'contact',
    payload: {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello world'
    },
    turnstileToken: 'optional-turnstile-token'
  })
})
```

### Management
- View submissions in `/submissions` dashboard
- Filter by form type and date range
- Export and delete submissions
- RBAC-protected management interface

## Domain Management

### Domain Check Endpoint
- **URL**: `POST /api/v1/domains/check`
- **Purpose**: Verify DNS records and SSL status
- **Response**: Mock data with configurable statuses

### Re-check Functionality
- Individual domain re-check buttons
- Bulk re-check all domains
- Loading states and progress indicators
- Real-time status updates

## Error Logging

### Production (Sentry)
- Errors logged to Sentry with context
- User and tenant information included
- Stack traces and metadata captured

### Development (Console)
- `console.warn` for errors
- `console.info` for warnings
- Detailed context and timestamps

### Usage
```typescript
import { logError, logWarning } from '@/lib/error-logging'

try {
  // Some operation
} catch (error) {
  logError(error, {
    userId: 'user_123',
    tenantId: 'org_456',
    action: 'create-page'
  })
}
```

## Testing

### Playwright Tests
- **Smoke Tests**: `tests/smoke.spec.ts` - Basic functionality
- **Workflow Tests**: `tests/workflow-smoke.spec.ts` - End-to-end workflows
- **Accessibility Tests**: `tests/accessibility.spec.ts` - A11y compliance

### Test Coverage
- Page creation and publishing workflow
- Media upload and metadata management
- Collection item creation
- Submissions endpoint testing
- RBAC permission testing
- Domain re-check functionality

### Running Tests
```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test tests/workflow-smoke.spec.ts

# Run with UI
pnpm test --ui
```

## Development Workflow

### Getting Started
1. **Environment Setup**: Copy `.env.local` and configure secrets
2. **Database**: Run `prisma migrate dev` and `prisma db seed`
3. **Development**: Run `pnpm dev` (starts on port 3001)
4. **Testing**: Run `pnpm test` for Playwright tests

### Quality Gates
- **Linting**: `pnpm lint` - ESLint with Next.js rules
- **Type Checking**: `pnpm typecheck` - TypeScript compilation
- **Testing**: `pnpm test` - Playwright end-to-end tests

### Deployment
- **Build**: `pnpm build` - Production build
- **Start**: `pnpm start` - Production server
- **Environment**: Configure production secrets in deployment platform
