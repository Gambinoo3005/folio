# Media System Implementation Guide

## Overview

Phase 5 of the CMS implementation adds comprehensive media management with Cloudflare Images and R2 for direct uploads, eliminating the need for files to pass through the Next.js server.

## Features Implemented

### 1. Server-Side Media Utilities (`src/server/media.ts`)

- **`createSignedUploadUrl()`** - Creates direct upload URLs for Cloudflare Images and R2
- **`getImageMetadata()`** - Extracts image dimensions and metadata from Cloudflare Images
- **`generateDeliveryUrl()`** - Generates CDN delivery URLs for media
- **`generateThumbnailUrl()`** - Creates thumbnail URLs with transformations
- **File validation and sanitization utilities**

### 2. API Routes

- **POST /api/v1/media/upload-url** - Returns signed upload URL + fields
- **POST /api/v1/media/commit** - Finalizes upload and saves Media record
- **GET /api/v1/media** - Lists/paginates/filters media with search

### 3. Server Actions

- **`updateMedia()`** - Updates alt text and focal point
- **`deleteMedia()`** - Soft deletes media records
- **`getMedia()`** - Retrieves single media item

### 4. UI Components

- **MediaUpload** - Drag & drop upload with progress tracking
- **MediaGrid** - Grid/list view with search and filters
- **MediaDetailDrawer** - Detailed view with editing capabilities
- **MediaPageContent** - Main media library interface

### 5. Client-Side Hooks

- **`useMediaUpload()`** - Handles upload flow and progress
- **Direct upload to Cloudflare/R2** - No server data streaming

## Environment Configuration

### Required Environment Variables

```bash
# Cloudflare Images
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_IMAGES_TOKEN=your_images_token

# Cloudflare R2
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET=your_bucket_name

# CDN Configuration
NEXT_PUBLIC_CDN_BASE=https://cdn.folio.com
```

### Cloudflare Setup

1. **Cloudflare Images:**
   - Enable Cloudflare Images in your account
   - Create an API token with Images:Edit permissions
   - Configure allowed origins for direct uploads

2. **Cloudflare R2:**
   - Create an R2 bucket for file storage
   - Generate API tokens with R2:Edit permissions
   - Configure CORS for direct uploads

3. **CDN Configuration:**
   - Set up custom domain for CDN
   - Configure Cloudflare Images variants
   - Set up R2 public access via CDN

## Database Schema

The Media table includes:

```sql
model Media {
  id        String    @id @default(uuid())
  tenantId  String    @map("tenant_id")
  kind      MediaKind // IMAGE | FILE
  filename  String
  mime      String
  size      Int
  width     Int?      // For images
  height    Int?      // For images
  cfImageId String?   @map("cf_image_id") // Cloudflare Images ID
  r2Key     String?   @map("r2_key")      // R2 storage key
  alt       String?   // Alt text for accessibility
  focalX    Float?    @map("focal_x")     // Focal point X (0-1)
  focalY    Float?    @map("focal_y")     // Focal point Y (0-1)
  deletedAt DateTime? @map("deleted_at")  // Soft delete
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

## Upload Flow

### 1. Client Upload Process

```typescript
// Step 1: Get signed upload URL
const uploadUrlResponse = await fetch('/api/v1/media/upload-url', {
  method: 'POST',
  body: JSON.stringify({
    kind: 'image',
    filename: 'photo.jpg',
    mime: 'image/jpeg',
    size: 1024000
  })
})

// Step 2: Upload directly to Cloudflare/R2
const formData = new FormData()
formData.append('file', file)
await fetch(uploadData.url, {
  method: 'POST',
  body: formData
})

