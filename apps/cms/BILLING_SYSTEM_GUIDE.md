# Folio CMS Billing System Guide

## Overview

The Folio CMS billing system provides subscription management, plan gating, and usage tracking for tenant organizations. It integrates with Stripe for payment processing and uses Inngest for background job processing.

## Architecture

### Core Components

1. **Database Models** (`prisma/schema.prisma`)
   - `TenantBilling`: Stores Stripe customer and subscription data
   - `FeatureFlags`: Manages plan-based feature access and overrides
   - `TenantUsage`: Tracks daily usage metrics

2. **Stripe Integration** (`src/server/billing/`)
   - `stripe.ts`: Stripe client and utility functions
   - `tenant.ts`: Tenant billing operations

3. **Feature Management** (`src/server/features.ts`)
   - Plan-based feature gating
   - Usage limit enforcement
   - Feature override system

4. **Background Jobs** (`src/lib/inngest/`)
   - Daily usage computation
   - Usage limit monitoring
   - Automated alerts

5. **Webhooks** (`src/app/api/webhooks/stripe/`)
   - Stripe event processing
   - Subscription state synchronization

## Plans & Features

### Care Plan
- **Storage**: 5GB
- **Team Seats**: 2
- **Pages**: 10
- **Items**: 50
- **Collections**: 5
- **Features**: Basic functionality only

### Care+ Plan
- **Storage**: 25GB
- **Team Seats**: 5
- **Pages**: 50
- **Items**: 200
- **Collections**: 15
- **Features**: Custom domains, advanced SEO, scheduled publishing, form submissions, redirects

### Studio Plan
- **Storage**: 100GB
- **Team Seats**: 20
- **Pages**: Unlimited
- **Items**: Unlimited
- **Collections**: Unlimited
- **Features**: All Care+ features plus webhooks, API access, white label, priority support

## Environment Variables

### Required Stripe Variables
```bash
STRIPE_SECRET_KEY=sk_test_... # Test mode for development
STRIPE_WEBHOOK_SECRET=whsec_... # From Stripe CLI or dashboard
STRIPE_PRICE_CARE=price_... # Care plan price ID
STRIPE_PRICE_CARE_PLUS=price_... # Care+ plan price ID
STRIPE_PRICE_STUDIO=price_... # Studio plan price ID
STRIPE_CUSTOMER_PORTAL_URL=https://billing.stripe.com/p/login/... # Optional
```

### App Configuration
```bash
APP_BASE_URL=http://localhost:3001 # Base URL for redirects
```

## Go-Live Billing Flow

### 1. Admin-Only Billing Start
Only Folio staff can initiate billing for tenants:

```typescript
import { goLiveStartBilling } from '@/server/actions/billing';

// Start billing for a tenant
const result = await goLiveStartBilling({
  tenantId: 'org_123',
  plan: BillingPlan.CARE_PLUS,
});

if (result.requiresPaymentMethod) {
  // Redirect to Stripe portal for payment setup
  window.location.href = result.portalUrl;
}
```

### 2. Customer Portal Access
Tenants can manage their billing through Stripe's customer portal:

```typescript
import { openCustomerPortal } from '@/server/actions/billing';

const { portalUrl } = await openCustomerPortal();
// Redirect user to portalUrl
```

## Feature Gating

### Server-Side Enforcement
```typescript
import { requireFeature, requireLimit } from '@/server/features';

// Check if feature is available
await requireFeature(tenantId, 'customDomains');

// Check if within usage limits
await requireLimit(tenantId, 'maxSeats', currentSeatCount);
```

### Client-Side UI Gating
```typescript
import { hasFeature } from '@/server/features';

const canUseCustomDomains = await hasFeature(tenantId, 'customDomains');

// Conditionally render UI elements
{canUseCustomDomains && <CustomDomainSettings />}
```

## Usage Tracking

### Daily Metrics Computation
The system automatically computes usage metrics daily at 2 AM:

- **Storage**: Total media file size
- **Seats**: Active team members
- **Content**: Pages, items, collections count
- **Scheduled Posts**: Future-dated content

