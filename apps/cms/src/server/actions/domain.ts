/**
 * Server Actions for Domain Management
 *
 * This file contains the server-side logic for managing domains, including
 * creating, verifying, and removing them. These actions are intended to be
 * called from the CMS UI.
 */
'use server';

import { z } from 'zod';
import { prisma as db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import * as vercel from '@/server/vercel';
import * as dnscheck from '@/server/dnscheck';

// ============================================================================
// ACTION: createOrAttachSiteProject
// ============================================================================

const SiteProjectSchema = z.object({
  vercelProjectId: z.string(),
  vercelProjectName: z.string(),
  siteId: z.string(),
});

export async function createOrAttachSiteProject(
  tenantId: string,
  data: z.infer<typeof SiteProjectSchema>
) {
  const { orgId } = await auth();
  if (orgId !== tenantId) {
    throw new Error('Unauthorized');
  }

  const existingProject = await db.siteProject.findUnique({
    where: { tenantId },
  });

  if (existingProject) {
    return existingProject;
  }

  const project = await db.siteProject.create({
    data: {
      tenantId,
      ...data,
    },
  });

  return project;
}

// ============================================================================
// ACTION: requestDomain
// ============================================================================

const RequestDomainSchema = z.object({
  hostname: z.string().min(3),
});

export async function requestDomain(tenantId: string, formData: FormData) {
  const { orgId } = await auth();
  if (orgId !== tenantId) {
    throw new Error('Unauthorized');
  }

  const parsed = RequestDomainSchema.safeParse({
    hostname: formData.get('hostname'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const hostname = parsed.data.hostname.toLowerCase().trim();

  // Check for duplicates
  const existingDomain = await db.domain.findFirst({
    where: { tenantId, hostname },
  });

  if (existingDomain) {
    return { error: { hostname: ['Domain already exists'] } };
  }

  // Get site project
  const siteProject = await db.siteProject.findUnique({
    where: { tenantId },
  });

  if (!siteProject) {
    throw new Error('Site project not found for this tenant');
  }

  // Create domain in DB
  const dbDomain = await db.domain.create({
    data: {
      tenantId,
      hostname,
      status: 'PENDING',
    },
  });

  try {
    // Add domain to Vercel
    const vercelDomain = await vercel.createDomain(siteProject.vercelProjectId, hostname);

    // Update domain in DB with Vercel info
    const verification = vercelDomain.verification[0];
    await db.domain.update({
      where: { id: dbDomain.id },
      data: {
        status: 'NEEDS_DNS',
        vercelDomainId: vercelDomain.apexName, // Using apexName as a stable ID
        verificationType: verification.type.toUpperCase() as 'CNAME' | 'TXT',
        verificationValue: verification.value,
      },
    });
  } catch (error: any) {
    // If Vercel API fails, update domain with error
    await db.domain.update({
      where: { id: dbDomain.id },
      data: {
        status: 'ERROR',
        error: error.message,
      },
    });
    return { error: { _form: [error.message] } };
  }

  revalidatePath(`/dashboard/${tenantId}/domains`);
  return { data: dbDomain };
}

// ============================================================================
// ACTION: checkDomain
// ============================================================================

export async function checkDomain(tenantId: string, domainId: string) {
  const { orgId } = await auth();
  if (orgId !== tenantId) {
    throw new Error('Unauthorized');
  }

  const domain = await db.domain.findUnique({
    where: { id: domainId, tenantId },
  });

  if (!domain || domain.status !== 'NEEDS_DNS') {
    return; // Or throw an error
  }

  let dnsVerified = false;
  if (domain.verificationType === 'CNAME' && domain.verificationValue) {
    const cnameRecords = await dnscheck.lookupCNAME(domain.hostname);
    // Vercel's verification value for CNAMEs might be the apex domain.
    // e.g., for www.example.com, the value could be example.com which points to Vercel.
    // A simple includes check is a good starting point.
    dnsVerified = cnameRecords.some(r => r.includes(domain.verificationValue!));
  } else if (domain.verificationType === 'TXT' && domain.verificationValue) {
    const txtRecords = await dnscheck.lookupTXT(`_vercel.${domain.hostname}`);
    dnsVerified = txtRecords.includes(domain.verificationValue);
  }

  if (!dnsVerified) {
    await db.domain.update({
      where: { id: domainId },
      data: {
        status: 'ERROR',
        error: 'DNS verification failed. Please check your DNS records.',
        lastCheckedAt: new Date(),
      },
    });
    revalidatePath(`/dashboard/${tenantId}/domains`);
    return;
  }

  // If DNS is verified, we can ask Vercel to verify.
  // This is implicit in Vercel's system. Once the DNS propagates, Vercel will verify it.
  // We'll poll the getDomainConfig endpoint to check the status.
  await db.domain.update({
    where: { id: domainId },
    data: { status: 'VERIFYING', lastCheckedAt: new Date() },
  });

  // This should ideally be a background job, but for now, we'll do a one-time check.
  try {
    const siteProject = await db.siteProject.findUnique({
      where: { tenantId },
    });
    if (!siteProject) {
      throw new Error('Site project not found for this tenant');
    }
    const domainInfo = await vercel.getDomain(siteProject.vercelProjectId, domain.hostname);

    if (domainInfo.verified) {
      await db.domain.update({
        where: { id: domainId },
        data: { status: 'ASSIGNED' },
      });
    }
  } catch (error: any) {
    await db.domain.update({
      where: { id: domainId },
      data: { status: 'ERROR', error: error.message, lastCheckedAt: new Date() },
    });
  }

  revalidatePath(`/dashboard/${tenantId}/domains`);
}

// ============================================================================
// ACTION: setPrimaryDomain
// ============================================================================

export async function setPrimaryDomain(tenantId: string, domainId: string) {
  const { orgId } = await auth();
  if (orgId !== tenantId) {
    throw new Error('Unauthorized');
  }

  await db.$transaction(async tx => {
    await tx.domain.updateMany({
      where: { tenantId, isPrimary: true },
      data: { isPrimary: false },
    });
    await tx.domain.update({
      where: { id: domainId, tenantId },
      data: { isPrimary: true },
    });
  });

  revalidatePath(`/dashboard/${tenantId}/domains`);
}

// ============================================================================
// ACTION: removeDomain
// ============================================================================

export async function removeDomain(tenantId: string, domainId: string) {
  const { orgId } = await auth();
  if (orgId !== tenantId) {
    throw new Error('Unauthorized');
  }

  const domain = await db.domain.findUnique({
    where: { id: domainId, tenantId },
  });

  if (!domain) {
    throw new Error('Domain not found');
  }

  const siteProject = await db.siteProject.findUnique({
    where: { tenantId },
  });

  if (siteProject) {
    try {
      await vercel.removeDomain(siteProject.vercelProjectId, domain.hostname);
    } catch (error: any) {
      // It might have already been removed from Vercel.
      // We can log this but proceed with deleting from our DB.
      console.warn(`Failed to remove domain from Vercel: ${error.message}`);
    }
  }

  await db.domain.delete({
    where: { id: domainId },
  });

  revalidatePath(`/dashboard/${tenantId}/domains`);
}
