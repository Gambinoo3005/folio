// Dashboard data adapters - Phase 6: Live data from Prisma

import { PrismaClient } from '@prisma/client'
import { getValidatedTenantId } from '@/lib/tenant'

const prisma = new PrismaClient()

export interface RecentEdit {
  id: string;
  type: 'page' | 'item' | 'global';
  title: string;
  action: 'created' | 'updated' | 'published';
  timestamp: Date;
  author: string;
  url?: string;
}

export interface UsageStats {
  pages: {
    total: number;
    published: number;
    drafts: number;
  };
  items: {
    total: number;
    published: number;
    drafts: number;
  };
  media: {
    total: number;
    totalSize: number; // in bytes
  };
  collections: {
    total: number;
  };
}

export interface PublishingStatus {
  lastPublish: {
    timestamp: Date;
    item: string;
    type: 'page' | 'item';
  } | null;
  draftCount: number;
  publishedCount: number;
}

// Real data adapters using Prisma
export const getRecentEdits = async (): Promise<RecentEdit[]> => {
  try {
    const tenantId = await getValidatedTenantId()
    
    // Get recent pages
    const recentPages = await prisma.page.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        updatedAt: true,
        updatedBy: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 3,
    })
    
    // Get recent items
    const recentItems = await prisma.item.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        updatedAt: true,
        collection: {
          select: {
            slug: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 3,
    })
    
    // Get recent globals
    const recentGlobals = await prisma.global.findMany({
      where: {
        tenantId,
      },
      select: {
        id: true,
        key: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 2,
    })
    
    // Combine and format the results
    const recentEdits: RecentEdit[] = [
      ...recentPages.map(page => ({
        id: page.id,
        type: 'page' as const,
        title: page.title,
        action: page.status === 'PUBLISHED' ? 'published' as const : 'updated' as const,
        timestamp: page.updatedAt,
        author: page.updatedBy || 'Unknown',
        url: `/${page.slug}`,
      })),
      ...recentItems.map(item => ({
        id: item.id,
        type: 'item' as const,
        title: item.title,
        action: item.status === 'PUBLISHED' ? 'published' as const : 'updated' as const,
        timestamp: item.updatedAt,
        author: 'Unknown', // Items don't have updatedBy field yet
        url: `/${item.collection.slug}/${item.slug}`,
      })),
      ...recentGlobals.map(global => ({
        id: global.id,
        type: 'global' as const,
        title: global.key,
        action: 'updated' as const,
        timestamp: global.updatedAt,
        author: 'Unknown',
      })),
    ]
    
    // Sort by timestamp and take top 5
    return recentEdits
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5)
      
  } catch (error) {
    console.error('Failed to fetch recent edits:', error)
    return []
  }
}

export const getUsageStats = async (): Promise<UsageStats> => {
  try {
    const tenantId = await getValidatedTenantId()
    
    // Get page counts
    const [totalPages, publishedPages, draftPages] = await Promise.all([
      prisma.page.count({
        where: { tenantId, deletedAt: null },
      }),
      prisma.page.count({
        where: { tenantId, status: 'PUBLISHED', deletedAt: null },
      }),
      prisma.page.count({
        where: { tenantId, status: 'DRAFT', deletedAt: null },
      }),
    ])
    
    // Get item counts
    const [totalItems, publishedItems, draftItems] = await Promise.all([
      prisma.item.count({
        where: { tenantId, deletedAt: null },
      }),
      prisma.item.count({
        where: { tenantId, status: 'PUBLISHED', deletedAt: null },
      }),
      prisma.item.count({
        where: { tenantId, status: 'DRAFT', deletedAt: null },
      }),
    ])
    
    // Get media stats
    const [totalMedia, mediaSizeResult] = await Promise.all([
      prisma.media.count({
        where: { tenantId, deletedAt: null },
      }),
      prisma.media.aggregate({
        where: { tenantId, deletedAt: null },
        _sum: { size: true },
      }),
    ])
    
    // Get collection count
    const totalCollections = await prisma.collection.count({
      where: { tenantId },
    })
    
    return {
      pages: {
        total: totalPages,
        published: publishedPages,
        drafts: draftPages,
      },
      items: {
        total: totalItems,
        published: publishedItems,
        drafts: draftItems,
      },
      media: {
        total: totalMedia,
        totalSize: mediaSizeResult._sum.size || 0,
      },
      collections: {
        total: totalCollections,
      },
    }
    
  } catch (error) {
    console.error('Failed to fetch usage stats:', error)
    return {
      pages: { total: 0, published: 0, drafts: 0 },
      items: { total: 0, published: 0, drafts: 0 },
      media: { total: 0, totalSize: 0 },
      collections: { total: 0 },
    }
  }
}

export const getPublishingStatus = async (): Promise<PublishingStatus> => {
  try {
    const tenantId = await getValidatedTenantId()
    
    // Get latest publish log entry
    const latestPublishLog = await prisma.publishLog.findFirst({
      where: { tenantId },
      orderBy: { at: 'desc' },
      select: {
        at: true,
        targetType: true,
        targetId: true,
      },
    })
    
    // Get draft and published counts
    const [draftPages, draftItems, publishedPages, publishedItems] = await Promise.all([
      prisma.page.count({
        where: { tenantId, status: 'DRAFT', deletedAt: null },
      }),
      prisma.item.count({
        where: { tenantId, status: 'DRAFT', deletedAt: null },
      }),
      prisma.page.count({
        where: { tenantId, status: 'PUBLISHED', deletedAt: null },
      }),
      prisma.item.count({
        where: { tenantId, status: 'PUBLISHED', deletedAt: null },
      }),
    ])
    
    const draftCount = draftPages + draftItems
    const publishedCount = publishedPages + publishedItems
    
    // Format the last publish info if available
    let lastPublish = null
    if (latestPublishLog) {
      // For now, we'll use a generic item name since we don't have the actual title
      // In a real implementation, you'd join with the actual content tables
      lastPublish = {
        timestamp: latestPublishLog.at,
        item: `${latestPublishLog.targetType} ${latestPublishLog.targetId.slice(0, 8)}`,
        type: latestPublishLog.targetType.toLowerCase() as 'page' | 'item',
      }
    }
    
    return {
      lastPublish,
      draftCount,
      publishedCount,
    }
    
  } catch (error) {
    console.error('Failed to fetch publishing status:', error)
    return {
      lastPublish: null,
      draftCount: 0,
      publishedCount: 0,
    }
  }
}
