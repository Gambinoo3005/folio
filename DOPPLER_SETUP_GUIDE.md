# Doppler Setup Guide for Folio Platform

## T1 - Doppler Project & Configs ✅ COMPLETED

**Project Created:** `folio-platform`

**Configs Available:**
- `dev` (Development environment)
- `stg_main` (Staging environment) 
- `prd_main` (Production environment)

**Verification:**
```bash
doppler projects get folio-platform
doppler configs --project folio-platform
```

## T2 - Secret Inventory ✅ COMPLETED

All required secrets have been added to each config with placeholder values `__set_me__` or appropriate defaults:

### Shared Secrets
- `NODE_ENV` (set to development/staging/production based on config)
- `NEXT_PUBLIC_SITE_NAME` (default: "Folio")
- `SENTRY_DSN`
- `AXIOM_TOKEN`
- `FEATURE_FLAGS_SOURCE` (default: "edge-config")

### Auth (Clerk)
- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_JWT_KEY`

### Database (Neon)
- `DATABASE_URL`
- `DIRECT_DATABASE_URL`
- `BRANCH_NAME`

### Email
- `RESEND_API_KEY`

### Background Jobs (Inngest)
- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`

### Media (Cloudflare)
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_R2_BUCKET`
- `CLOUDFLARE_IMAGES_TOKEN`
- `NEXT_PUBLIC_CDN_BASE` (default: "https://cdn.folio.com")

### Billing (Stripe)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_CARE`
- `STRIPE_PRICE_CARE_PLUS`
- `STRIPE_PRICE_STUDIO`
- `STRIPE_CUSTOMER_PORTAL_URL`
- `STRIPE_TAX_LOCATION`

### Security / Abuse
- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

### CMS/API App Specifics
- `APP_BASE_URL`
- `API_BASE_URL` (default: "https://api.folio.com")
- `PREVIEW_COOKIE_SECRET`
- `REVALIDATE_WEBHOOK_SECRET`

### Marketing App Specifics
- `MARKETING_BASE_URL`
- `PLAUSIBLE_DOMAIN`
- `CALCOM_ORG`
- `NEXT_PUBLIC_MARKETING_ENV`

### Per-Client Site Envs
- `SITE_ID`
- `NEXT_PUBLIC_API_BASE` (default: "https://api.folio.com")
- `NEXT_PUBLIC_CDN_BASE` (default: "https://cdn.folio.com")

## T3 - Vercel Integrations Setup

**Manual Setup Required in Doppler Dashboard:**

1. Navigate to `folio-platform` project in Doppler dashboard
2. Go to Integrations section
3. Add Vercel integrations for each config:

### Marketing App (folio-marketing)
- `dev` → `folio-marketing` Development
- `stg_main` → `folio-marketing` Preview  
- `prd_main` → `folio-marketing` Production

### CMS/API App (folio-cms)
- `dev` → `folio-cms` Development
- `stg_main` → `folio-cms` Preview
- `prd_main` → `folio-cms` Production

**Acceptance Criteria:**
- Six connections exist in Doppler Integrations (3 per Vercel project)
- In Vercel → each project → Settings → Environment Variables, keys appear after sync

## T4 - Local Development Conventions

### Preferred Method: Doppler Launcher
```bash
# For marketing app
cd apps/marketing
doppler run --project folio-platform --config dev -- pnpm dev

# For CMS app  
cd apps/cms
doppler run --project folio-platform --config dev -- pnpm dev
```

### Alternative Method: Download .env.local
```bash
# For marketing app
cd apps/marketing
doppler secrets download --project folio-platform --config dev --no-file --format=env > .env.local

# For CMS app
cd apps/cms  
doppler secrets download --project folio-platform --config dev --no-file --format=env > .env.local
```

**Acceptance Criteria:**
- Both methods start each app with envs loaded
- `.env*` files are git-ignored

## T5 - Guardrails & Policy

### Rotation Policy
- **Quarterly rotation** for: Clerk, Stripe, Cloudflare, Resend, Inngest, Sentry tokens
- Track rotation dates in project documentation

### Environment Separation
- **Production values ONLY** in `prd_main` config
- **Never reuse** prod secrets in dev/staging
- Use different service accounts/keys per environment

### Logging Security
- Confirm logging libraries mask tokens/PII
- No secrets in application logs
- Use structured logging with redaction

### Access Control
- **Restrict Doppler project access** to core team only
- Use **least-privilege Vercel tokens** for integrations
- Regular access reviews (quarterly)

### Change Management
- **Every secret edit requires a note** (reason, ticket/ref)
- Use Doppler's built-in change log
- Document all secret rotations

### Disaster Recovery
- **Export encrypted backup** of secrets quarterly
- Store backup securely (encrypted, access-controlled)
- Test restore procedures annually

## T6 - Per-Client Site Provisioning Hook

### Minimal Environment Variables for Client Projects
When provisioning new client sites, set only these envs via Vercel API:

```bash
SITE_ID=<guid-from-platform-db>
NEXT_PUBLIC_API_BASE=https://api.folio.com
NEXT_PUBLIC_CDN_BASE=https://cdn.folio.com
```

### Provisioning Pipeline Integration
- Use Inngest for tenant creation workflow
- Call Vercel API to set client-specific envs
- All other secrets remain in platform (CMS/API + marketing)

## T7 - Verification Checklist

### ✅ Completed
- [x] Doppler CLI installed and authenticated
- [x] `folio-platform` project created with dev, staging, prod configs
- [x] All secret keys present in each config (placeholders set)
- [x] Local run methods documented

### 🔄 Manual Setup Required
- [ ] Vercel sync integrations connected (6 total)
- [ ] Guardrails documented in project README
- [ ] Per-client envs spec documented for provisioning

### 📋 Next Steps
1. Complete Vercel integrations in Doppler dashboard
2. Test local development with Doppler launcher
3. Document guardrails in project README
4. Set up provisioning pipeline integration
5. Schedule quarterly secret rotation

## Commands Reference

```bash
# Check project status
doppler projects get folio-platform
doppler configs --project folio-platform

# View secrets
doppler secrets --project folio-platform --config dev

# Run with secrets
doppler run --project folio-platform --config dev -- pnpm dev

# Download env file
doppler secrets download --project folio-platform --config dev --no-file --format=env > .env.local
```
