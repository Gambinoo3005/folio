# Portfolio Site Starter

A production-ready Next.js template for portfolio websites powered by the Folio CMS. This starter template provides a complete foundation for building client portfolio sites with dynamic content, preview mode, and automatic revalidation.

## Features

- ✅ **Dynamic Content Rendering** - Pages, collections, and items from CMS
- ✅ **Preview Mode** - Draft content preview with secure authentication
- ✅ **SEO Optimized** - Automatic meta tags, sitemaps, and robots.txt
- ✅ **Image Optimization** - Cloudflare Images and R2 file support
- ✅ **Cache Management** - ISR with automatic revalidation
- ✅ **Type Safety** - Full TypeScript support with Zod validation
- ✅ **Responsive Design** - Modern UI with Tailwind CSS
- ✅ **Production Ready** - Vercel deployment configuration

## Quick Start

### 1. Environment Setup

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_API_BASE=http://localhost:3001
SITE_ID=dev-site-1
NEXT_PUBLIC_CDN_BASE=https://cdn.folio.com
FOLIO_REVALIDATE_SECRET=your-secret-key
PREVIEW_COOKIE_SECRET=your-preview-secret
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development Server

```bash
pnpm dev
```

The site will be available at `http://localhost:3002`.

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SITE_ID` | Unique identifier for this client site | `org_1234567890` |
| `NEXT_PUBLIC_API_BASE` | CMS API base URL | `https://api.folio.com` |
| `NEXT_PUBLIC_CDN_BASE` | CDN base URL for media | `https://cdn.folio.com` |
| `FOLIO_REVALIDATE_SECRET` | Secret for cache revalidation webhooks | `your-secret-key` |
| `PREVIEW_COOKIE_SECRET` | Secret for preview mode cookies | `your-preview-secret` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Public URL of the site | Auto-detected |
| `NODE_ENV` | Environment mode | `development` |

## How Preview Mode Works

Preview mode allows content editors to see draft content before publishing:

### 1. Starting Preview

```bash
POST /api/preview/start
Content-Type: application/json

{
  "slug": "about",
  "target": "page"
}
```

### 2. Preview Badge

When preview mode is active, a "PREVIEW" badge appears in the top-right corner.

### 3. Stopping Preview

```bash
POST /api/preview/stop
```

### 4. CMS Integration

The CMS editor's "Preview" button opens the site with preview mode enabled, showing draft content.

## How to Call /api/revalidate

Cache revalidation is triggered when content is published:

### Webhook Configuration

Configure your CMS to call the revalidation endpoint:

```bash
POST https://your-site.com/api/revalidate
Content-Type: application/json
x-folio-revalidate-secret: your-secret-key

{
  "tenantId": "org_1234567890",
  "tags": ["page:about", "collection:projects"]
}
```

### Manual Revalidation

You can also trigger revalidation manually:

```bash
curl -X POST https://your-site.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-folio-revalidate-secret: your-secret-key" \
  -d '{"tenantId": "org_1234567890"}'
```

## How to Fork for a New Client

### 1. Create New Repository

```bash
# Clone the template
git clone https://github.com/your-org/portfolio-building-service
cd portfolio-building-service/apps/site-starter

# Create new repository
git remote set-url origin https://github.com/your-org/client-site-name
git push -u origin main
```

### 2. Update Configuration

1. **Update package.json**
   ```json
   {
     "name": "client-site-name",
     "description": "Client portfolio website"
   }
   ```

2. **Set Environment Variables**
   - Update `SITE_ID` to the client's unique identifier
   - Configure production API and CDN URLs
   - Set secure secrets for revalidation and preview

3. **Customize Branding**
   - Update site name in navigation
   - Customize colors in `tailwind.config.ts`
   - Add client-specific content

### 3. Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## How to Add a Custom Domain in Vercel

### 1. Add Domain in Vercel Dashboard

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Click "Add Domain"
4. Enter your custom domain (e.g., `clientname.com`)

