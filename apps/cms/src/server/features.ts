import { prisma } from '@/lib/prisma';
import { BillingPlan } from '@prisma/client';

// Feature definitions by plan tier
export interface FeatureLimits {
  // Storage limits (in bytes)
  maxStorageBytes: number;
  
  // Content limits
  maxPages: number;
  maxItems: number;
  maxCollections: number;
  
  // Team limits
  maxSeats: number;
  
  // Advanced features
  customDomains: boolean;
  advancedSeo: boolean;
  scheduledPublishing: boolean;
  formSubmissions: boolean;
  redirects: boolean;
  webhooks: boolean;
  apiAccess: boolean;
  whiteLabel: boolean;
  prioritySupport: boolean;
}

// Default feature sets by plan
const PLAN_FEATURES: Record<BillingPlan, FeatureLimits> = {
  [BillingPlan.CARE]: {
    maxStorageBytes: 5 * 1024 * 1024 * 1024, // 5GB
    maxPages: 10,
    maxItems: 50,
    maxCollections: 5,
    maxSeats: 2,
    customDomains: false,
    advancedSeo: false,
    scheduledPublishing: false,
    formSubmissions: false,
    redirects: false,
    webhooks: false,
    apiAccess: false,
    whiteLabel: false,
    prioritySupport: false,
  },
  [BillingPlan.CARE_PLUS]: {
    maxStorageBytes: 25 * 1024 * 1024 * 1024, // 25GB
    maxPages: 50,
    maxItems: 200,
    maxCollections: 15,
    maxSeats: 5,
    customDomains: true,
    advancedSeo: true,
    scheduledPublishing: true,
    formSubmissions: true,
    redirects: true,
    webhooks: false,
    apiAccess: false,
    whiteLabel: false,
    prioritySupport: false,
  },
  [BillingPlan.STUDIO]: {
    maxStorageBytes: 100 * 1024 * 1024 * 1024, // 100GB
    maxPages: -1, // Unlimited
    maxItems: -1, // Unlimited
    maxCollections: -1, // Unlimited
    maxSeats: 20,
    customDomains: true,
    advancedSeo: true,
    scheduledPublishing: true,
    formSubmissions: true,
    redirects: true,
    webhooks: true,
    apiAccess: true,
    whiteLabel: true,
    prioritySupport: true,
  },
};

// Default features for inactive/no plan
const INACTIVE_FEATURES: FeatureLimits = {
  maxStorageBytes: 100 * 1024 * 1024, // 100MB
  maxPages: 3,
  maxItems: 10,
  maxCollections: 2,
  maxSeats: 1,
  customDomains: false,
  advancedSeo: false,
  scheduledPublishing: false,
  formSubmissions: false,
  redirects: false,
  webhooks: false,
  apiAccess: false,
  whiteLabel: false,
  prioritySupport: false,
};

/**
 * Gets the effective features for a tenant
 * Combines base plan features with any overrides
 */
export async function getFeatures(tenantId: string): Promise<{
  tier: BillingPlan | null;
  limits: FeatureLimits;
  overrides: Record<string, any>;
}> {
  // Get feature flags for the tenant
  const featureFlags = await prisma.featureFlags.findUnique({
    where: { tenantId },
  });

  const tier = featureFlags?.tier || null;
  const overrides = (featureFlags?.overrides as Record<string, any>) || {};

  // Get base features for the tier
  const baseFeatures = tier ? PLAN_FEATURES[tier] : INACTIVE_FEATURES;

  // Apply overrides
  const effectiveFeatures = { ...baseFeatures };
  
  // Apply any boolean overrides
  Object.entries(overrides).forEach(([key, value]) => {
    if (typeof value === 'boolean' && key in effectiveFeatures) {
      (effectiveFeatures as any)[key] = value;
    }
  });

  return {
    tier,
    limits: effectiveFeatures,
    overrides,
  };
}

/**
 * Checks if a tenant has access to a specific feature
 */
export async function hasFeature(tenantId: string, feature: keyof FeatureLimits): Promise<boolean> {
  const { limits } = await getFeatures(tenantId);
  return limits[feature] === true;
}

/**
 * Checks if a tenant is within a specific limit
 */
export async function isWithinLimit(tenantId: string, limit: keyof FeatureLimits, currentValue: number): Promise<boolean> {
  const { limits } = await getFeatures(tenantId);
  const maxValue = limits[limit];
  
  // -1 means unlimited
  if (maxValue === -1) return true;
  
  // If maxValue is a boolean, it means the feature is enabled/disabled
  if (typeof maxValue === 'boolean') return maxValue;
  
  return currentValue < maxValue;
}

/**
 * Requires a feature to be available, throws if not
 */
export async function requireFeature(tenantId: string, feature: keyof FeatureLimits): Promise<void> {
  const hasAccess = await hasFeature(tenantId, feature);
  if (!hasAccess) {
    throw new Error(`Feature '${feature}' is not available for your current plan`);
  }
}

/**
 * Requires a limit to not be exceeded, throws if exceeded
 */
export async function requireLimit(tenantId: string, limit: keyof FeatureLimits, currentValue: number): Promise<void> {
  const withinLimit = await isWithinLimit(tenantId, limit, currentValue);
  if (!withinLimit) {
    const { limits } = await getFeatures(tenantId);
    const maxValue = limits[limit];
    throw new Error(`Limit exceeded for '${limit}': ${currentValue}/${maxValue}`);
  }
}

/**
 * Gets usage statistics for a tenant
 */
export async function getTenantUsage(tenantId: string) {
  // Get current usage from the latest usage record
  const latestUsage = await prisma.tenantUsage.findFirst({
    where: { tenantId },
    orderBy: { date: 'desc' },
  });

  // Get current counts from the database
  const [pagesCount, itemsCount, collectionsCount, mediaBytes, membershipsCount] = await Promise.all([
    prisma.page.count({
      where: { tenantId, deletedAt: null },
    }),
    prisma.item.count({
      where: { tenantId, deletedAt: null },
    }),
    prisma.collection.count({
      where: { tenantId },
    }),
    prisma.media.aggregate({
      where: { tenantId, deletedAt: null },
      _sum: { size: true },
    }),
    prisma.membership.count({
      where: { tenantId },
    }),
  ]);

  return {
    pages: pagesCount,
    items: itemsCount,
    collections: collectionsCount,
    mediaBytes: mediaBytes._sum.size || 0,
    seats: membershipsCount,
    scheduledPosts: latestUsage?.scheduledPosts || 0,
  };
}

/**
 * Updates feature flags for a tenant (admin only)
 */
export async function updateFeatureFlags(
  tenantId: string,
  updates: {
    tier?: BillingPlan | null;
    overrides?: Record<string, any>;
  }
): Promise<void> {
  await prisma.featureFlags.upsert({
    where: { tenantId },
    create: {
      tenantId,
      tier: updates.tier,
      overrides: updates.overrides || {},
    },
    update: {
      tier: updates.tier,
      overrides: updates.overrides,
    },
  });
}
