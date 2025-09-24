'use server'

import { getValidatedTenantId } from '@/lib/tenant'
import { requireWritePermission } from '@/lib/rbac'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface SubmissionListItem {
  id: string
  form: string
  payload: Record<string, unknown>
  ip: string | null
  ua: string | null
  createdAt: Date
}

export interface SubmissionsFilters {
  form?: string
  dateFrom?: string
  dateTo?: string
}

/**
 * Get submissions for the current tenant with optional filtering
 */
export async function getSubmissions(filters: SubmissionsFilters = {}): Promise<SubmissionListItem[]> {
  try {
    const tenantId = await getValidatedTenantId()
    
    // Build where clause
    const where: any = {
      tenantId,
    }
    
    // Add form filter
    if (filters.form) {
      where.form = filters.form
    }
    
    // Add date filters
    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {}
      
      if (filters.dateFrom) {
        where.createdAt.gte = new Date(filters.dateFrom)
      }
      
      if (filters.dateTo) {
        where.createdAt.lte = new Date(filters.dateTo)
      }
    }
    
    const submissions = await prisma.submission.findMany({
      where,
      select: {
        id: true,
        form: true,
        payload: true,
        ip: true,
        ua: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return submissions.map(submission => ({
      ...submission,
      payload: submission.payload as Record<string, unknown>
    }))
    
  } catch (error) {
    console.error('Failed to fetch submissions:', error)
    throw new Error('Failed to fetch submissions')
  }
}

/**
 * Get unique form names for filtering
 */
export async function getFormNames(): Promise<string[]> {
  try {
    const tenantId = await getValidatedTenantId()
    
    const forms = await prisma.submission.findMany({
      where: { tenantId },
      select: { form: true },
      distinct: ['form'],
      orderBy: { form: 'asc' },
    })
    
    return forms.map(f => f.form)
    
  } catch (error) {
    console.error('Failed to fetch form names:', error)
    throw new Error('Failed to fetch form names')
  }
}

/**
 * Get submission statistics
 */
export async function getSubmissionStats(): Promise<{
  total: number
  new: number
  thisMonth: number
}> {
  try {
    const tenantId = await getValidatedTenantId()
    
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    const [total, thisMonth, newSubmissions] = await Promise.all([
      prisma.submission.count({ where: { tenantId } }),
      prisma.submission.count({ 
        where: { 
          tenantId,
          createdAt: { gte: startOfMonth }
        } 
      }),
      prisma.submission.count({ 
        where: { 
          tenantId,
          createdAt: { gte: oneDayAgo }
        } 
      }),
    ])
    
    return {
      total,
      new: newSubmissions,
      thisMonth,
    }
    
  } catch (error) {
    console.error('Failed to fetch submission stats:', error)
    throw new Error('Failed to fetch submission stats')
  }
}

export async function deleteSubmission(submissionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Require write permission (EDITOR or higher)
    await requireWritePermission()
    const tenantId = await getValidatedTenantId()
    
    // Verify the submission belongs to this tenant
    const submission = await prisma.submission.findFirst({
      where: {
        id: submissionId,
        tenantId,
      },
    })
    
    if (!submission) {
      return { success: false, error: 'Submission not found' }
    }
    
    await prisma.submission.delete({
      where: {
        id: submissionId,
      },
    })
    
    return { success: true }
    
  } catch (error) {
    console.error('Failed to delete submission:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Insufficient permissions')) {
        return { success: false, error: 'You do not have permission to delete submissions' }
      }
      if (error.message.includes('Authentication required')) {
        return { success: false, error: 'Authentication required' }
      }
    }
    
    return { success: false, error: 'Failed to delete submission' }
  }
}
