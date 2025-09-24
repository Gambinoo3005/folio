'use server'

import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { 
  GlobalUpsertSchema, 
  type GlobalUpsertInput 
} from '@/lib/validation'
import { 
  getPrismaWithTenant, 
  revalidateTenantCache, 
  logPublishAction 
} from './utils'
import { createSuccessResult, createErrorResult, createValidationErrorResult, type ActionResult } from './types'

const prisma = new PrismaClient()

/**
 * Upsert a global (create or update)
 */
export async function upsertGlobal(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    // Validate input
    const validatedInput = GlobalUpsertSchema.parse(input)
    const { prisma, tenantId } = await getPrismaWithTenant()

    // Check if global already exists
    const existingGlobal = await prisma.global.findFirst({
      where: {
        key: validatedInput.key,
        tenantId,
      },
    })

    let global
    if (existingGlobal) {
      // Update existing global
      global = await prisma.global.update({
        where: { id: existingGlobal.id },
        data: {
          data: validatedInput.data,
        },
      })
    } else {
      // Create new global
      global = await prisma.global.create({
        data: {
          ...validatedInput,
          tenantId,
          data: validatedInput.data || {},
        },
      })
    }

    // Revalidate cache
    revalidateTenantCache(tenantId, 'global', validatedInput.key)

    return createSuccessResult(
      { id: global.id }, 
      existingGlobal ? 'Global updated successfully' : 'Global created successfully'
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResult(
        error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }))
      )
    }
    
    console.error('Failed to upsert global:', error)
    return createErrorResult([{ field: 'general', message: 'Failed to save global' }])
  }
}

/**
 * Get a global by key
 */
export async function getGlobal(key: string): Promise<ActionResult<{ data: any }>> {
  try {
    const { prisma, tenantId } = await getPrismaWithTenant()

    const global = await prisma.global.findFirst({
      where: {
        key,
        tenantId,
      },
    })

    if (!global) {
      return createValidationErrorResult('key', 'Global not found')
    }

    return createSuccessResult({ data: global.data })
  } catch (error) {
    console.error('Failed to get global:', error)
    return createErrorResult([{ field: 'general', message: 'Failed to get global' }])
  }
}

/**
 * Delete a global by key
 */
export async function deleteGlobal(key: string): Promise<ActionResult> {
  try {
    const { prisma, tenantId } = await getPrismaWithTenant()

    // Check if global exists
    const existingGlobal = await prisma.global.findFirst({
      where: {
        key,
        tenantId,
      },
    })

    if (!existingGlobal) {
      return createValidationErrorResult('key', 'Global not found')
    }

    // Delete the global
    await prisma.global.delete({
      where: { id: existingGlobal.id },
    })

    // Revalidate cache
    revalidateTenantCache(tenantId, 'global', key)

    return createSuccessResult(undefined, 'Global deleted successfully')
  } catch (error) {
    console.error('Failed to delete global:', error)
    return createErrorResult([{ field: 'general', message: 'Failed to delete global' }])
  }
}

/**
 * Get all globals for a tenant
 */
export async function getAllGlobals(): Promise<ActionResult<{ globals: Array<{ key: string; data: any }> }>> {
  try {
    const { prisma, tenantId } = await getPrismaWithTenant()

    const globals = await prisma.global.findMany({
      where: {
        tenantId,
      },
      select: {
        key: true,
        data: true,
      },
      orderBy: {
        key: 'asc',
      },
    })

    return createSuccessResult({ globals })
  } catch (error) {
    console.error('Failed to get globals:', error)
    return createErrorResult([{ field: 'general', message: 'Failed to get globals' }])
  }
}
