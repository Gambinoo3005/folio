import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFeatures, hasFeature, isWithinLimit, requireFeature, requireLimit } from '../features';
import { BillingPlan } from '@prisma/client';

// Mock Prisma
const mockPrisma = {
  featureFlags: {
    findUnique: vi.fn(),
  },
};

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}));

describe('Feature management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getFeatures', () => {
    it('should return inactive features when no feature flags exist', async () => {
      mockPrisma.featureFlags.findUnique.mockResolvedValue(null);

      const features = await getFeatures('tenant-1');

      expect(features.tier).toBe(null);
      expect(features.limits.maxStorageBytes).toBe(100 * 1024 * 1024); // 100MB
      expect(features.limits.maxSeats).toBe(1);
      expect(features.limits.customDomains).toBe(false);
    });

    it('should return plan features when feature flags exist', async () => {
      mockPrisma.featureFlags.findUnique.mockResolvedValue({
        tier: BillingPlan.CARE_PLUS,
        overrides: {},
      });

      const features = await getFeatures('tenant-1');

      expect(features.tier).toBe(BillingPlan.CARE_PLUS);
      expect(features.limits.maxStorageBytes).toBe(25 * 1024 * 1024 * 1024); // 25GB
      expect(features.limits.maxSeats).toBe(5);
      expect(features.limits.customDomains).toBe(true);
    });

    it('should apply overrides to base features', async () => {
      mockPrisma.featureFlags.findUnique.mockResolvedValue({
        tier: BillingPlan.CARE,
        overrides: {
          customDomains: true, // Override to enable custom domains
        },
      });

      const features = await getFeatures('tenant-1');

      expect(features.tier).toBe(BillingPlan.CARE);
      expect(features.limits.customDomains).toBe(true); // Should be overridden
      expect(features.limits.maxSeats).toBe(2); // Should remain from base plan
    });
  });

  describe('hasFeature', () => {
    it('should return true for enabled features', async () => {
      mockPrisma.featureFlags.findUnique.mockResolvedValue({
        tier: BillingPlan.CARE_PLUS,
        overrides: {},
      });

      const hasCustomDomains = await hasFeature('tenant-1', 'customDomains');
      expect(hasCustomDomains).toBe(true);
    });

    it('should return false for disabled features', async () => {
      mockPrisma.featureFlags.findUnique.mockResolvedValue({
        tier: BillingPlan.CARE,
        overrides: {},
      });

      const hasCustomDomains = await hasFeature('tenant-1', 'customDomains');
      expect(hasCustomDomains).toBe(false);
    });
  });

  describe('isWithinLimit', () => {
    it('should return true when within limit', async () => {
      mockPrisma.featureFlags.findUnique.mockResolvedValue({
        tier: BillingPlan.CARE,
        overrides: {},
      });

      const withinLimit = await isWithinLimit('tenant-1', 'maxSeats', 1);
      expect(withinLimit).toBe(true);
    });

    it('should return false when exceeding limit', async () => {
      mockPrisma.featureFlags.findUnique.mockResolvedValue({
        tier: BillingPlan.CARE,
        overrides: {},
      });

      const withinLimit = await isWithinLimit('tenant-1', 'maxSeats', 3);
      expect(withinLimit).toBe(false);
    });

    it('should return true for unlimited features', async () => {
      mockPrisma.featureFlags.findUnique.mockResolvedValue({
        tier: BillingPlan.STUDIO,
        overrides: {},
      });

      const withinLimit = await isWithinLimit('tenant-1', 'maxPages', 1000);
      expect(withinLimit).toBe(true);
    });
  });

  describe('requireFeature', () => {
    it('should not throw when feature is available', async () => {
      mockPrisma.featureFlags.findUnique.mockResolvedValue({
        tier: BillingPlan.CARE_PLUS,
        overrides: {},
      });

      await expect(requireFeature('tenant-1', 'customDomains')).resolves.not.toThrow();
    });

    it('should throw when feature is not available', async () => {
      mockPrisma.featureFlags.findUnique.mockResolvedValue({
        tier: BillingPlan.CARE,
        overrides: {},
      });

      await expect(requireFeature('tenant-1', 'customDomains')).rejects.toThrow(
        "Feature 'customDomains' is not available for your current plan"
      );
    });
  });

  describe('requireLimit', () => {
    it('should not throw when within limit', async () => {
      mockPrisma.featureFlags.findUnique.mockResolvedValue({
        tier: BillingPlan.CARE,
        overrides: {},
      });

      await expect(requireLimit('tenant-1', 'maxSeats', 1)).resolves.not.toThrow();
    });

    it('should throw when exceeding limit', async () => {
      mockPrisma.featureFlags.findUnique.mockResolvedValue({
        tier: BillingPlan.CARE,
        overrides: {},
      });

      await expect(requireLimit('tenant-1', 'maxSeats', 3)).rejects.toThrow(
        "Limit exceeded for 'maxSeats': 3/2"
      );
    });
  });
});