### 2. Configure DNS

Vercel will provide DNS records to add to your domain registrar:

```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Update Environment Variables

Update `NEXT_PUBLIC_SITE_URL` to your custom domain:

```env
NEXT_PUBLIC_SITE_URL=https://clientname.com
```

### 4. Redeploy

Trigger a new deployment to apply the changes.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [slug]/            # Dynamic page routes
│   ├── [collection]/      # Collection routes
│   │   └── [item]/        # Item routes
│   ├── api/               # API routes
│   │   ├── preview/       # Preview mode endpoints
│   │   ├── revalidate/    # Cache revalidation
│   │   └── provision/     # Client provisioning
│   ├── sitemap.ts         # Dynamic sitemap
│   ├── robots.ts          # Robots.txt
│   └── not-found.tsx      # 404 page
├── components/            # React components
│   ├── folio-image.tsx    # Image optimization
│   ├── navigation.tsx     # Site navigation
│   └── preview-badge.tsx  # Preview indicator
└── lib/                   # Utilities
    └── preview.ts         # Preview mode helpers
```

## API Endpoints

### Preview Mode

- `POST /api/preview/start` - Start preview mode
- `POST /api/preview/stop` - Stop preview mode
- `GET /api/preview/status` - Check preview status

### Cache Management

- `POST /api/revalidate` - Revalidate cache (webhook)

### Client Management

- `POST /api/provision` - Update site ID (dev only)
- `GET /api/provision` - Get current configuration

## Components

### FolioImage

Optimized image component with Cloudflare Images support:

```tsx
import { FolioImage } from '@/components/folio-image'

<FolioImage
  src="cf-image-id"
  alt="Description"
  width={800}
  height={600}
  focalPoint={{ x: 0.5, y: 0.3 }}
  imageParams={{ quality: 90, format: 'webp' }}
/>
```

### Navigation

Dynamic navigation from CMS globals:

```tsx
import { Navigation } from '@/components/navigation'

// Automatically loads from globals.get('navigation')
<Navigation />
```

## Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm typecheck    # Run TypeScript checks
```

### Testing the SDK

Visit `/test-cms` to test the CMS SDK integration and see all available data.

### Preview Mode Testing

1. Start the CMS development server
2. Create a draft page or item
3. Use the preview button in the CMS editor
4. Verify draft content appears on the site

## Troubleshooting

### Common Issues

1. **"No tenant ID could be resolved"**
   - Check that `SITE_ID` is set correctly
   - Verify the CMS is running and accessible

2. **Preview mode not working**
   - Ensure `PREVIEW_COOKIE_SECRET` is set
   - Check that the CMS preview endpoint is accessible

3. **Images not loading**
   - Verify `NEXT_PUBLIC_CDN_BASE` is configured
   - Check that image IDs are valid Cloudflare Images

4. **Cache not updating**
   - Verify `FOLIO_REVALIDATE_SECRET` matches between CMS and site
   - Check webhook configuration in CMS

### Debug Mode

Enable debug logging:

```env
DEBUG=folio:*
```

## Performance

### Caching Strategy

- **Static Assets**: Cached for 1 year
- **Pages**: ISR with 60-second revalidation
- **API Responses**: 60-second cache for published content
- **Preview Mode**: No caching, always fresh

### Image Optimization

- Automatic WebP conversion
- Responsive image sizing
- Focal point support
- Lazy loading

## Security

### Environment Variables
- Never commit secrets to version control
- Use Vercel's environment variable encryption
- Rotate secrets regularly

### API Security
- Webhook secret validation
- JWT-based preview authentication
- Proper error handling and logging

## Support

For issues and questions:

1. Check the [troubleshooting section](#troubleshooting)
2. Review the [deployment guide](./DEPLOYMENT.md)
3. Check the [SDK documentation](../../packages/site-core/README.md)
4. Contact support with specific error messages

## License

MIT License - see [LICENSE](../../LICENSE) for details.