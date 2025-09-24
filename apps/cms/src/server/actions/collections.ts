'use server'

import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { 
  CollectionCreateSchema, 
  CollectionUpdateSchema, 
  type CollectionCreateInput, 
  type CollectionUpdateInput 
} from '@/lib/validation'
import { 
  getPrismaWithTenant, 
  revalidateTenantCache, 
  generateUniqueSlug 
} from './utils'
import { createSuccessResult, createErrorResult, createValidationErrorResult, type ActionResult } from './types'

const prisma = new PrismaClient()

/**
 * Create a new collection
 */
export async function createCollection(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    // Validate input
    const validatedInput = CollectionCreateSchema.parse(input)
    const { prisma, tenantId } = await getPrismaWithTenant()

    // Generate unique slug
    const uniqueSlug = await generateUniqueSlug(tenantId, validatedInput.slug, 'collection')

    // Create the collection
    const collection = await prisma.collection.create({
      data: {
        ...validatedInput,
        slug: uniqueSlug,
        tenantId,
        config: validatedInput.config || {},
      },
    })

    // Revalidate cache
    revalidateTenantCache(tenantId, 'collection', uniqueSlug)

    return createSuccessResult({ id: collection.id }, 'Collection created successfully')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResult(
        error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }))
      )
    }
    
    console.error('Failed to create collection:', error)
    return createErrorResult([{ field: 'general', message: 'Failed to create collection' }]) as ActionResult<{ id: string }>
  }
}

/**
 * Update an existing collection
 */
export async function updateCollection(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    // Validate input
    const validatedInput = CollectionUpdateSchema.parse(input)
    const { prisma, tenantId } = await getPrismaWithTenant()

    // Check if collection exists and belongs to tenant
    const existingCollection = await prisma.collection.findFirst({
      where: {
        id: validatedInput.id,
        tenantId,
      },
    })

    if (!existingCollection) {
      return createValidationErrorResult('id', 'Collection not found')
    }

    // Generate unique slug if it changed
    const uniqueSlug = validatedInput.slug !== existingCollection.slug
      ? await generateUniqueSlug(tenantId, validatedInput.slug, 'collection', validatedInput.id)
      : validatedInput.slug

    // Update the collection
    const collection = await prisma.collection.update({
      where: { id: validatedInput.id },
      data: {
        ...validatedInput,
        slug: uniqueSlug,
      },
    })

    // Revalidate cache
    revalidateTenantCache(tenantId, 'collection', uniqueSlug)
    if (existingCollection.slug !== uniqueSlug) {
      revalidateTenantCache(tenantId, 'collection', existingCollection.slug)
    }

    return createSuccessResult({ id: collection.id }, 'Collection updated successfully')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResult(
        error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }))
      )
    }
    
    console.error('Failed to update collection:', error)
    return createErrorResult([{ field: 'general', message: 'Failed to update collection' }])
  }
}
