'use server'

import { PrismaClient } from '@prisma/client'
import { getValidatedTenantId } from '@/lib/tenant'
import { requireWritePermission } from '@/lib/rbac'
import { type CollectionListItem, type ItemListItem } from '@/lib/validation'

const prisma = new PrismaClient()

export async function getCollections(): Promise<CollectionListItem[]> {
  try {
    const tenantId = await getValidatedTenantId()
    
    const collections = await prisma.collection.findMany({
      where: {
        tenantId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            items: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })
    
    return collections.map(collection => ({
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      itemCount: collection._count.items,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
    }))
    
  } catch (error) {
    console.error('Failed to fetch collections:', error)
    return []
  }
}

export async function getCollectionItems(collectionSlug: string): Promise<ItemListItem[]> {
  try {
    const tenantId = await getValidatedTenantId()
    
    // First, find the collection
    const collection = await prisma.collection.findFirst({
      where: {
        tenantId,
        slug: collectionSlug,
      },
      select: {
        id: true,
      },
    })
    
    if (!collection) {
      return []
    }
    
    // Get items for this collection
    const items = await prisma.item.findMany({
      where: {
        tenantId,
        collectionId: collection.id,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        collectionId: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
    
    return items
    
  } catch (error) {
    console.error('Failed to fetch collection items:', error)
    return []
  }
}

export async function createCollection(data: {
  name: string
  slug: string
  config: Record<string, unknown>
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // Require write permission (EDITOR or higher)
    await requireWritePermission()
    const tenantId = await getValidatedTenantId()
    
    const collection = await prisma.collection.create({
      data: {
        tenantId,
        name: data.name,
        slug: data.slug,
        config: data.config as any,
      },
    })
    
    return { success: true, id: collection.id }
    
  } catch (error) {
    console.error('Failed to create collection:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Insufficient permissions')) {
        return { success: false, error: 'You do not have permission to create collections' }
      }
      if (error.message.includes('Authentication required')) {
        return { success: false, error: 'Authentication required' }
      }
    }
    
    return { success: false, error: 'Failed to create collection' }
  }
}
