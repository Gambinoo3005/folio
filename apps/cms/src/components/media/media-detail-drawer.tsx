'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  X, 
  Download, 
  Trash2, 
  Save,
  Image as ImageIcon,
  File,
  ExternalLink
} from 'lucide-react'
import { MediaItem } from './media-grid'
import { updateMedia, deleteMedia } from '@/server/actions/media-actions'
import { toastHelpers } from '@/lib/toast'

interface MediaDetailDrawerProps {
  media: MediaItem | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (media: MediaItem) => void
  onDelete?: (media: MediaItem) => void
}

export function MediaDetailDrawer({ 
  media, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}: MediaDetailDrawerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    alt: '',
    focalX: 0.5,
    focalY: 0.5,
  })

  // Update form data when media changes
  useState(() => {
    if (media) {
      setFormData({
        alt: media.alt || '',
        focalX: media.focalX || 0.5,
        focalY: media.focalY || 0.5,
      })
    }
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const handleSave = async () => {
    if (!media) return

    setIsSaving(true)
    try {
      const result = await updateMedia({
        id: media.id,
        alt: formData.alt,
        focalX: formData.focalX,
        focalY: formData.focalY,
      })

      if (result.success) {
        toastHelpers.success('Media updated successfully')
        setIsEditing(false)
        onEdit?.(result.data)
      } else {
        toastHelpers.error('Failed to update media', result.error)
      }
    } catch (error) {
      toastHelpers.error('Failed to update media', 'An unexpected error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!media) return

    if (!confirm('Are you sure you want to delete this media? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await deleteMedia(media.id)

      if (result.success) {
        toastHelpers.success('Media deleted successfully')
        onDelete?.(media)
        onClose()
      } else {
        toastHelpers.error('Failed to delete media', result.error)
      }
    } catch (error) {
      toastHelpers.error('Failed to delete media', 'An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownload = () => {
    if (!media) return
    window.open(media.deliveryUrl, '_blank')
  }

  if (!media) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Media Details</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  {media.kind === 'IMAGE' ? (
                    <img
                      src={media.deliveryUrl}
                      alt={media.alt || media.filename}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <File className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Filename</Label>
                  <p className="text-sm text-muted-foreground">{media.filename}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <div className="mt-1">
                      <Badge variant="secondary">{media.kind}</Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Size</Label>
                    <p className="text-sm text-muted-foreground">{formatFileSize(media.size)}</p>
                  </div>
                </div>

                {media.width && media.height && (
                  <div>
                    <Label className="text-sm font-medium">Dimensions</Label>
                    <p className="text-sm text-muted-foreground">{media.width} × {media.height}</p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">MIME Type</Label>
                  <p className="text-sm text-muted-foreground">{media.mime}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-muted-foreground">{formatDate(media.createdAt)}</p>
                </div>
              </div>

              <Separator />

              {/* Editable Fields */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Metadata</h3>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="alt">Alt Text</Label>
                  {isEditing ? (
                    <Textarea
                      id="alt"
                      value={formData.alt}
                      onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
                      placeholder="Describe this image for accessibility..."
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      {media.alt || 'No alt text provided'}
                    </p>
                  )}
                </div>

                {media.kind === 'IMAGE' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="focalX">Focal Point X</Label>
                      {isEditing ? (
                        <Input
                          id="focalX"
                          type="number"
                          min="0"
                          max="1"
                          step="0.1"
                          value={formData.focalX}
                          onChange={(e) => setFormData(prev => ({ ...prev, focalX: parseFloat(e.target.value) }))}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">{media.focalX || 0.5}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="focalY">Focal Point Y</Label>
                      {isEditing ? (
                        <Input
                          id="focalY"
                          type="number"
                          min="0"
                          max="1"
                          step="0.1"
                          value={formData.focalY}
                          onChange={(e) => setFormData(prev => ({ ...prev, focalY: parseFloat(e.target.value) }))}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">{media.focalY || 0.5}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* URLs */}
              <div className="space-y-4">
                <h3 className="font-medium">URLs</h3>
                <div>
                  <Label className="text-sm font-medium">Delivery URL</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={media.deliveryUrl}
                      readOnly
                      className="text-xs"
                    />
                    <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(media.deliveryUrl)}>
                      Copy
                    </Button>
                  </div>
                </div>
                {media.thumbnailUrl && (
                  <div>
                    <Label className="text-sm font-medium">Thumbnail URL</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        value={media.thumbnailUrl}
                        readOnly
                        className="text-xs"
                      />
                      <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(media.thumbnailUrl!)}>
                        Copy
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-6 space-y-3">
              <Button onClick={handleDownload} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full"
              >
                {isDeleting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}