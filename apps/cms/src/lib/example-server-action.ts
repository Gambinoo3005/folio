'use server'

import { getValidatedTenantId, TENANT_TAG } from '@/lib/tenant'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Example server action demonstrating how to use tenant resolution helpers.
 * This shows the typical pattern for server actions that need tenant isolation.
 */
export async function getTenantPages() {
  try {
    // Get the validated tenant ID (resolves from Clerk org + asserts access)
    const tenantId = await getValidatedTenantId()
    
    // Query pages for this specific tenant
    const pages = await prisma.page.findMany({
      where: {
        tenantId,
        deletedAt: null, // Exclude soft-deleted pages
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
    
    // Generate cache tag for revalidation
    const cacheTag = TENANT_TAG(tenantId)
    
    return {
      success: true,
      data: pages,
      cacheTag,
      tenantId,
    }
    
  } catch (error) {
    console.error('Failed to fetch tenant pages:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Example server action for creating a new page with tenant isolation.
 */
export async function createPage(data: {
  title: string
  slug: string
  body: any
  seoTitle?: string
  seoDescription?: string
}) {
  try {
    // Get the validated tenant ID
    const tenantId = await getValidatedTenantId()
    
    // Create the page with tenant isolation
    const page = await prisma.page.create({
      data: {
        tenantId,
        title: data.title,
        slug: data.slug,
        body: data.body,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        status: 'DRAFT',
      },
    })
    
    // Generate cache tag for revalidation
    const cacheTag = TENANT_TAG(tenantId)
    
    return {
      success: true,
      data: page,
      cacheTag,
      tenantId,
    }
    
  } catch (error) {
    console.error('Failed to create page:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
