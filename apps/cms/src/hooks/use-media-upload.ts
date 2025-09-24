'use client'

import { useState, useCallback } from 'react'
import { toastHelpers } from '@/lib/toast'

export interface MediaUploadOptions {
  onSuccess?: (result: any) => void
  onError?: (error: string) => void
}

export interface MediaUploadResult {
  id: string
  deliveryUrl: string
  metadata: {
    width?: number
    height?: number
    size: number
    mime: string
  }
  media: any
}

export function useMediaUpload(options: MediaUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadFile = useCallback(async (file: File): Promise<MediaUploadResult | null> => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Step 1: Get signed upload URL
      const uploadUrlResponse = await fetch('/api/v1/media/upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kind: file.type.startsWith('image/') ? 'image' : 'file',
          filename: file.name,
          mime: file.type,
          size: file.size,
        }),
      })

      if (!uploadUrlResponse.ok) {
        const error = await uploadUrlResponse.json()
        throw new Error(error.error || 'Failed to get upload URL')
      }

      const { data: uploadData } = await uploadUrlResponse.json()
      setUploadProgress(25)

      // Step 2: Upload file directly to Cloudflare/R2
      const formData = new FormData()
      
      // Add any required fields for Cloudflare Images
      if (uploadData.fields) {
        Object.entries(uploadData.fields).forEach(([key, value]) => {
          formData.append(key, value as string)
        })
      }
      
      formData.append('file', file)

      const uploadResponse = await fetch(uploadData.url, {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file')
      }

      setUploadProgress(75)

      // Step 3: Commit the upload
      const commitResponse = await fetch('/api/v1/media/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kind: file.type.startsWith('image/') ? 'image' : 'file',
          filename: file.name,
          mime: file.type,
          size: file.size,
          cfImageId: uploadData.cfImageId,
          r2Key: uploadData.r2Key,
        }),
      })

      if (!commitResponse.ok) {
        const error = await commitResponse.json()
        throw new Error(error.error || 'Failed to commit upload')
      }

      const { data: result } = await commitResponse.json()
      setUploadProgress(100)

      toastHelpers.success('File uploaded successfully', `${file.name} has been uploaded`)
      options.onSuccess?.(result)

      return result

    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      toastHelpers.error('Upload failed', errorMessage)
      options.onError?.(errorMessage)
      return null
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [options])

  const uploadMultipleFiles = useCallback(async (files: File[]): Promise<MediaUploadResult[]> => {
    const results: MediaUploadResult[] = []
    
    for (const file of files) {
      const result = await uploadFile(file)
      if (result) {
        results.push(result)
      }
    }
    
    return results
  }, [uploadFile])

  return {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
    uploadProgress,
  }
}
