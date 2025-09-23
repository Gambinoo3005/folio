"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Image, 
  Video, 
  File, 
  MoreHorizontal, 
  Eye, 
  Download,
  Trash2,
  Edit
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface MediaItem {
  id: string
  filename: string
  type: 'image' | 'video' | 'document'
  size: number
  dimensions?: {
    width: number
    height: number
  }
  createdAt: Date
  altText?: string
  focalPoint?: {
    x: number
    y: number
  }
  url: string
}

interface MediaGridProps {
  items: MediaItem[]
  onItemClick: (item: MediaItem) => void
  onEdit: (item: MediaItem) => void
  onDelete: (item: MediaItem) => void
  viewMode: 'grid' | 'list'
}

export function MediaGrid({ 
  items, 
  onItemClick, 
  onEdit, 
  onDelete, 
  viewMode 
}: MediaGridProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />
      case 'video':
        return <Video className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'video':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {items.map((item) => (
          <Card 
            key={item.id} 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => onItemClick(item)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {item.type === 'image' ? (
                    <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      <img 
                        src={item.url} 
                        alt={item.altText || item.filename}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                      {getFileIcon(item.type)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium truncate">{item.filename}</p>
                    <Badge variant="secondary" className={cn("text-xs", getTypeColor(item.type))}>
                      {item.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                    <span>{formatFileSize(item.size)}</span>
                    {item.dimensions && (
                      <span>{item.dimensions.width} × {item.dimensions.height}</span>
                    )}
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(item)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(item)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {items.map((item) => (
        <Card 
          key={item.id} 
          className="cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => onItemClick(item)}
        >
          <CardContent className="p-2">
            <div className="relative">
              {item.type === 'image' ? (
                <div className="aspect-square bg-muted rounded-md overflow-hidden">
                  <img 
                    src={item.url} 
                    alt={item.altText || item.filename}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                  {getFileIcon(item.type)}
                </div>
              )}
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onItemClick(item)
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(item)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium truncate" title={item.filename}>
                {item.filename}
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className={cn("text-xs", getTypeColor(item.type))}>
                  {item.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(item.size)}
                </span>
              </div>
              {item.dimensions && (
                <p className="text-xs text-muted-foreground">
                  {item.dimensions.width} × {item.dimensions.height}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
