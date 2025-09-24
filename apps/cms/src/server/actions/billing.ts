'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { startSubscription, getTenantBilling, attachPortalSession } from '@/server/billing/tenant';
import { BillingPlan } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { inngest } from '@/lib/inngest/client';

/**
 * Admin-only action to start billing for a tenant
 * Only Folio staff (super-admins) can trigger this
 */
export async function goLiveStartBilling({
  tenantId,
  plan,
}: {
  tenantId: string;
  plan: BillingPlan;
}) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error('Unauthorized');
  }

  // Check if user is admin of the tenant
  const membership = await prisma.membership.findUnique({
    where: {
      userId_tenantId: {
        userId,
        tenantId: orgId,
      },
    },
  });

  if (!membership || membership.role !== 'OWNER') {
    throw new Error('Only tenant owners can start billing');
  }

  // TODO: Add additional check for Folio staff
  // This could be done by checking if the user is in a special "folio-staff" organization
  // or by checking a special role/permission

  // Check if billing is already active
  const existingBilling = await prisma.tenantBilling.findUnique({
    where: { tenantId },
  });

  if (existingBilling?.status === 'ACTIVE') {
    throw new Error('Billing is already active for this tenant');
  }

  try {
    // Start the subscription
    const subscription = await startSubscription(tenantId, plan);

    // If subscription requires payment method setup, return portal URL
    if (subscription.status === 'incomplete' && subscription.latest_invoice) {
      const invoice = subscription.latest_invoice as any;
      if (invoice.payment_intent?.status === 'requires_payment_method') {
        const portalUrl = await attachPortalSession(
          tenantId,
          `${process.env.APP_BASE_URL}/settings/billing`
        );
        
        return {
          success: true,
          requiresPaymentMethod: true,
          portalUrl,
          subscriptionId: subscription.id,
        };
      }
    }

    revalidatePath('/settings/billing');
    revalidatePath('/settings');

    return {
      success: true,
      requiresPaymentMethod: false,
      subscriptionId: subscription.id,
    };
  } catch (error) {
    console.error('Error starting billing:', error);
    throw new Error('Failed to start billing. Please try again.');
  }
}

/**
 * Gets billing information for the current tenant
 */
export async function getCurrentTenantBilling() {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error('No organization selected');
  }

  return await getTenantBilling(orgId);
}

/**
 * Opens the customer portal for the current tenant
 */
export async function openCustomerPortal() {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error('No organization selected');
  }

  const returnUrl = `${process.env.APP_BASE_URL}/settings/billing`;
  const portalUrl = await attachPortalSession(orgId, returnUrl);

  return { portalUrl };
}

/**
 * Admin action to update feature flags for a tenant
 */
export async function updateTenantFeatureFlags({
  tenantId,
  tier,
  overrides,
}: {
  tenantId: string;
  tier?: BillingPlan | null;
  overrides?: Record<string, any>;
}) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error('Unauthorized');
  }

  // Check if user is admin of the tenant
  const membership = await prisma.membership.findUnique({
    where: {
      userId_tenantId: {
        userId,
        tenantId: orgId,
      },
    },
  });

  if (!membership || membership.role !== 'OWNER') {
    throw new Error('Only tenant owners can update feature flags');
  }

  // TODO: Add additional check for Folio staff

  await prisma.featureFlags.upsert({
    where: { tenantId },
    create: {
      tenantId,
      tier,
      overrides: overrides || {},
    },
    update: {
      tier,
      overrides,
    },
  });

  revalidatePath('/settings');
  revalidatePath('/settings/billing');

  return { success: true };
}

/**
 * Gets feature flags for the current tenant
 */
export async function getCurrentTenantFeatureFlags() {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error('No organization selected');
  }

  const featureFlags = await prisma.featureFlags.findUnique({
    where: { tenantId: orgId },
  });

  return featureFlags;
}

/**
 * Triggers usage computation for the current tenant
 */
export async function triggerUsageComputation() {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error('No organization selected');
  }

  // Send event to Inngest to compute usage
  await inngest.send({
    name: 'usage/compute',
    data: {
      tenantId: orgId,
    },
  });

  return { success: true };
}

/**
 * Gets usage history for the current tenant
 */
export async function getTenantUsageHistory(days: number = 30) {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error('No organization selected');
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const usageHistory = await prisma.tenantUsage.findMany({
    where: {
      tenantId: orgId,
      date: {
        gte: startDate,
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  return usageHistory;
}
