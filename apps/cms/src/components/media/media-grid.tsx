'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@portfolio-building-service/ui'
import { Button } from '@portfolio-building-service/ui'
import { Badge } from '@portfolio-building-service/ui'
import { 
  Image as ImageIcon, 
  File, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  MoreVertical
} from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@portfolio-building-service/ui'
import { MediaDetailDrawer } from './media-detail-drawer'
import { cn } from '@/lib/utils'

export interface MediaItem {
  id: string
  kind: 'IMAGE' | 'FILE'
  filename: string
  mime: string
  size: number
  width?: number
  height?: number
  cfImageId?: string
  r2Key?: string
  alt?: string
  focalX?: number
  focalY?: number
  deliveryUrl: string
  thumbnailUrl?: string
  createdAt: string
  updatedAt: string
}

interface MediaGridProps {
  media: MediaItem[]
  onEdit?: (media: MediaItem) => void
  onDelete?: (media: MediaItem) => void
  onView?: (media: MediaItem) => void
  viewMode?: 'grid' | 'list'
  className?: string
}

export function MediaGrid({ 
  media, 
  onEdit, 
  onDelete, 
  onView,
  viewMode = 'grid',
  className 
}: MediaGridProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleView = (media: MediaItem) => {
    setSelectedMedia(media)
    setIsDetailOpen(true)
    onView?.(media)
  }

  const handleEdit = (media: MediaItem) => {
    setSelectedMedia(media)
    setIsDetailOpen(true)
    onEdit?.(media)
  }

  const handleDelete = (media: MediaItem) => {
    onDelete?.(media)
  }

  if (viewMode === 'list') {
    return (
      <div className={cn('space-y-2', className)}>
        {media.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-4 bg-card rounded-lg border hover:bg-muted/50 transition-colors"
          >
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              {item.kind === 'IMAGE' && item.thumbnailUrl ? (
                <img
                  src={item.thumbnailUrl}
                  alt={item.alt || item.filename}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                  {item.kind === 'IMAGE' ? (
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <File className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{item.filename}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {item.kind}
                </Badge>
                <span>{formatFileSize(item.size)}</span>
                {item.width && item.height && (
                  <span>{item.width} × {item.height}</span>
                )}
                <span>{formatDate(item.createdAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleView(item)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open(item.deliveryUrl, '_blank')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete(item)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        ))}

        {/* Detail Drawer */}
        <MediaDetailDrawer
          media={selectedMedia}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4', className)}>
      {media.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className="group"
        >
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              {/* Thumbnail */}
              <div className="aspect-square relative overflow-hidden">
                {item.kind === 'IMAGE' && item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.alt || item.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    {item.kind === 'IMAGE' ? (
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    ) : (
                      <File className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleView(item)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>

                {/* Kind Badge */}
                <Badge 
                  variant="secondary" 
                  className="absolute top-2 left-2 text-xs"
                >
                  {item.kind}
                </Badge>
              </div>

              {/* File Info */}
              <div className="p-3">
                <h3 className="font-medium text-sm truncate mb-1">
                  {item.filename}
                </h3>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>{formatFileSize(item.size)}</div>
                  {item.width && item.height && (
                    <div>{item.width} × {item.height}</div>
                  )}
                  <div>{formatDate(item.createdAt)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Detail Drawer */}
      <MediaDetailDrawer
        media={selectedMedia}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  )
}