### Manual Usage Computation
```typescript
import { triggerUsageComputation } from '@/server/actions/billing';

// Trigger usage computation for current tenant
await triggerUsageComputation();
```

### Usage History
```typescript
import { getTenantUsageHistory } from '@/server/actions/billing';

// Get last 30 days of usage data
const history = await getTenantUsageHistory(30);
```

## Webhook Events

The system handles these Stripe webhook events:

- `checkout.session.completed`: New subscription created
- `customer.subscription.created`: Subscription activated
- `customer.subscription.updated`: Plan or status changes
- `customer.subscription.deleted`: Subscription canceled
- `invoice.payment_failed`: Payment issues
- `invoice.payment_succeeded`: Successful payments

### Webhook Endpoint
```
POST /api/webhooks/stripe
```

## Testing

### Manual Testing with Stripe CLI
```bash
# Install Stripe CLI
stripe listen --forward-to http://localhost:3001/api/webhooks/stripe

# Test subscription creation
stripe trigger checkout.session.completed

# Test payment failure
stripe trigger invoice.payment_failed
```

### Automated Tests
```bash
# Run billing tests
pnpm test src/server/billing/
pnpm test src/server/features/
```

## Database Migrations

### Initial Setup
```bash
# Generate and apply migration
pnpm db:migrate

# Seed default data
pnpm db:seed
```

### Adding New Plans
1. Update `BillingPlan` enum in `schema.prisma`
2. Add plan features to `PLAN_FEATURES` in `features.ts`
3. Create migration: `pnpm db:migrate`

## Monitoring & Alerts

### Usage Limit Alerts
The system automatically checks usage limits daily at 9 AM and can trigger alerts when:
- Storage usage exceeds 80% of plan limit
- Team seats exceed 80% of plan limit

### Logging
All billing operations are logged with structured data:
```typescript
console.log('Billing operation:', {
  tenantId,
  operation: 'subscription_created',
  plan,
  status,
});
```

## Troubleshooting

### Common Issues

1. **Webhook Signature Verification Failed**
   - Check `STRIPE_WEBHOOK_SECRET` environment variable
   - Ensure webhook endpoint URL is correct in Stripe dashboard

2. **Subscription Not Syncing**
   - Verify webhook events are being received
   - Check database for billing records
   - Review webhook processing logs

3. **Feature Gating Not Working**
   - Verify `FeatureFlags` record exists for tenant
   - Check plan assignment in `TenantBilling`
   - Review feature override settings

4. **Usage Metrics Not Updating**
   - Check Inngest function execution logs
   - Verify database connectivity
   - Ensure tenant has active billing record

### Debug Commands
```bash
# Check tenant billing status
pnpm db:studio
# Navigate to TenantBilling table

# View usage metrics
# Navigate to TenantUsage table

# Check feature flags
# Navigate to FeatureFlags table
```

## Security Considerations

1. **Webhook Security**: Always verify Stripe webhook signatures
2. **Admin Actions**: Restrict billing operations to authorized users only
3. **Data Privacy**: Ensure PII is not logged in billing operations
4. **API Keys**: Use test keys in development, production keys in production

## Production Deployment

### Stripe Configuration
1. Enable Stripe Tax in production account
2. Set up production webhook endpoints
3. Configure customer portal settings
4. Test all webhook events in production

### Environment Setup
1. Set production Stripe keys in Doppler
2. Configure production webhook secrets
3. Set up Inngest production environment
4. Enable monitoring and alerting

### Go-Live Checklist
- [ ] Stripe Tax enabled
- [ ] Production webhook endpoints configured
- [ ] Customer portal settings configured
- [ ] Usage monitoring active
- [ ] Admin billing controls tested
- [ ] Feature gating verified
- [ ] Payment flows tested end-to-end

## Support

For billing system issues:
1. Check application logs for errors
2. Verify Stripe dashboard for subscription status
3. Review webhook delivery logs in Stripe
4. Check database for data consistency
5. Contact development team with specific error details
