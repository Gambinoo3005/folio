# Billing System Testing Guide

## Quick Setup for Testing

### 1. Environment Setup

Create a `.env.local` file in `apps/cms/` with test values:

```bash
# Database (use your local PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb"

# Stripe Test Keys (get from Stripe Dashboard)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Stripe Price IDs (create test products in Stripe Dashboard)
STRIPE_PRICE_CARE="price_..."
STRIPE_PRICE_CARE_PLUS="price_..."
STRIPE_PRICE_STUDIO="price_..."

# App URLs
APP_BASE_URL="http://localhost:3001"

# Other required envs
NODE_ENV="development"
CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

### 2. Database Setup

```bash
cd apps/cms

# Run migrations
pnpm db:migrate

# Generate Prisma client
pnpm db:generate
```

### 3. Stripe CLI Setup

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local development
stripe listen --forward-to http://localhost:3001/api/webhooks/stripe
```

### 4. Start Development Server

```bash
cd apps/cms
pnpm dev
```

## Testing Scenarios

### 1. Basic Billing Flow

1. **Create a test tenant** in your CMS
2. **Navigate to Settings > Billing**
3. **Verify billing page loads** with current plan status
4. **Check usage metrics** are displayed correctly

### 2. Webhook Testing

1. **Create a test subscription** in Stripe Dashboard
2. **Verify webhook events** are received:
   ```bash
   # In Stripe CLI output, you should see:
   # 2024-01-01 12:00:00 --> customer.subscription.created
   # 2024-01-01 12:00:00 --> invoice.payment_succeeded
   ```
3. **Check database** for updated billing records
4. **Verify UI updates** reflect new subscription status

### 3. Feature Gating Testing

1. **Test with different plans**:
   - Create test subscriptions for Care, Care+, and Studio plans
   - Verify feature access matches plan limits
   - Test UI elements are hidden/shown correctly

2. **Test usage limits**:
   - Create content up to plan limits
   - Verify limit enforcement works
   - Test upgrade prompts appear when limits reached

### 4. Customer Portal Testing

1. **Start billing for a tenant** (admin action)
2. **Click "Manage Billing"** button
3. **Verify redirect** to Stripe Customer Portal
4. **Test portal functionality**:
   - Update payment method
   - View invoices
   - Cancel subscription
5. **Verify changes sync** back to CMS

### 5. Usage Metrics Testing

1. **Create test content**:
   - Upload media files
   - Create pages and items
   - Add team members
2. **Trigger usage computation**:
   ```typescript
   // In browser console or API call
   await triggerUsageComputation();
   ```
3. **Verify metrics update** in Settings > Billing
4. **Check usage history** is recorded

## Manual Test Commands

### Test Stripe Webhook Events

```bash
# Test subscription creation
stripe trigger checkout.session.completed

# Test payment failure
stripe trigger invoice.payment_failed

# Test subscription update
stripe trigger customer.subscription.updated

# Test subscription cancellation
stripe trigger customer.subscription.deleted
```

### Test Database Queries

```bash
# Open Prisma Studio
pnpm db:studio

# Check billing records
# Navigate to TenantBilling table

# Check feature flags
# Navigate to FeatureFlags table

# Check usage metrics
# Navigate to TenantUsage table
```

## Common Test Data

### Test Tenant Setup
```sql
-- Insert test tenant
INSERT INTO tenants (id, name) VALUES ('org_test123', 'Test Organization');

-- Insert test billing record
INSERT INTO tenant_billing (tenant_id, stripe_customer_id, status) 
VALUES ('org_test123', 'cus_test123', 'INACTIVE');

-- Insert test feature flags
INSERT INTO feature_flags (tenant_id, tier, overrides) 
VALUES ('org_test123', 'CARE', '{}');
```

### Test Stripe Data
```bash
# Create test customer
stripe customers create --name "Test Organization"

# Create test subscription
stripe subscriptions create --customer cus_test123 --items[0][price]=price_care_test
```

## Troubleshooting Tests

### Webhook Issues
1. **Check webhook secret** matches between Stripe and environment
2. **Verify endpoint URL** is correct in Stripe dashboard
3. **Check network connectivity** between Stripe and local server
4. **Review webhook logs** in Stripe dashboard

### Database Issues
1. **Verify migrations** have been applied
2. **Check database connection** string
3. **Ensure Prisma client** is generated
4. **Review database logs** for errors

### Feature Gating Issues
1. **Check FeatureFlags** record exists for tenant
2. **Verify plan assignment** in TenantBilling
3. **Review feature override** settings
4. **Test with different tenant** IDs

### UI Issues
1. **Check browser console** for JavaScript errors
2. **Verify API endpoints** are responding
3. **Check authentication** status
4. **Review server logs** for errors

## Automated Testing

### Run Test Suite
```bash
# Run all tests
pnpm test

# Run billing-specific tests
pnpm test src/server/billing/
pnpm test src/server/features/

# Run with coverage
pnpm test --coverage
```

### Test Coverage Areas
- Stripe utility functions
- Feature gating logic
- Usage limit enforcement
- Webhook event processing
- Database operations
- Error handling

## Production Testing

### Pre-Production Checklist
- [ ] Test with real Stripe keys (not test keys)
- [ ] Verify webhook endpoints work in production
- [ ] Test customer portal functionality
- [ ] Verify usage metrics computation
- [ ] Test feature gating enforcement
- [ ] Check error handling and logging
- [ ] Verify security measures are in place

### Production Monitoring
- Monitor webhook delivery success rates
- Track subscription creation/updates
- Monitor usage metrics accuracy
- Watch for billing-related errors
- Track customer portal usage
- Monitor feature gating effectiveness

## Support

If you encounter issues during testing:

1. **Check logs** in browser console and server logs
2. **Verify environment** variables are set correctly
3. **Test with minimal setup** to isolate issues
4. **Review Stripe dashboard** for webhook delivery status
5. **Check database** for data consistency
6. **Contact development team** with specific error details and steps to reproduce
