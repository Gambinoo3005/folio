'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { usePreviewMode } from '@/hooks/use-preview-mode'

interface PreviewButtonProps {
  target: 'page' | 'item'
  id: string
  slug?: string
  className?: string
  variant?: 'outline' | 'default' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
}

export function PreviewButton({ 
  target, 
  id, 
  slug, 
  className,
  variant = 'outline',
  size = 'sm'
}: PreviewButtonProps) {
  const { previewState, isLoading, startPreview, stopPreview } = usePreviewMode()

  const handlePreviewToggle = async () => {
    if (previewState.isActive) {
      await stopPreview()
    } else {
      await startPreview(target, id, slug)
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant={variant}
        size={size}
        onClick={handlePreviewToggle}
        disabled={isLoading}
        className={`border-border/50 hover:bg-brand-accent/10 hover:border-brand-accent/50 ${className}`}
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : previewState.isActive ? (
          <>
            <EyeOff className="h-4 w-4 mr-2" />
            Exit Preview
          </>
        ) : (
          <>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </>
        )}
      </Button>
    </motion.div>
  )
}
