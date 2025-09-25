/**
 * Inngest functions for analytics rollups
 */
import { inngest } from './client';
import { prisma } from '@/lib/prisma';
import * as plausible from '@/server/analytics/plausible';
import * as sentry from '@/server/analytics/sentry';
import * as axiom from '@/server/analytics/axiom';

const EVERY_DAY_AT_2AM = '0 2 * * *';

/**
 * Plausible Rollup Job
 * Runs daily to fetch traffic data and store it in our DB.
 */
export const plausibleRollup = inngest.createFunction(
  { id: 'plausible-rollup-cron' },
  { cron: EVERY_DAY_AT_2AM },
  async ({ step }) => {
    const tenants = await step.run('get-tenants-with-plausible', async () => {
      return prisma.tenantAnalyticsConfig.findMany({
        where: { plausibleSite: { not: null as any } },
      });
    });

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const date = yesterday.toISOString().split('T')[0];

    for (const config of tenants) {
      await step.run(`rollup-plausible-${config.tenantId}`, async () => {
        const stats = await plausible.getTraffic({
          tenantId: config.tenantId,
          range: 'custom',
          site: `${config.plausibleSite}&date=${date}`, // Plausible API quirk for single day
        });

        // Simplified summary for now. A real implementation might be more robust.
        const summary = {
          visits: stats.timeseries[0]?.visits || 0,
          pageviews: stats.timeseries[0]?.pageviews || 0,
          topPageSlug: stats.pages[0]?.page || null,
          topReferrer: stats.referrers[0]?.source || null,
        };

        await prisma.analyticsDaily.upsert({
          where: {
            tenantId_date_source: {
              tenantId: config.tenantId,
              date: yesterday,
              source: 'PLAUSIBLE',
            },
          },
          create: {
            tenantId: config.tenantId,
            date: yesterday,
            source: 'PLAUSIBLE',
            ...summary,
          },
          update: summary,
        });

        return { tenantId: config.tenantId, ...summary };
      });
    }

    return { count: tenants.length };
  }
);

/**
 * Sentry Rollup Job
 * Runs daily to fetch error data and store it in our DB.
 */
export const sentryRollup = inngest.createFunction(
  { id: 'sentry-rollup-cron' },
  { cron: EVERY_DAY_AT_2AM },
  async ({ step }) => {
    const tenants = await step.run('get-all-tenants', () => prisma.tenant.findMany());

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    for (const tenant of tenants) {
      await step.run(`rollup-sentry-${tenant.id}`, async () => {
        const stats = await sentry.getStats({ tenantId: tenant.id, range: '24h' });

        await prisma.errorDaily.upsert({
          where: { tenantId_date: { tenantId: tenant.id, date: yesterday } },
          create: { tenantId: tenant.id, date: yesterday, ...stats },
          update: stats,
        });

        return { tenantId: tenant.id, ...stats };
      });
    }

    return { count: tenants.length };
  }
);

/**
 * Axiom Rollup Job
 * Runs daily to fetch log data and store it in our DB.
 */
export const axiomRollup = inngest.createFunction(
  { id: 'axiom-rollup-cron' },
  { cron: EVERY_DAY_AT_2AM },
  async ({ step }) => {
    const tenants = await step.run('get-all-tenants', () => prisma.tenant.findMany());

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    for (const tenant of tenants) {
      await step.run(`rollup-axiom-${tenant.id}`, async () => {
        const stats = await axiom.querySummary({ tenantId: tenant.id, range: '1d' });

        await prisma.logDaily.upsert({
          where: { tenantId_date: { tenantId: tenant.id, date: yesterday } },
          create: {
            tenantId: tenant.id,
            date: yesterday,
            errors: stats.errors,
            warns: stats.warns,
            requests: stats.requests,
            p95LatencyMs: stats.p95,
          },
          update: {
            errors: stats.errors,
            warns: stats.warns,
            requests: stats.requests,
            p95LatencyMs: stats.p95,
          },
        });

        return { tenantId: tenant.id, ...stats };
      });
    }

    return { count: tenants.length };
  }
);
