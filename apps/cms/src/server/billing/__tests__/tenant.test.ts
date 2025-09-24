import { describe, it, expect, vi, beforeEach } from 'vitest';
import { syncBillingFromStripe } from '../tenant';
import { BillingPlan } from '@prisma/client';
import Stripe from 'stripe';

// Mock Prisma
const mockPrisma = {
  tenantBilling: {
    findFirst: vi.fn(),
    update: vi.fn(),
  },
  featureFlags: {
    upsert: vi.fn(),
  },
};

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}));

// Mock Stripe client
vi.mock('../stripe', () => ({
  getStripe: vi.fn(() => ({
    subscriptions: {
      retrieve: vi.fn(),
    },
  })),
  planFromPriceId: vi.fn(),
}));

describe('Tenant billing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('syncBillingFromStripe', () => {
    it('should sync subscription data to database', async () => {
      const mockSubscription: Partial<Stripe.Subscription> = {
        id: 'sub_test123',
        customer: 'cus_test123',
        status: 'active',
        current_period_end: 1234567890,
        trial_end: null,
        items: {
          data: [
            {
              price: {
                id: 'price_care_plus_test',
              },
            } as any,
          ],
        },
      };

      mockPrisma.tenantBilling.findFirst.mockResolvedValue({
        tenantId: 'tenant-1',
      });

      const { planFromPriceId } = await import('../stripe');
      vi.mocked(planFromPriceId).mockReturnValue(BillingPlan.CARE_PLUS);

      await syncBillingFromStripe(mockSubscription as Stripe.Subscription);

      expect(mockPrisma.tenantBilling.update).toHaveBeenCalledWith({
        where: { tenantId: 'tenant-1' },
        data: {
          stripeSubscriptionId: 'sub_test123',
          plan: BillingPlan.CARE_PLUS,
          status: 'ACTIVE',
          currentPeriodEnd: new Date(1234567890 * 1000),
          trialEndsAt: null,
        },
      });

      expect(mockPrisma.featureFlags.upsert).toHaveBeenCalledWith({
        where: { tenantId: 'tenant-1' },
        create: {
          tenantId: 'tenant-1',
          tier: BillingPlan.CARE_PLUS,
        },
        update: {
          tier: BillingPlan.CARE_PLUS,
        },
      });
    });

    it('should handle subscription with trial', async () => {
      const mockSubscription: Partial<Stripe.Subscription> = {
        id: 'sub_test123',
        customer: 'cus_test123',
        status: 'trialing',
        current_period_end: 1234567890,
        trial_end: 1234567800,
        items: {
          data: [
            {
              price: {
                id: 'price_care_test',
              },
            } as any,
          ],
        },
      };

      mockPrisma.tenantBilling.findFirst.mockResolvedValue({
        tenantId: 'tenant-1',
      });

      const { planFromPriceId } = await import('../stripe');
      vi.mocked(planFromPriceId).mockReturnValue(BillingPlan.CARE);

      await syncBillingFromStripe(mockSubscription as Stripe.Subscription);

      expect(mockPrisma.tenantBilling.update).toHaveBeenCalledWith({
        where: { tenantId: 'tenant-1' },
        data: {
          stripeSubscriptionId: 'sub_test123',
          plan: BillingPlan.CARE,
          status: 'INACTIVE', // trialing maps to INACTIVE
          currentPeriodEnd: new Date(1234567890 * 1000),
          trialEndsAt: new Date(1234567800 * 1000),
        },
      });
    });

    it('should handle missing billing record gracefully', async () => {
      const mockSubscription: Partial<Stripe.Subscription> = {
        id: 'sub_test123',
        customer: 'cus_test123',
        status: 'active',
        current_period_end: 1234567890,
        trial_end: null,
        items: {
          data: [
            {
              price: {
                id: 'price_care_test',
              },
            } as any,
          ],
        },
      };

      mockPrisma.tenantBilling.findFirst.mockResolvedValue(null);

      // Should not throw, just log warning
      await expect(syncBillingFromStripe(mockSubscription as Stripe.Subscription)).resolves.not.toThrow();

      expect(mockPrisma.tenantBilling.update).not.toHaveBeenCalled();
      expect(mockPrisma.featureFlags.upsert).not.toHaveBeenCalled();
    });
  });
});
