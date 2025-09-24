# Preview Mode Implementation Guide

## Overview

Phase 4 of the CMS implementation adds end-to-end preview mode functionality that allows users to preview draft content before publishing.

## Features Implemented

### 1. API Routes

- **POST /api/v1/preview/start** - Sets a signed cookie for preview mode
  - Accepts: `{ target, id, slug }`
  - Creates a JWT token with preview information
  - Sets `folio-preview` cookie

- **POST /api/v1/preview/stop** - Clears the preview cookie
  - Removes preview mode

### 2. Helper Functions

- **`isPreview()`** - Simple helper to check if preview mode is active
- **`getPreviewMode()`** - Gets detailed preview information
- **`isPreviewModeFor(target, id)`** - Checks if preview is active for specific content

### 3. UI Components

- **PreviewButton** - Button to start/stop preview mode
- **PreviewIndicator** - Shows "PREVIEW ACTIVE" pill when preview is on
- **Preview routes** - `/preview/[target]/[id]` for viewing draft content

### 4. Content Filtering

- **Pages API** - Shows draft content when in preview mode
- **Collections Items API** - Shows draft content when in preview mode
- **Preview routes** - Display draft content in read-only format

## How to Use

### For Content Editors

1. **Start Preview Mode:**
   - Open any page or item editor
   - Click the "Preview" button in the editor header
   - A new tab opens showing the draft content
   - The editor shows "PREVIEW ACTIVE" indicator

2. **Exit Preview Mode:**
   - Click "Exit preview" button in the editor header
   - Or click the "X" button in the preview indicator
   - Preview mode is disabled and only published content is shown

### For Developers

1. **Check Preview Status:**
   ```typescript
   import { isPreview, getPreviewMode } from '@/lib/preview'
   
   const inPreview = await isPreview()
   const preview = await getPreviewMode()
   ```

2. **Filter Content by Preview Mode:**
   ```typescript
   const whereClause = {
     tenantId,
     deletedAt: null,
     // Show draft content only in preview mode
     ...(inPreview ? {} : { status: 'PUBLISHED' }),
   }
   ```

3. **Create Preview URLs:**
   ```typescript
   import { createPreviewUrl } from '@/lib/preview'
   
   const previewUrl = createPreviewUrl('page', pageId)
   ```

## Technical Details

### Cookie Security

- Uses JWT tokens signed with `PREVIEW_COOKIE_SECRET`
- Cookies are HTTP-only and secure in production
- Tokens expire after 1 hour
- Includes tenant ID for multi-tenant security

### Preview Payload Structure

```typescript
interface PreviewPayload {
  tenantId: string
  target: 'page' | 'item'
  id: string
  token: string
  timestamp: number
}
```

### Environment Variables

- `PREVIEW_COOKIE_SECRET` - Secret for signing preview cookies
- `DEV_TENANT_ID` - Fallback tenant ID for development

## Testing

1. **Manual Testing:**
   - Visit `/test-preview` to see preview status
   - Use editor preview buttons
   - Check API responses with/without preview mode

2. **API Testing:**
   - Call `/api/v1/preview/start` with valid payload
   - Verify cookie is set
   - Call `/api/v1/preview/stop` to clear cookie
   - Test content APIs return draft content in preview mode

## Acceptance Criteria ✅

- [x] Draft content is visible when preview is on
- [x] Switching off preview shows published content only
- [x] Preview button in editor header
- [x] "PREVIEW ACTIVE" pill when preview cookie detected
- [x] "Exit preview" button calls `/preview/stop`
- [x] Preview opens in new tab/route
- [x] API routes respect preview mode
- [x] Secure cookie-based preview system

## Future Enhancements

- Preview mode for specific collections
- Preview mode expiration notifications
- Preview mode for scheduled content
- Preview mode analytics
- Preview mode for global settings
