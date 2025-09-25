/**
 * Analytics Provider Smoke Test Script
 *
 * To run this script:
 * 1. Make sure you have ts-node installed (`pnpm add -g ts-node`)
 * 2. Ensure your .env.local file in `apps/cms` is populated with valid keys.
 * 3. Run from the root of the monorepo:
 *    `ts-node --require dotenv/config apps/cms/src/scripts/test-analytics.ts`
 */
import { getTraffic } from '../server/analytics/plausible';
import { getIssues, getStats } from '../server/analytics/sentry';
import { querySummary } from '../server/analytics/axiom';

// --- CONFIGURATION ---
// Replace with a tenantId that has analytics configured
const TEST_TENANT_ID = process.env.DEV_TENANT_ID || 'org_2i5b1i5v9b1v5i1v5i1v5i1v5';

// Use Plausible's demo site for an easy test
const PLAUSIBLE_DEMO_SITE = 'plausible.io';

async function testPlausible() {
  console.log('--- Testing Plausible ---');
  try {
    const traffic = await getTraffic({
      tenantId: TEST_TENANT_ID,
      range: '7d',
      site: PLAUSIBLE_DEMO_SITE,
    });
    console.log('Plausible traffic data fetched successfully.');
    console.log('Timeseries points:', traffic.timeseries.length);
    console.log('Top page:', traffic.pages[0]);
    console.log('Top referrer:', traffic.referrers[0]);
    console.log('Top country:', traffic.geo[0]);
  } catch (error) {
    console.error('Plausible test failed:', error);
  }
}

async function testSentry() {
  console.log('\n--- Testing Sentry ---');
  try {
    const issues = await getIssues({
      tenantId: TEST_TENANT_ID,
      range: '14d',
    });
    console.log('Sentry issues fetched successfully.');
    console.log('Total issues:', issues.length);
    if (issues.length > 0) {
      console.log('Latest issue:', issues[0].title);
    }

    const stats = await getStats({
      tenantId: TEST_TENANT_ID,
      range: '14d',
    });
    console.log('Sentry stats fetched successfully:', stats);
  } catch (error) {
    console.error('Sentry test failed:', error);
  }
}

async function testAxiom() {
  console.log('\n--- Testing Axiom ---');
  try {
    const summary = await querySummary({
      tenantId: TEST_TENANT_ID,
      range: '7d',
    });
    console.log('Axiom summary fetched successfully:', summary);
  } catch (error) {
    console.error('Axiom test failed:', error);
  }
}

async function main() {
  console.log('Starting analytics provider smoke tests...');
  await testPlausible();
  await testSentry();
  await testAxiom();
  console.log('\nTests finished.');
}

main();
