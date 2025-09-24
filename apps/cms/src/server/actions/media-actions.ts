'use server'

import { getValidatedTenantId } from '@/lib/tenant'
import { generateDeliveryUrl, generateThumbnailUrl } from '@/server/media'
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export interface UpdateMediaInput {
  id: string
  alt?: string
  focalX?: number
  focalY?: number
}

export interface MediaResult {
  success: boolean
  data?: any
  error?: string
}

/**
 * Updates media metadata (alt text, focal point)
 */
export async function updateMedia(input: UpdateMediaInput): Promise<MediaResult> {
  try {
    const tenantId = await getValidatedTenantId()
    
    const { id, alt, focalX, focalY } = input
    
    // Validate focal point coordinates
    if (focalX !== undefined && (focalX < 0 || focalX > 1)) {
      return {
        success: false,
        error: 'Focal X must be between 0 and 1',
      }
    }
    
    if (focalY !== undefined && (focalY < 0 || focalY > 1)) {
      return {
        success: false,
        error: 'Focal Y must be between 0 and 1',
      }
    }
    
    // Update media record
    const media = await prisma.media.update({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      data: {
        alt,
        focalX,
        focalY,
      },
      select: {
        id: true,
        kind: true,
        filename: true,
        mime: true,
        size: true,
        width: true,
        height: true,
        cfImageId: true,
        r2Key: true,
        alt: true,
        focalX: true,
        focalY: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    
    // Generate URLs
    const deliveryUrl = generateDeliveryUrl(
      media.kind.toLowerCase() as 'image' | 'file',
      media.cfImageId || undefined,
      media.r2Key || undefined
    )
    
    let thumbnailUrl: string | undefined
    if (media.kind === 'IMAGE' && media.cfImageId) {
      thumbnailUrl = generateThumbnailUrl(media.cfImageId, 300, 300, 'cover')
    }
    
    revalidatePath('/media')
    
    return {
      success: true,
      data: {
        ...media,
        deliveryUrl,
        thumbnailUrl,
      },
    }
    
  } catch (error) {
    console.error('Update media error:', error)
    
    if (error instanceof Error && error.message.includes('No tenant ID could be resolved')) {
      return {
        success: false,
        error: 'Authentication required',
      }
    }
    
    return {
      success: false,
      error: 'Failed to update media',
    }
  }
}

/**
 * Deletes media (soft delete)
 */
export async function deleteMedia(id: string): Promise<MediaResult> {
  try {
    const tenantId = await getValidatedTenantId()
    
    // Soft delete media record
    await prisma.media.update({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    })
    
    revalidatePath('/media')
    
    return {
      success: true,
      data: { id },
    }
    
  } catch (error) {
    console.error('Delete media error:', error)
    
    if (error instanceof Error && error.message.includes('No tenant ID could be resolved')) {
      return {
        success: false,
        error: 'Authentication required',
      }
    }
    
    return {
      success: false,
      error: 'Failed to delete media',
    }
  }
}

/**
 * Gets a single media item by ID
 */
export async function getMedia(id: string): Promise<MediaResult> {
  try {
    const tenantId = await getValidatedTenantId()
    
    const media = await prisma.media.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      select: {
        id: true,
        kind: true,
        filename: true,
        mime: true,
        size: true,
        width: true,
        height: true,
        cfImageId: true,
        r2Key: true,
        alt: true,
        focalX: true,
        focalY: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    
    if (!media) {
      return {
        success: false,
        error: 'Media not found',
      }
    }
    
    // Generate URLs
    const deliveryUrl = generateDeliveryUrl(
      media.kind.toLowerCase() as 'image' | 'file',
      media.cfImageId || undefined,
      media.r2Key || undefined
    )
    
    let thumbnailUrl: string | undefined
    if (media.kind === 'IMAGE' && media.cfImageId) {
      thumbnailUrl = generateThumbnailUrl(media.cfImageId, 300, 300, 'cover')
    }
    
    return {
      success: true,
      data: {
        ...media,
        deliveryUrl,
        thumbnailUrl,
      },
    }
    
  } catch (error) {
    console.error('Get media error:', error)
    
    if (error instanceof Error && error.message.includes('No tenant ID could be resolved')) {
      return {
        success: false,
        error: 'Authentication required',
      }
    }
    
    return {
      success: false,
      error: 'Failed to get media',
    }
  }
}
