/**
 * Sentry API Service
 *
 * @see https://docs.sentry.io/api/
 */
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// ============================================================================
// CONSTANTS
// ============================================================================

const SENTRY_API_BASE = 'https://sentry.io/api/0';
const SENTRY_API_TOKEN = process.env.SENTRY_API_TOKEN;
const SENTRY_ORG_SLUG = process.env.SENTRY_ORG_SLUG;

// ============================================================================
// API FETCHER
// ============================================================================

async function sentryApiFetcher(endpoint: string, options: RequestInit = {}) {
  const url = `${SENTRY_API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${SENTRY_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Sentry API Error: ${response.status} ${response.statusText}`, {
      endpoint,
      error: errorText,
    });
    throw new Error(`Sentry API request failed: ${errorText}`);
  }

  return response.json();
}

// ============================================================================
// SCHEMAS & TYPES
// ============================================================================

const IssueSchema = z.object({
  id: z.string(),
  shortId: z.string(),
  title: z.string(),
  count: z.string(),
  firstSeen: z.string(),
  lastSeen: z.string(),
  permalink: z.string(),
});

export type SentryIssue = z.infer<typeof IssueSchema>;

const StatsSchema = z.object({
  data: z.array(z.tuple([z.number(), z.array(z.object({ count: z.number() }))])),
});

interface IssuesArgs {
  tenantId: string;
  range: string; // e.g., '24h', '7d', '14d'
  projectSlug?: string;
}

// ============================================================================
// PUBLIC FUNCTIONS
// ============================================================================

export async function getIssues({
  tenantId,
  range,
  projectSlug,
}: IssuesArgs): Promise<SentryIssue[]> {
  let slug = projectSlug;
  if (!slug) {
    const config = await prisma.tenantAnalyticsConfig.findUnique({
      where: { tenantId },
    });
    slug = config?.sentryProjectSlug ?? process.env.SENTRY_PROJECT_SLUG_CMS!;
  }

  const endpoint = `/projects/${SENTRY_ORG_SLUG}/${slug}/issues/?statsPeriod=${range}&query=is:unresolved`;
  const issues = await sentryApiFetcher(endpoint);

  return z.array(IssueSchema).parse(issues);
}

export async function getStats({ tenantId, range }: Omit<IssuesArgs, 'projectSlug'>) {
  const config = await prisma.tenantAnalyticsConfig.findUnique({
    where: { tenantId },
  });
  const slug = config?.sentryProjectSlug ?? process.env.SENTRY_PROJECT_SLUG_CMS!;

  const endpoint = `/projects/${SENTRY_ORG_SLUG}/${slug}/stats/v2/?statsPeriod=${range}&field=sum(quantity)&groupBy=issue`;
  const stats = await sentryApiFetcher(endpoint);

  const parsed = StatsSchema.parse(stats);
  const totalEvents = parsed.data.reduce((sum, [, group]) => {
    return sum + group.reduce((groupSum, item) => groupSum + item.count, 0);
  }, 0);

  const issues = await getIssues({ tenantId, range, projectSlug: slug });
  const topIssue = issues.length > 0 ? issues[0] : null;

  return {
    issues: issues.length,
    events: totalEvents,
    topIssue: topIssue ? `${topIssue.shortId}: ${topIssue.title}` : null,
  };
}
