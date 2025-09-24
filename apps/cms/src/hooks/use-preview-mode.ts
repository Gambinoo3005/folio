'use client'

import { useState, useEffect, useCallback } from 'react'
import { toastHelpers } from '@/lib/toast'

interface PreviewState {
  isActive: boolean
  target?: 'page' | 'item'
  id?: string
  slug?: string
}

export function usePreviewMode() {
  const [previewState, setPreviewState] = useState<PreviewState>({ isActive: false })
  const [isLoading, setIsLoading] = useState(false)

  // Check if preview mode is active on mount
  useEffect(() => {
    checkPreviewStatus()
  }, [])

  const checkPreviewStatus = useCallback(async () => {
    try {
      // Check if preview cookie exists by making a request to a preview status endpoint
      // For now, we'll check the cookie directly on the client side
      const hasPreviewCookie = document.cookie.includes('folio-preview=')
      setPreviewState({ isActive: hasPreviewCookie })
    } catch (error) {
      console.error('Failed to check preview status:', error)
    }
  }, [])

  const startPreview = useCallback(async (target: 'page' | 'item', id: string, slug?: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/preview/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target,
          id,
          slug,
          token: 'preview-token', // For V1, we accept any token
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to start preview')
      }

      setPreviewState({ isActive: true, target, id, slug })
      toastHelpers.success('Preview mode activated', 'You can now see draft content')
      
      // Open preview in new tab
      const previewUrl = `/preview/${target}/${id}`
      window.open(previewUrl, '_blank')
    } catch (error) {
      console.error('Failed to start preview:', error)
      toastHelpers.error('Failed to start preview', error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const stopPreview = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/preview/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to stop preview')
      }

      setPreviewState({ isActive: false })
      toastHelpers.success('Preview mode deactivated', 'Now showing published content only')
      
      // Refresh the page to remove preview mode
      window.location.reload()
    } catch (error) {
      console.error('Failed to stop preview:', error)
      toastHelpers.error('Failed to stop preview', error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    previewState,
    isLoading,
    startPreview,
    stopPreview,
    checkPreviewStatus,
  }
}
