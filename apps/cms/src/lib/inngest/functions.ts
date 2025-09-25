import { inngest } from './client';
import { prisma } from '@/lib/prisma';
import { checkDomain } from '@/server/actions/domain';

/**
 * Nightly job to compute and store usage metrics for all tenants
 */
export const computeUsageMetrics = inngest.createFunction(
  { id: 'compute-usage-metrics' },
  { cron: '0 2 * * *' }, // Run daily at 2 AM
  async ({ event, step }) => {
    console.log('Starting nightly usage metrics computation');

    // Get all active tenants
    const tenants = await step.run('get-tenants', async () => {
      return await prisma.tenant.findMany({
        select: { id: true, name: true },
      });
    });

    console.log(`Processing usage metrics for ${tenants.length} tenants`);

    // Process each tenant
    for (const tenant of tenants) {
      await step.run(`compute-usage-${tenant.id}`, async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of day

        // Get current usage counts
        const [pagesCount, itemsCount, collectionsCount, mediaBytes, membershipsCount] = await Promise.all([
          prisma.page.count({
            where: { tenantId: tenant.id, deletedAt: null },
          }),
          prisma.item.count({
            where: { tenantId: tenant.id, deletedAt: null },
          }),
          prisma.collection.count({
            where: { tenantId: tenant.id },
          }),
          prisma.media.aggregate({
            where: { tenantId: tenant.id, deletedAt: null },
            _sum: { size: true },
          }),
          prisma.membership.count({
            where: { tenantId: tenant.id },
          }),
        ]);

        // Count scheduled posts (items with future publishedAt)
        const scheduledPostsCount = await prisma.item.count({
          where: {
            tenantId: tenant.id,
            publishedAt: {
              gt: today,
            },
            deletedAt: null,
          },
        });

        // Upsert usage record for today
        await prisma.tenantUsage.upsert({
          where: {
            tenantId_date: {
              tenantId: tenant.id,
              date: today,
            },
          },
          create: {
            tenantId: tenant.id,
            date: today,
            mediaBytes: mediaBytes._sum.size || 0,
            itemsCount,
            seatsCount: membershipsCount,
            scheduledPosts: scheduledPostsCount,
          },
          update: {
            mediaBytes: mediaBytes._sum.size || 0,
            itemsCount,
            seatsCount: membershipsCount,
            scheduledPosts: scheduledPostsCount,
          },
        });

        console.log(`Updated usage metrics for tenant ${tenant.id}:`, {
          pages: pagesCount,
          items: itemsCount,
          collections: collectionsCount,
          mediaBytes: mediaBytes._sum.size || 0,
          seats: membershipsCount,
          scheduledPosts: scheduledPostsCount,
        });
      });
    }

    console.log('Completed nightly usage metrics computation');
    return { processedTenants: tenants.length };
  }
);

/**
 * Function to compute usage metrics for a specific tenant
 * Can be triggered manually or by events
 */
export const computeTenantUsage = inngest.createFunction(
  { id: 'compute-tenant-usage' },
  { event: 'usage/compute' },
  async ({ event, step }) => {
    const { tenantId } = event.data;

    if (!tenantId) {
      throw new Error('tenantId is required');
    }

    console.log(`Computing usage metrics for tenant: ${tenantId}`);

    const usage = await step.run('compute-usage', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get current usage counts
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

      // Count scheduled posts
      const scheduledPostsCount = await prisma.item.count({
        where: {
          tenantId,
          publishedAt: {
            gt: today,
          },
          deletedAt: null,
        },
      });

      // Upsert usage record
      await prisma.tenantUsage.upsert({
        where: {
          tenantId_date: {
            tenantId,
            date: today,
          },
        },
        create: {
          tenantId,
          date: today,
          mediaBytes: mediaBytes._sum.size || 0,
          itemsCount,
          seatsCount: membershipsCount,
          scheduledPosts: scheduledPostsCount,
        },
        update: {
          mediaBytes: mediaBytes._sum.size || 0,
          itemsCount,
          seatsCount: membershipsCount,
          scheduledPosts: scheduledPostsCount,
        },
      });

      return {
        pages: pagesCount,
        items: itemsCount,
        collections: collectionsCount,
        mediaBytes: mediaBytes._sum.size || 0,
        seats: membershipsCount,
        scheduledPosts: scheduledPostsCount,
      };
    });

    console.log(`Usage metrics computed for tenant ${tenantId}:`, usage);
    return { tenantId, usage };
  }
);