// Step 3: Commit the upload
const commitResponse = await fetch('/api/v1/media/commit', {
  method: 'POST',
  body: JSON.stringify({
    kind: 'image',
    filename: 'photo.jpg',
    mime: 'image/jpeg',
    size: 1024000,
    cfImageId: 'cf-image-id',
    r2Key: 'r2-key'
  })
})
```

### 2. Server Processing

- **Image Uploads:** Go to Cloudflare Images for processing and optimization
- **File Uploads:** Go to R2 for direct storage
- **Metadata Extraction:** Automatic width/height extraction for images
- **URL Generation:** CDN URLs for delivery

## Media Management

### Upload Features

- **Drag & Drop:** Intuitive file selection
- **Multiple Files:** Batch upload support
- **Progress Tracking:** Real-time upload progress
- **File Validation:** Size and type restrictions
- **Error Handling:** Comprehensive error messages

### Media Library

- **Grid/List Views:** Toggle between display modes
- **Search & Filter:** Find media by name, type, date
- **Pagination:** Efficient loading of large collections
- **Thumbnails:** Automatic thumbnail generation for images

### Media Editing

- **Alt Text:** Accessibility support
- **Focal Point:** Image cropping control
- **Metadata:** View file information
- **URLs:** Copy delivery and thumbnail URLs

## Delivery URLs

### Image URLs

```typescript
// Basic delivery
https://cdn.folio.com/cdn-cgi/image/image-id

// With transformations
https://cdn.folio.com/cdn-cgi/image/width=300,height=300,fit=cover/image-id

// Thumbnail
https://cdn.folio.com/cdn-cgi/image/width=300,height=300,fit=cover/image-id
```

### File URLs

```typescript
// Direct R2 access via CDN
https://cdn.folio.com/files/timestamp-randomkey.pdf
```

## Security Features

- **Tenant Isolation:** All media scoped to tenant
- **Signed URLs:** Time-limited upload URLs
- **File Validation:** Type and size restrictions
- **Soft Deletes:** Recoverable media deletion
- **Access Control:** Authentication required for all operations

## Performance Optimizations

- **Direct Uploads:** No server data streaming
- **CDN Delivery:** Global content distribution
- **Image Optimization:** Automatic format and size optimization
- **Lazy Loading:** Efficient media grid rendering
- **Caching:** Appropriate cache headers

## Testing

### Manual Testing

1. **Visit `/test-media`** for comprehensive testing
2. **Test API endpoints** to verify configuration
3. **Upload files** to test direct upload flow
4. **Check delivery URLs** for proper CDN integration

### API Testing

```bash
# Test upload URL generation
curl -X POST /api/v1/media/upload-url \
  -H "Content-Type: application/json" \
  -d '{"kind":"image","filename":"test.jpg","mime":"image/jpeg","size":1024}'

# Test media listing
curl /api/v1/media?kind=IMAGE&limit=10
```

## Acceptance Criteria ✅

- [x] **Direct Upload:** Files upload without passing through Next.js server
- [x] **Image Thumbnails:** Load via cdn.folio.com transforms
- [x] **Metadata Saved:** Width, height, size automatically extracted
- [x] **Alt/Focal Saved:** Accessibility and cropping support
- [x] **Grid/List Views:** Search, type filters, date range
- [x] **Detail Drawer:** Full media management interface
- [x] **Cloudflare Integration:** Images and R2 working
- [x] **CDN Delivery:** All media served via CDN

## Future Enhancements

- **Bulk Operations:** Select multiple media for batch actions
- **Media Collections:** Organize media into folders/collections
- **Usage Tracking:** Track where media is used across content
- **Advanced Transformations:** More image processing options
- **Video Support:** Enhanced video handling and thumbnails
- **Media Analytics:** Usage statistics and insights

## Troubleshooting

### Common Issues

1. **Upload Failures:**
   - Check environment variables
   - Verify Cloudflare credentials
   - Check file size limits

2. **CDN Issues:**
   - Verify CDN domain configuration
   - Check CORS settings
   - Test direct R2 access

3. **Image Processing:**
   - Verify Cloudflare Images setup
   - Check API token permissions
   - Test with different image formats

### Debug Tools

- **Test Page:** `/test-media` for comprehensive testing
- **API Logs:** Check server logs for detailed errors
- **Network Tab:** Monitor upload requests and responses
- **Cloudflare Dashboard:** Check Images and R2 usage
