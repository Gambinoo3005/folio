import { CmsLayoutEmpty } from '@/components/cms-layout';
import { prisma as db } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { DomainsClient } from './domains-client';

interface DomainsPageProps {
  params: {
    tenantId: string;
  };
}

// This is a server component to fetch initial data
export default async function DomainsPage({ params }: DomainsPageProps) {
  const { orgId } = await auth();
  if (orgId !== params.tenantId) {
    return <CmsLayoutEmpty>Unauthorized</CmsLayoutEmpty>;
  }

  const domains = await db.domain.findMany({
    where: { tenantId: params.tenantId },
    orderBy: { createdAt: 'asc' },
  });

  return <DomainsClient domains={domains} tenantId={params.tenantId} />;
}
