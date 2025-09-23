# Deployment Guide

This guide covers how to deploy the standalone marketing site to various platforms.

## Quick Deploy Options

### Vercel (Recommended)

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

2. **Configure Build Settings:**
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Deploy:**
   - Click "Deploy"
   - Your site will be live at `https://your-project.vercel.app`

### Netlify

1. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - Click "New site from Git"

2. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Publish Directory: `.next`
   - Node Version: `18` (in Environment Variables)

3. **Deploy:**
   - Click "Deploy site"

### Railway

1. **Connect to Railway:**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"

2. **Configure:**
   - Select your repository
   - Railway will auto-detect Next.js

3. **Deploy:**
   - Click "Deploy"

## Manual Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Environment Variables

If you need environment variables, create a `.env.local` file:

```env
# Example environment variables
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## Custom Domain

### Vercel
1. Go to your project dashboard
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Netlify
1. Go to Site settings
2. Click "Domain management"
3. Add custom domain
4. Update DNS records

## Performance Optimization

The site is already optimized with:
- Static generation for all pages
- Image optimization
- CSS optimization
- Bundle splitting

## Monitoring

Consider adding:
- Vercel Analytics (already included)
- Google Analytics
- Sentry for error tracking

## SSL/HTTPS

All recommended platforms provide free SSL certificates automatically.
