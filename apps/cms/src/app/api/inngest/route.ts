import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest/client';
import { computeUsageMetrics, computeTenantUsage, checkUsageLimits } from '@/lib/inngest/functions';

// Create an API that serves all functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    computeUsageMetrics,
    computeTenantUsage,
    checkUsageLimits,
  ],
});
