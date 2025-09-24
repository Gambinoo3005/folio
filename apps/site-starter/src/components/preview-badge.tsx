'use client'

import { useEffect, useState } from 'react'
import { isPreview } from '@/lib/preview'

export function PreviewBadge() {
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    // Check preview mode on client side
    const checkPreview = async () => {
      try {
        const response = await fetch('/api/preview/status')
        if (response.ok) {
          const data = await response.json()
          setIsPreviewMode(data.isPreview)
        }
      } catch (error) {
        console.error('Failed to check preview status:', error)
      }
    }

    checkPreview()
  }, [])

  if (!isPreviewMode) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
        PREVIEW
      </div>
    </div>
  )
}
