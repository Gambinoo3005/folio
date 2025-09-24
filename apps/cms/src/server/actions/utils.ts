/**
 * Utility functions for server actions
 */

import { revalidateTag } from 'next/cache'
import { PrismaClient } from '@prisma/client'
import { getValidatedTenantId, TENANT_TAG } from '@/lib/tenant'

const prisma = new PrismaClient()

/**
 * Get a validated Prisma client instance with tenant context
 */
export async function getPrismaWithTenant() {
  const tenantId = await getValidatedTenantId()
  return { prisma, tenantId }
}

/**
 * Create cache tags for different entity types
 */
export function createCacheTags(tenantId: string, entityType: string, slug?: string) {
  const tags = [TENANT_TAG(tenantId)]
  
  if (slug) {
    tags.push(`${entityType}:slug:${slug}`)
  }
  
  return tags
}

/**
 * Revalidate cache tags for a tenant
 */
export function revalidateTenantCache(tenantId: string, entityType: string, slug?: string) {
  const tags = createCacheTags(tenantId, entityType, slug)
  
  // Revalidate all tags
  tags.forEach(tag => {
    revalidateTag(tag)
  })
  
  return tags
}

/**
 * Log a publish action to the database
 */
export async function logPublishAction(
  tenantId: string,
  targetType: 'PAGE' | 'ITEM' | 'GLOBAL',
  targetId: string,
  action: 'PUBLISH' | 'UNPUBLISH',
  actorId?: string,
  notes?: string
) {
  try {
    await prisma.publishLog.create({
      data: {
        tenantId,
        actorId,
        targetType,
        targetId,
        action,
        notes,
      },
    })
  } catch (error) {
    console.error('Failed to log publish action:', error)
    // Don't throw - logging failure shouldn't break the main operation
  }
}

/**
 * Check if a slug is unique within a tenant for a specific entity type
 */
export async function isSlugUnique(
  tenantId: string,
  slug: string,
  entityType: 'page' | 'collection' | 'item',
  excludeId?: string,
  collectionId?: string // For items
): Promise<boolean> {
  try {
    let whereClause: any = {
      tenantId,
      slug,
      deletedAt: null,
    }

    // Exclude current entity when updating
    if (excludeId) {
      whereClause.id = { not: excludeId }
    }

    // For items, also check collectionId
    if (entityType === 'item' && collectionId) {
      whereClause.collectionId = collectionId
    }

    let count = 0
    switch (entityType) {
      case 'page':
        count = await prisma.page.count({ where: whereClause })
        break
      case 'collection':
        count = await prisma.collection.count({ where: whereClause })
        break
      case 'item':
        count = await prisma.item.count({ where: whereClause })
        break
    }

    return count === 0
  } catch (error) {
    console.error('Failed to check slug uniqueness:', error)
    return false
  }
}

/**
 * Generate a unique slug by appending a number if needed
 */
export async function generateUniqueSlug(
  tenantId: string,
  baseSlug: string,
  entityType: 'page' | 'collection' | 'item',
  excludeId?: string,
  collectionId?: string
): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (!(await isSlugUnique(tenantId, slug, entityType, excludeId, collectionId))) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}
