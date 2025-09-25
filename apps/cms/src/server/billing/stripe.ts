import Stripe from 'stripe';
import { BillingPlan } from '@prisma/client';

// Stripe client factory
export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is required');
  }

  return new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil',
    typescript: true,
  });
}

// Plan mapping helpers
export function planFromPriceId(priceId: string): BillingPlan | null {
  const priceMap: Record<string, BillingPlan> = {
    [process.env.STRIPE_PRICE_CARE || '']: BillingPlan.CARE,
    [process.env.STRIPE_PRICE_CARE_PLUS || '']: BillingPlan.CARE_PLUS,
    [process.env.STRIPE_PRICE_STUDIO || '']: BillingPlan.STUDIO,
  };

  return priceMap[priceId] || null;
}

export function priceIdFromPlan(plan: BillingPlan): string {
  const planMap: Record<BillingPlan, string> = {
    [BillingPlan.CARE]: process.env.STRIPE_PRICE_CARE || '',
    [BillingPlan.CARE_PLUS]: process.env.STRIPE_PRICE_CARE_PLUS || '',
    [BillingPlan.STUDIO]: process.env.STRIPE_PRICE_STUDIO || '',
  };

  const priceId = planMap[plan];
  if (!priceId) {
    throw new Error(`No price ID configured for plan: ${plan}`);
  }

  return priceId;
}

// Stripe status to our status mapping
export function mapStripeStatusToBillingStatus(stripeStatus: string): 'INACTIVE' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'PAUSED' {
  switch (stripeStatus) {
    case 'active':
      return 'ACTIVE';
    case 'past_due':
      return 'PAST_DUE';
    case 'canceled':
    case 'cancelled':
      return 'CANCELED';
    case 'paused':
      return 'PAUSED';
    case 'incomplete':
    case 'incomplete_expired':
    case 'trialing':
    case 'unpaid':
    default:
      return 'INACTIVE';
  }
}

// Subscription options for creating subscriptions
export interface SubscriptionOptions {
  trialPeriodDays?: number;
  prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
  paymentBehavior?: 'default_incomplete' | 'allow_incomplete' | 'error_if_incomplete';
}

// Default subscription options
export const DEFAULT_SUBSCRIPTION_OPTIONS: SubscriptionOptions = {
  prorationBehavior: 'always_invoice',
  paymentBehavior: 'default_incomplete',
};
