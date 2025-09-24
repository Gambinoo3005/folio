# Deployment Guide

This guide covers deploying the site-starter template to Vercel for production use.

## Prerequisites

- Vercel account
- Domain name (optional)
- Folio CMS instance running
- Environment variables configured

## Environment Variables

The following environment variables must be configured in Vercel:

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
| `NEXT_PUBLIC_SITE_URL` | Public URL of the site | Auto-detected by Vercel |

## Deployment Steps

### 1. Fork the Repository

```bash
# Clone the site-starter template
git clone https://github.com/your-org/portfolio-building-service
cd portfolio-building-service/apps/site-starter

# Create a new repository for your client
git remote set-url origin https://github.com/your-org/client-site-name
git push -u origin main
```

### 2. Deploy to Vercel

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your forked repository
   - Select the `apps/site-starter` directory as the root

2. **Configure Environment Variables**
   - In the Vercel project settings, go to "Environment Variables"
   - Add all required variables listed above
   - Set them for Production, Preview, and Development environments

3. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### 3. Configure Domain (Optional)

1. **Add Custom Domain**
   - Go to project settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed by Vercel

2. **Update Environment Variables**
   - Update `NEXT_PUBLIC_SITE_URL` to your custom domain
   - Redeploy the project

## Build Configuration

The project uses the following build settings:

- **Framework**: Next.js
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

## Cache Configuration

The site includes optimized caching:

- **Static Assets**: Cached for 1 year
- **Sitemap**: Cached for 1 hour
- **Robots.txt**: Cached for 24 hours
- **API Routes**: 30-second timeout
- **ISR**: 60-second revalidation for published content

## Webhook Configuration

To enable cache revalidation when content is published:

1. **Get Webhook URL**
   - Your site's revalidation endpoint: `https://your-domain.com/api/revalidate`

2. **Configure CMS**
   - In your Folio CMS, add a webhook that calls this endpoint
   - Include the `FOLIO_REVALIDATE_SECRET` in the `x-folio-revalidate-secret` header
   - Send `{ "tenantId": "your-site-id", "tags": [] }` in the request body

## Monitoring

### Analytics (Optional)

You can add analytics to track site performance:

1. **Plausible Analytics**
   - Add your Plausible domain to environment variables
   - The site will automatically include the tracking script

2. **Vercel Analytics**
   - Enable in Vercel project settings
   - Provides Core Web Vitals and performance metrics

### Error Monitoring

Consider adding error monitoring:

- **Sentry**: Add `SENTRY_DSN` environment variable
- **Vercel Error Tracking**: Built-in error tracking in Vercel dashboard

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all environment variables are set
   - Verify the CMS API is accessible
   - Check build logs in Vercel dashboard

2. **Preview Mode Not Working**
   - Verify `PREVIEW_COOKIE_SECRET` is set
   - Check that the CMS preview endpoint is accessible
   - Ensure the site ID matches between CMS and site

3. **Cache Not Updating**
   - Verify `FOLIO_REVALIDATE_SECRET` is set correctly
   - Check webhook configuration in CMS
   - Test the revalidation endpoint manually

### Debug Mode

To enable debug logging, add:

```bash
DEBUG=folio:*
```

## Scaling

For high-traffic sites:

1. **Enable Vercel Pro**
   - Higher function execution limits
   - Better caching and CDN performance

2. **Optimize Images**
   - Use the `FolioImage` component for automatic optimization
   - Configure appropriate image sizes and formats

3. **Database Optimization**
   - Ensure CMS database is optimized
   - Consider read replicas for high-traffic scenarios

## Security

### Environment Variables
- Never commit secrets to version control
- Use Vercel's environment variable encryption
- Rotate secrets regularly

### API Security
- The revalidation endpoint validates webhook secrets
- Preview mode uses JWT tokens with expiration
- All API routes include proper error handling

## Support

For deployment issues:

1. Check the [Vercel Documentation](https://vercel.com/docs)
2. Review the [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
3. Contact support with specific error messages and logs
