# CMS Setup Hand-off Notes

## Current Status: Phase 7 Complete ✅
The CMS shell is fully functional with:
- ✅ Complete UI shell (layout, navigation, theming)
- ✅ Authentication & route guards
- ✅ Dashboard with placeholder data
- ✅ Rich editor shell (no schema yet)
- ✅ Media library UI
- ✅ Settings & plan summary UI
- ✅ Loading/empty/error states & toasts
- ✅ Quality gates (lint, typecheck, tests)

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
- Schema to be authored by AI tasks later
- **TODO**: Run `prisma migrate dev` when schema is ready

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

## Next Steps for Schema/API Integration
1. **Database Schema**: Define Prisma schema based on UI contracts
2. **API Routes**: Create Next.js API routes for CRUD operations
3. **Replace Stubs**: Update adapters to use real API calls
4. **Authentication**: Wire up Clerk user context with database
5. **File Uploads**: Integrate with Cloudflare R2 or similar
6. **Publishing**: Implement publish/schedule logic
7. **Webhooks**: Set up cache invalidation webhooks
