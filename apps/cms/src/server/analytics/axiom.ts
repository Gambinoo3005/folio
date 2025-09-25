/**
 * Axiom API Service
 *
 * @see https://axiom.co/docs/reference/api
 */
import { prisma } from '@/lib/prisma';

// ============================================================================
// CONSTANTS
// ============================================================================

const AXIOM_API_BASE = 'https://api.axiom.co';
const AXIOM_TOKEN = process.env.AXIOM_TOKEN;
const AXIOM_DATASET = process.env.AXIOM_DATASET;

// ============================================================================
// API FETCHER
// ============================================================================

async function axiomApiFetcher(dataset: string, aplQuery: string) {
  const url = `${AXIOM_API_BASE}/v1/datasets/${dataset}/apl`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AXIOM_TOKEN}`,
    },
    body: JSON.stringify({ apl: aplQuery }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Axiom API Error: ${response.status} ${response.statusText}`, {
      dataset,
      error: errorText,
    });
    throw new Error(`Axiom API request failed: ${errorText}`);
  }

  return response.json();
}

// ============================================================================
// PUBLIC FUNCTIONS
// ============================================================================

interface QuerySummaryArgs {
  tenantId: string;
  range: string; // e.g., '1d', '7d', '30d'
}

export async function querySummary({ tenantId, range }: QuerySummaryArgs) {
  const config = await prisma.tenantAnalyticsConfig.findUnique({
    where: { tenantId },
  });
  const dataset = config?.axiomDataset ?? AXIOM_DATASET!;

  const baseQuery = `['${dataset}'] | where tenantId == '${tenantId}' and _time > now(-${range})`;

  const queries = {
    errors: `${baseQuery} | where severity == 'error' | count`,
    warns: `${baseQuery} | where severity == 'warn' | count`,
    requests: `${baseQuery} | where route != null | count`,
    p95LatencyMs: `${baseQuery} | summarize p95=percentile(duration, 95) by bin(1h)`,
  };

  // Note: Axiom's free tier may not support concurrent queries.
  // In a real-world scenario on a paid plan, Promise.all would be more efficient.
  const results: any = {};
  for (const [key, query] of Object.entries(queries)) {
    try {
      const response = await axiomApiFetcher(dataset, query);
      if (key === 'p95LatencyMs') {
        // Find the most recent p95 value
        const latestP95 = response.buckets?.series?.[0]?.p95.pop();
        results[key] = latestP95 ? Math.round(latestP95) : null;
      } else {
        results[key] = response.totals?.count || 0;
      }
    } catch (error) {
      console.error(`Axiom query for ${key} failed:`, error);
      results[key] = key === 'p95LatencyMs' ? null : 0;
    }
  }

  return {
    errors: results.errors,
    warns: results.warns,
    requests: results.requests,
    p95: results.p95LatencyMs,
  };
}
