'use server'

import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { 
  ItemCreateSchema, 
  ItemUpdateSchema, 
  type ItemCreateInput, 
  type ItemUpdateInput 
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
 * Create a new item
 */
export async function createItem(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    // Validate input
    const validatedInput = ItemCreateSchema.parse(input)
    const { prisma, tenantId } = await getPrismaWithTenant()

    // Verify collection exists and belongs to tenant
    const collection = await prisma.collection.findFirst({
      where: {
        id: validatedInput.collectionId,
        tenantId,
      },
    })

    if (!collection) {
      return createValidationErrorResult('collectionId', 'Collection not found')
    }

    // Generate unique slug within the collection
    const uniqueSlug = await generateUniqueSlug(
      tenantId, 
      validatedInput.slug, 
      'item', 
      undefined, 
      validatedInput.collectionId
    )

    // Create the item
    const item = await prisma.item.create({
      data: {
        ...validatedInput,
        slug: uniqueSlug,
        tenantId,
        content: validatedInput.content || {},
      },
    })

    // Revalidate cache
    revalidateTenantCache(tenantId, 'item', uniqueSlug)
    revalidateTenantCache(tenantId, 'collection', collection.slug)

    return createSuccessResult({ id: item.id }, 'Item created successfully')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResult(
        error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }))
      )
    }
    
    console.error('Failed to create item:', error)
    return createErrorResult([{ field: 'general', message: 'Failed to create item' }])
  }
}

/**
 * Update an existing item
 */
export async function updateItem(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    // Validate input
    const validatedInput = ItemUpdateSchema.parse(input)
    const { prisma, tenantId } = await getPrismaWithTenant()

    // Check if item exists and belongs to tenant
    const existingItem = await prisma.item.findFirst({
      where: {
        id: validatedInput.id,
        tenantId,
        deletedAt: null,
      },
      include: {
        collection: true,
      },
    })

    if (!existingItem) {
      return createValidationErrorResult('id', 'Item not found')
    }

    // Generate unique slug if it changed
    const uniqueSlug = validatedInput.slug !== existingItem.slug
      ? await generateUniqueSlug(
          tenantId, 
          validatedInput.slug, 
          'item', 
          validatedInput.id, 
          existingItem.collectionId
        )
      : validatedInput.slug

    // Update the item
    const item = await prisma.item.update({
      where: { id: validatedInput.id },
      data: {
        ...validatedInput,
        slug: uniqueSlug,
      },
    })

    // Revalidate cache
    revalidateTenantCache(tenantId, 'item', uniqueSlug)
    revalidateTenantCache(tenantId, 'collection', existingItem.collection.slug)
    
    if (existingItem.slug !== uniqueSlug) {
      revalidateTenantCache(tenantId, 'item', existingItem.slug)
    }

    return createSuccessResult({ id: item.id }, 'Item updated successfully')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResult(
        error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }))
      )
    }
    
    console.error('Failed to update item:', error)
    return createErrorResult([{ field: 'general', message: 'Failed to update item' }])
  }
}

/**
 * Soft delete an item
 */
export async function deleteItem(itemId: string): Promise<ActionResult> {
  try {
    const { prisma, tenantId } = await getPrismaWithTenant()

    // Check if item exists and belongs to tenant
    const existingItem = await prisma.item.findFirst({
      where: {
        id: itemId,
        tenantId,
        deletedAt: null,
      },
      include: {
        collection: true,
      },
    })

    if (!existingItem) {
      return createValidationErrorResult('id', 'Item not found')
    }

    // Soft delete the item
    await prisma.item.update({
      where: { id: itemId },
      data: {
        deletedAt: new Date(),
      },
    })

    // Revalidate cache
    revalidateTenantCache(tenantId, 'item', existingItem.slug)
    revalidateTenantCache(tenantId, 'collection', existingItem.collection.slug)

    return createSuccessResult(undefined, 'Item deleted successfully')
  } catch (error) {
    console.error('Failed to delete item:', error)
    return createErrorResult([{ field: 'general', message: 'Failed to delete item' }])
  }
}

/**
 * Publish an item
 */
export async function publishItem(itemId: string): Promise<ActionResult> {
  try {
    const { prisma, tenantId } = await getPrismaWithTenant()

    // Get the item
    const item = await prisma.item.findFirst({
      where: {
        id: itemId,
        tenantId,
        deletedAt: null,
      },
      include: {
        collection: true,
      },
    })

    if (!item) {
      return createValidationErrorResult('id', 'Item not found')
    }

    if (item.status === 'PUBLISHED') {
      return createValidationErrorResult('status', 'Item is already published')
    }

    // Update the item status
    await prisma.item.update({
      where: { id: itemId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    })

    // Log the publish action
    await logPublishAction(tenantId, 'ITEM', itemId, 'PUBLISH')

    // Revalidate cache
    revalidateTenantCache(tenantId, 'item', item.slug)
    revalidateTenantCache(tenantId, 'collection', item.collection.slug)

    return createSuccessResult(undefined, 'Item published successfully')
  } catch (error) {
    console.error('Failed to publish item:', error)
    return createErrorResult([{ field: 'general', message: 'Failed to publish item' }])
  }
}

/**
 * Unpublish an item
 */
export async function unpublishItem(itemId: string): Promise<ActionResult> {
  try {
    const { prisma, tenantId } = await getPrismaWithTenant()

    // Get the item
    const item = await prisma.item.findFirst({
      where: {
        id: itemId,
        tenantId,
        deletedAt: null,
      },
      include: {
        collection: true,
      },
    })

    if (!item) {
      return createValidationErrorResult('id', 'Item not found')
    }

    if (item.status === 'DRAFT') {
      return createValidationErrorResult('status', 'Item is already unpublished')
    }

    // Update the item status
    await prisma.item.update({
      where: { id: itemId },
      data: {
        status: 'DRAFT',
        publishedAt: null,
      },
    })

    // Log the unpublish action
    await logPublishAction(tenantId, 'ITEM', itemId, 'UNPUBLISH')

    // Revalidate cache
    revalidateTenantCache(tenantId, 'item', item.slug)
    revalidateTenantCache(tenantId, 'collection', item.collection.slug)

    return createSuccessResult(undefined, 'Item unpublished successfully')
  } catch (error) {
    console.error('Failed to unpublish item:', error)
    return createErrorResult([{ field: 'general', message: 'Failed to unpublish item' }])
  }
}
