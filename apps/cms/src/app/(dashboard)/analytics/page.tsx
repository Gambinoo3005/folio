import { CmsLayout, CmsLayoutEmpty } from '@/components/cms-layout';
import { auth } from '@clerk/nextjs/server';
import { AnalyticsClient } from './analytics-client';
import { prisma } from '@/lib/prisma';
import { OrganizationSetup } from '@/components/organization-setup';

export default async function AnalyticsPage() {
  const { orgId: tenantId } = await auth();

  if (!tenantId) {
    return (
      <CmsLayout>
        <OrganizationSetup />
      </CmsLayout>
    );
  }

  // We can pass initial data to the client component here if needed
  // For now, we'll just pass the tenantId and let the client fetch.
  return <AnalyticsClient tenantId={tenantId} />;
}
