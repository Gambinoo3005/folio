import { getStripe, priceIdFromPlan, mapStripeStatusToBillingStatus, SubscriptionOptions, DEFAULT_SUBSCRIPTION_OPTIONS } from './stripe';
import { prisma } from '@/lib/prisma';
import { BillingPlan, BillingStatus } from '@prisma/client';
import Stripe from 'stripe';

/**
 * Ensures a Stripe customer exists for the tenant
 * Creates one if it doesn't exist, returns existing if it does
 */
export async function ensureStripeCustomer(tenantId: string): Promise<string> {
  // Check if we already have a billing record with a Stripe customer ID
  const existingBilling = await prisma.tenantBilling.findUnique({
    where: { tenantId },
    select: { stripeCustomerId: true },
  });

  if (existingBilling?.stripeCustomerId) {
    return existingBilling.stripeCustomerId;
  }

  // Get tenant info for customer creation
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { name: true },
  });

  if (!tenant) {
    throw new Error(`Tenant not found: ${tenantId}`);
  }

  const stripe = getStripe();

  // Create Stripe customer
  const customer = await stripe.customers.create({
    name: tenant.name,
    metadata: {
      tenantId,
    },
  });

  // Create or update billing record
  await prisma.tenantBilling.upsert({
    where: { tenantId },
    create: {
      tenantId,
      stripeCustomerId: customer.id,
      status: 'INACTIVE',
    },
    update: {
      stripeCustomerId: customer.id,
    },
  });

  return customer.id;
}

/**
 * Starts a subscription for a tenant
 */
export async function startSubscription(
  tenantId: string,
  plan: BillingPlan,
  options: SubscriptionOptions = DEFAULT_SUBSCRIPTION_OPTIONS
): Promise<Stripe.Subscription> {
  const stripe = getStripe();
  const customerId = await ensureStripeCustomer(tenantId);
  const priceId = priceIdFromPlan(plan);

  // Create subscription
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    automatic_tax: { enabled: true },
    collection_method: 'charge_automatically',
    payment_behavior: options.paymentBehavior || 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
    },
    proration_behavior: options.prorationBehavior || 'always_invoice',
    trial_period_days: options.trialPeriodDays,
    expand: ['latest_invoice.payment_intent'],
  });

  // Update billing record
  await prisma.tenantBilling.update({
    where: { tenantId },
    data: {
      stripeSubscriptionId: subscription.id,
      plan,
      status: mapStripeStatusToBillingStatus(subscription.status),
      currentPeriodEnd: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000) : null,
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    },
  });

  return subscription;
}

/**
 * Creates a customer portal session for self-service billing management
 */
export async function attachPortalSession(tenantId: string, returnUrl: string): Promise<string> {
  const stripe = getStripe();
  const customerId = await ensureStripeCustomer(tenantId);

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}

/**
 * Syncs billing state from Stripe subscription to our database
 */
export async function syncBillingFromStripe(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;
  
  // Find tenant by Stripe customer ID
  const billing = await prisma.tenantBilling.findFirst({
    where: { stripeCustomerId: customerId },
    select: { tenantId: true },
  });

  if (!billing) {
    console.warn(`No billing record found for Stripe customer: ${customerId}`);
    return;
  }

  // Determine plan from subscription items
  let plan: BillingPlan | null = null;
  if (subscription.items.data.length > 0) {
    const priceId = subscription.items.data[0].price.id;
    const { planFromPriceId } = await import('./stripe');
    plan = planFromPriceId(priceId);
  }

  // Update billing record
  await prisma.tenantBilling.update({
    where: { tenantId: billing.tenantId },
    data: {
      stripeSubscriptionId: subscription.id,
      plan,
      status: mapStripeStatusToBillingStatus(subscription.status),
      currentPeriodEnd: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000) : null,
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    },
  });

  // Update feature flags to match plan
  await prisma.featureFlags.upsert({
    where: { tenantId: billing.tenantId },
    create: {
      tenantId: billing.tenantId,
      tier: plan,
    },
    update: {
      tier: plan,
    },
  });
}

/**
 * Gets billing information for a tenant
 */
export async function getTenantBilling(tenantId: string) {
  return await prisma.tenantBilling.findUnique({
    where: { tenantId },
    include: {
      tenant: {
        select: { name: true },
      },
    },
  });
}

/**
 * Cancels a subscription (sets to cancel at period end)
 */
export async function cancelSubscription(tenantId: string): Promise<void> {
  const billing = await prisma.tenantBilling.findUnique({
    where: { tenantId },
    select: { stripeSubscriptionId: true },
  });

  if (!billing?.stripeSubscriptionId) {
    throw new Error('No active subscription found for tenant');
  }

  const stripe = getStripe();
  
  await stripe.subscriptions.update(billing.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  // Update status to indicate it will be canceled
  await prisma.tenantBilling.update({
    where: { tenantId },
    data: {
      status: 'CANCELED',
    },
  });
}

/**
 * Reactivates a canceled subscription
 */
export async function reactivateSubscription(tenantId: string): Promise<void> {
  const billing = await prisma.tenantBilling.findUnique({
    where: { tenantId },
    select: { stripeSubscriptionId: true },
  });

  if (!billing?.stripeSubscriptionId) {
    throw new Error('No subscription found for tenant');
  }

  const stripe = getStripe();
  
  await stripe.subscriptions.update(billing.stripeSubscriptionId, {
    cancel_at_period_end: false,
  });

  // Update status back to active
  await prisma.tenantBilling.update({
    where: { tenantId },
    data: {
      status: 'ACTIVE',
    },
  });
}
