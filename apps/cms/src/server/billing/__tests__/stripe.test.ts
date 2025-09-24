import { describe, it, expect, vi, beforeEach } from 'vitest';
import { planFromPriceId, priceIdFromPlan, mapStripeStatusToBillingStatus } from '../stripe';
import { BillingPlan } from '@prisma/client';

// Mock environment variables
vi.mock('process', () => ({
  env: {
    STRIPE_PRICE_CARE: 'price_care_test',
    STRIPE_PRICE_CARE_PLUS: 'price_care_plus_test',
    STRIPE_PRICE_STUDIO: 'price_studio_test',
  },
}));

describe('Stripe utilities', () => {
  describe('planFromPriceId', () => {
    it('should return correct plan for valid price IDs', () => {
      expect(planFromPriceId('price_care_test')).toBe(BillingPlan.CARE);
      expect(planFromPriceId('price_care_plus_test')).toBe(BillingPlan.CARE_PLUS);
      expect(planFromPriceId('price_studio_test')).toBe(BillingPlan.STUDIO);
    });

    it('should return null for invalid price ID', () => {
      expect(planFromPriceId('invalid_price')).toBe(null);
    });
  });

  describe('priceIdFromPlan', () => {
    it('should return correct price ID for valid plans', () => {
      expect(priceIdFromPlan(BillingPlan.CARE)).toBe('price_care_test');
      expect(priceIdFromPlan(BillingPlan.CARE_PLUS)).toBe('price_care_plus_test');
      expect(priceIdFromPlan(BillingPlan.STUDIO)).toBe('price_studio_test');
    });
  });

  describe('mapStripeStatusToBillingStatus', () => {
    it('should map Stripe statuses to billing statuses correctly', () => {
      expect(mapStripeStatusToBillingStatus('active')).toBe('ACTIVE');
      expect(mapStripeStatusToBillingStatus('past_due')).toBe('PAST_DUE');
      expect(mapStripeStatusToBillingStatus('canceled')).toBe('CANCELED');
      expect(mapStripeStatusToBillingStatus('cancelled')).toBe('CANCELED');
      expect(mapStripeStatusToBillingStatus('paused')).toBe('PAUSED');
      expect(mapStripeStatusToBillingStatus('incomplete')).toBe('INACTIVE');
      expect(mapStripeStatusToBillingStatus('incomplete_expired')).toBe('INACTIVE');
      expect(mapStripeStatusToBillingStatus('trialing')).toBe('INACTIVE');
      expect(mapStripeStatusToBillingStatus('unpaid')).toBe('INACTIVE');
      expect(mapStripeStatusToBillingStatus('unknown')).toBe('INACTIVE');
    });
  });
});
