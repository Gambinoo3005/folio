import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest/client';
import {
  computeUsageMetrics,
  computeTenantUsage,
  checkUsageLimits,
  checkPendingDomains,
} from '@/lib/inngest/functions';
import {
  plausibleRollup,
  sentryRollup,
  axiomRollup,
} from '@/lib/inngest/analytics';

// Create an API that serves all functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    computeUsageMetrics,
    computeTenantUsage,
    checkUsageLimits,
    checkPendingDomains,
    plausibleRollup,
    sentryRollup,
    axiomRollup,
  ],
});
