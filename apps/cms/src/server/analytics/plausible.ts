/**
 * Plausible Analytics API Service
 *
 * @see https://plausible.io/docs/stats-api
 */
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// ============================================================================
// CONSTANTS
// ============================================================================

const PLAUSIBLE_API_BASE = process.env.PLAUSIBLE_API_BASE;
const PLAUSIBLE_API_KEY = process.env.PLAUSIBLE_API_KEY;

// ============================================================================
// API FETCHER
// ============================================================================

async function plausibleApiFetcher(endpoint: string, params: Record<string, string>) {
  const url = new URL(`${PLAUSIBLE_API_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${PLAUSIBLE_API_KEY}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Plausible API Error: ${response.status} ${response.statusText}`, {
      endpoint,
      error: errorText,
    });
    throw new Error(`Plausible API request failed: ${errorText}`);
  }

  return response.json();
}

// ============================================================================
// SCHEMAS & TYPES
// ============================================================================

const TimeseriesResultSchema = z.object({
  results: z.array(
    z.object({
      date: z.string(),
      visits: z.number(),
      pageviews: z.number().optional(), // Not always present
    })
  ),
});

const BreakdownResultSchema = z.object({
  results: z.array(
    z.object({
      page: z.string().optional(),
      source: z.string().optional(),
      country: z.string().optional(),
      visits: z.number(),
    })
  ),
});

interface TrafficArgs {
  tenantId: string;
  range: string; // e.g., '7d', '30d', '6mo', '12mo'
  site?: string;
}

// ============================================================================
// PUBLIC FUNCTIONS
// ============================================================================

export async function getTraffic({ tenantId, range, site }: TrafficArgs) {
  let plausibleSite = site;
  if (!plausibleSite) {
    const config = await prisma.tenantAnalyticsConfig.findUnique({
      where: { tenantId },
    });
    if (!config || !config.plausibleSite) {
      throw new Error('Plausible site not configured for this tenant');
    }
    plausibleSite = config.plausibleSite;
  }

  const commonParams = {
    site_id: plausibleSite,
    period: range,
  };

  const [timeseries, pages, referrers, countries] = await Promise.all([
    plausibleApiFetcher('/stats/timeseries', { ...commonParams, metrics: 'visits,pageviews' }),
    plausibleApiFetcher('/stats/breakdown', { ...commonParams, property: 'event:page' }),
    plausibleApiFetcher('/stats/breakdown', { ...commonParams, property: 'visit:source' }),
    plausibleApiFetcher('/stats/breakdown', { ...commonParams, property: 'visit:country' }),
  ]);

  return {
    timeseries: TimeseriesResultSchema.parse(timeseries).results,
    pages: BreakdownResultSchema.parse(pages).results,
    referrers: BreakdownResultSchema.parse(referrers).results,
    geo: BreakdownResultSchema.parse(countries).results,
  };
}