/**
 * Function to send usage alerts when limits are approached
 */
export const checkUsageLimits = inngest.createFunction(
  { id: 'check-usage-limits' },
  { cron: '0 9 * * *' }, // Run daily at 9 AM
  async ({ event, step }) => {
    console.log('Checking usage limits for all tenants');

    // Get all tenants with active billing
    const tenants = await step.run('get-active-tenants', async () => {
      return await prisma.tenantBilling.findMany({
        where: {
          status: 'ACTIVE',
        },
        include: {
          tenant: {
            select: { id: true, name: true },
          },
        },
      });
    });

    for (const billing of tenants) {
      await step.run(`check-limits-${billing.tenantId}`, async () => {
        // Get latest usage
        const latestUsage = await prisma.tenantUsage.findFirst({
          where: { tenantId: billing.tenantId },
          orderBy: { date: 'desc' },
        });

        if (!latestUsage) {
          return;
        }

        // Get plan features
        const featureFlags = await prisma.featureFlags.findUnique({
          where: { tenantId: billing.tenantId },
        });

        const plan = billing.plan || featureFlags?.tier;
        if (!plan) {
          return;
        }

        // Check limits based on plan
        const limits = {
          [billing.plan === 'CARE' ? 'CARE' : billing.plan === 'CARE_PLUS' ? 'CARE_PLUS' : 'STUDIO']: {
            maxStorageBytes: billing.plan === 'CARE' ? 5 * 1024 * 1024 * 1024 : 
                           billing.plan === 'CARE_PLUS' ? 25 * 1024 * 1024 * 1024 : 
                           100 * 1024 * 1024 * 1024,
            maxSeats: billing.plan === 'CARE' ? 2 : billing.plan === 'CARE_PLUS' ? 5 : 20,
          }
        };

        const planLimits = limits[plan as keyof typeof limits];
        if (!planLimits) return;

        // Check if approaching limits (80% threshold)
        const storageThreshold = planLimits.maxStorageBytes * 0.8;
        const seatsThreshold = planLimits.maxSeats * 0.8;

        const alerts = [];

        if (latestUsage.mediaBytes > storageThreshold) {
          alerts.push({
            type: 'storage',
            current: latestUsage.mediaBytes,
            limit: planLimits.maxStorageBytes,
            percentage: Number(latestUsage.mediaBytes) / Number(planLimits.maxStorageBytes) * 100,
          });
        }

        if (latestUsage.seatsCount > seatsThreshold) {
          alerts.push({
            type: 'seats',
            current: latestUsage.seatsCount,
            limit: planLimits.maxSeats,
            percentage: (latestUsage.seatsCount / planLimits.maxSeats) * 100,
          });
        }

        if (alerts.length > 0) {
          console.log(`Usage alerts for tenant ${billing.tenantId}:`, alerts);
          // TODO: Send email notifications or create in-app notifications
        }
      });
    }

    return { checkedTenants: tenants.length };
  }
);

export const checkPendingDomains = inngest.createFunction(
  { id: 'check-pending-domains-cron' },
  { cron: '*/15 * * * *' }, // Every 15 minutes
  async () => {
    const domainsToCHeck = await prisma.domain.findMany({
      where: {
        OR: [{ status: 'NEEDS_DNS' }, { status: 'VERIFYING' }],
      },
    });

    for (const domain of domainsToCHeck) {
      try {
        await checkDomain(domain.tenantId, domain.id);
      } catch (error) {
        console.error(`Failed to check domain ${domain.hostname}:`, error);
      }
    }

    return {
      message: `Checked ${domainsToCHeck.length} domains.`,
    };
  }
);
