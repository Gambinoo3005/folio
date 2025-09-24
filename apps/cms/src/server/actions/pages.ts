'use server'

import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { 
  PageCreateSchema, 
  PageUpdateSchema, 
  type PageCreateInput, 
  type PageUpdateInput 
} from '@/lib/validation'
import { 
  getPrismaWithTenant, 
  revalidateTenantCache, 
  logPublishAction, 
  generateUniqueSlug 
} from './utils'
import { createSuccessResult, createErrorResult, createValidationErrorResult, type ActionResult } from './types'

const prisma = new PrismaClient()

/**
 * Create a new page
 */
export async function createPage(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    // Validate input
    const validatedInput = PageCreateSchema.parse(input)
    const { prisma, tenantId } = await getPrismaWithTenant()

    // Generate unique slug
    const uniqueSlug = await generateUniqueSlug(tenantId, validatedInput.slug, 'page')

    // Create the page
    const page = await prisma.page.create({
      data: {
        ...validatedInput,
        slug: uniqueSlug,
        tenantId,
        updatedBy: null, // TODO: Get current user ID from Clerk
        body: validatedInput.body || {},
      },
    })

    // Revalidate cache
    revalidateTenantCache(tenantId, 'page', uniqueSlug)

    return createSuccessResult({ id: page.id }, 'Page created successfully')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResult(
        error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }))
      )
    }
    
    console.error('Failed to create page:', error)
    return createErrorResult([{ field: 'general', message: 'Failed to create page' }])
  }
}

/**
 * Update an existing page
 */
export async function updatePage(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    // Validate input
    const validatedInput = PageUpdateSchema.parse(input)
    const { prisma, tenantId } = await getPrismaWithTenant()

    // Check if page exists and belongs to tenant
    const existingPage = await prisma.page.findFirst({
      where: {
        id: validatedInput.id,
        tenantId,
        deletedAt: null,
      },
    })

    if (!existingPage) {
      return createValidationErrorResult('id', 'Page not found')
    }

    // Generate unique slug if it changed
    const uniqueSlug = validatedInput.slug !== existingPage.slug
      ? await generateUniqueSlug(tenantId, validatedInput.slug, 'page', validatedInput.id)
      : validatedInput.slug

    // Update the page
    const page = await prisma.page.update({
      where: { id: validatedInput.id },
      data: {
        ...validatedInput,
        slug: uniqueSlug,
        updatedBy: null, // TODO: Get current user ID from Clerk
      },
    })

    // Revalidate cache
    revalidateTenantCache(tenantId, 'page', uniqueSlug)
    if (existingPage.slug !== uniqueSlug) {
      revalidateTenantCache(tenantId, 'page', existingPage.slug)
    }

    return createSuccessResult({ id: page.id }, 'Page updated successfully')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResult(
        error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }))
      )
    }
    
    console.error('Failed to update page:', error)
    return createErrorResult([{ field: 'general', message: 'Failed to update page' }])
  }
}

/**
 * Soft delete a page
 */
export async function deletePage(pageId: string): Promise<ActionResult> {
  try {
    const { prisma, tenantId } = await getPrismaWithTenant()

    // Check if page exists and belongs to tenant
    const existingPage = await prisma.page.findFirst({
      where: {
        id: pageId,
        tenantId,
        deletedAt: null,
      },
    })

    if (!existingPage) {
      return createValidationErrorResult('id', 'Page not found')
    }

    // Soft delete the page
    await prisma.page.update({
      where: { id: pageId },
      data: {
        deletedAt: new Date(),
        updatedBy: null, // TODO: Get current user ID from Clerk
      },
    })

    // Revalidate cache
    revalidateTenantCache(tenantId, 'page', existingPage.slug)

    return createSuccessResult(undefined, 'Page deleted successfully')
  } catch (error) {
    console.error('Failed to delete page:', error)
    return createErrorResult([{ field: 'general', message: 'Failed to delete page' }])
  }
}

/**
 * Duplicate a page
 */
export async function duplicatePage(pageId: string): Promise<ActionResult<{ id: string }>> {
  try {
    const { prisma, tenantId } = await getPrismaWithTenant()

    // Get the original page
    const originalPage = await prisma.page.findFirst({
      where: {
        id: pageId,
        tenantId,
        deletedAt: null,
      },
    })

    if (!originalPage) {
      return createValidationErrorResult('id', 'Page not found')
    }

    // Generate unique slug for the duplicate
    const duplicateSlug = await generateUniqueSlug(tenantId, `${originalPage.slug}-copy`, 'page')

    // Create the duplicate
    const duplicatedPage = await prisma.page.create({
      data: {
        title: `${originalPage.title} (Copy)`,
        slug: duplicateSlug,
        status: 'DRAFT', // Always start as draft
        body: originalPage.body as any,
        seoTitle: originalPage.seoTitle,
        seoDescription: originalPage.seoDescription,
        ogImageId: originalPage.ogImageId,
        tenantId,
        updatedBy: null, // TODO: Get current user ID from Clerk
      },
    })

    // Revalidate cache
    revalidateTenantCache(tenantId, 'page', duplicateSlug)

    return createSuccessResult({ id: duplicatedPage.id }, 'Page duplicated successfully')
  } catch (error) {
    console.error('Failed to duplicate page:', error)
    return createErrorResult([{ field: 'general', message: 'Failed to duplicate page' }])
  }
}

/**
 * Publish a page
 */
export async function publishPage(pageId: string): Promise<ActionResult> {
  try {
    const { prisma, tenantId } = await getPrismaWithTenant()

    // Get the page
    const page = await prisma.page.findFirst({
      where: {
        id: pageId,
        tenantId,
        deletedAt: null,
      },
    })

    if (!page) {
      return createValidationErrorResult('id', 'Page not found')
    }

    if (page.status === 'PUBLISHED') {
      return createValidationErrorResult('status', 'Page is already published')
    }

    // Update the page status
    await prisma.page.update({
      where: { id: pageId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        updatedBy: null, // TODO: Get current user ID from Clerk
      },
    })

    // Log the publish action
    await logPublishAction(tenantId, 'PAGE', pageId, 'PUBLISH')

    // Revalidate cache
    revalidateTenantCache(tenantId, 'page', page.slug)

    return createSuccessResult(undefined, 'Page published successfully')
  } catch (error) {
    console.error('Failed to publish page:', error)
    return createErrorResult([{ field: 'general', message: 'Failed to publish page' }])
  }
}

/**
 * Unpublish a page
 */
export async function unpublishPage(pageId: string): Promise<ActionResult> {
  try {
    const { prisma, tenantId } = await getPrismaWithTenant()

    // Get the page
    const page = await prisma.page.findFirst({
      where: {
        id: pageId,
        tenantId,
        deletedAt: null,
      },
    })

    if (!page) {
      return createValidationErrorResult('id', 'Page not found')
    }

    if (page.status === 'DRAFT') {
      return createValidationErrorResult('status', 'Page is already unpublished')
    }

    // Update the page status
    await prisma.page.update({
      where: { id: pageId },
      data: {
        status: 'DRAFT',
        publishedAt: null,
        updatedBy: null, // TODO: Get current user ID from Clerk
      },
    })

    // Log the unpublish action
    await logPublishAction(tenantId, 'PAGE', pageId, 'UNPUBLISH')

    // Revalidate cache
    revalidateTenantCache(tenantId, 'page', page.slug)

    return createSuccessResult(undefined, 'Page unpublished successfully')
  } catch (error) {
    console.error('Failed to unpublish page:', error)
    return createErrorResult([{ field: 'general', message: 'Failed to unpublish page' }])
  }
}
