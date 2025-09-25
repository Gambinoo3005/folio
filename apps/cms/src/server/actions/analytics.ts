'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const SaveAnalyticsConfigSchema = z.object({
  plausibleSite: z.string().min(1, 'Plausible site is required'),
  sentryProjectSlug: z.string().optional(),
  axiomDataset: z.string().optional(),
});

export async function saveAnalyticsConfig(formData: FormData) {
  const { orgId: tenantId } = await auth();
  if (!tenantId) {
    throw new Error('Unauthorized');
  }

  const parsed = SaveAnalyticsConfigSchema.safeParse({
    plausibleSite: formData.get('plausibleSite'),
    sentryProjectSlug: formData.get('sentryProjectSlug'),
    axiomDataset: formData.get('axiomDataset'),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.flatten().fieldErrors,
    };
  }

  const data = {
    plausibleSite: parsed.data.plausibleSite,
    sentryProjectSlug: parsed.data.sentryProjectSlug || null,
    axiomDataset: parsed.data.axiomDataset || null,
  };

  await prisma.tenantAnalyticsConfig.upsert({
    where: { tenantId },
    create: { tenantId, ...data },
    update: data,
  });

  revalidatePath('/settings');

  return {
    data,
  };
}
