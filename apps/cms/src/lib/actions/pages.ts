'use server'

import { PrismaClient } from '@prisma/client'
import { getValidatedTenantId } from '@/lib/tenant'
import { requireWritePermission } from '@/lib/rbac'
import { type PageListItem } from '@/lib/validation'

const prisma = new PrismaClient()

export async function getPages(): Promise<PageListItem[]> {
  try {
    const tenantId = await getValidatedTenantId()
    
    const pages = await prisma.page.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        publishedAt: true,
        updatedAt: true,
        updatedBy: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
    
    return pages
    
  } catch (error) {
    console.error('Failed to fetch pages:', error)
    return []
  }
}

export async function createPage(data: {
  title: string
  slug: string
  body: Record<string, unknown>
  seoTitle?: string
  seoDescription?: string
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // Require write permission (EDITOR or higher)
    const userRole = await requireWritePermission()
    const tenantId = await getValidatedTenantId()
    
    const page = await prisma.page.create({
      data: {
        tenantId,
        title: data.title,
        slug: data.slug,
        body: data.body as any,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        updatedBy: userRole.userId,
      },
    })
    
    return { success: true, id: page.id }
    
  } catch (error) {
    console.error('Failed to create page:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Insufficient permissions')) {
        return { success: false, error: 'You do not have permission to create pages' }
      }
      if (error.message.includes('Authentication required')) {
        return { success: false, error: 'Authentication required' }
      }
    }
    
    return { success: false, error: 'Failed to create page' }
  }
}
