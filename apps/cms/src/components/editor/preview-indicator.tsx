'use client'

import { motion } from 'framer-motion'
import { Button } from '@portfolio-building-service/ui'
import { Badge } from '@portfolio-building-service/ui'
import { Eye, X } from 'lucide-react'
import { usePreviewMode } from '@/hooks/use-preview-mode'

interface PreviewIndicatorProps {
  className?: string
}

export function PreviewIndicator({ className }: PreviewIndicatorProps) {
  const { previewState, isLoading, stopPreview } = usePreviewMode()

  if (!previewState.isActive) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-2 ${className}`}
    >
      <Badge className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 border animate-pulse">
        <Eye className="h-3 w-3 mr-1" />
        PREVIEW ACTIVE
      </Badge>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={stopPreview}
        disabled={isLoading}
        className="h-6 px-2 text-xs hover:bg-orange-100 dark:hover:bg-orange-900/20 text-orange-700 dark:text-orange-400"
      >
        {isLoading ? (
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        ) : (
          <>
            <X className="h-3 w-3 mr-1" />
            Exit preview
          </>
        )}
      </Button>
    </motion.div>
  )
}
