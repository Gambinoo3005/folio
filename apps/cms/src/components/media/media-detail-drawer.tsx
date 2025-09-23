"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Download, 
  Copy, 
  Trash2, 
  Edit, 
  Eye,
  Calendar,
  HardDrive,
  Image as ImageIcon,
  Video,
  File,
  ExternalLink
} from "lucide-react"
import { MediaItem } from "./media-grid"
import { FocalPointEditor } from "./focal-point-editor"
import { cn } from "@/lib/utils"

interface MediaDetailDrawerProps {
  item: MediaItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (item: MediaItem) => void
  onDelete: (item: MediaItem) => void
}

export function MediaDetailDrawer({
  item,
  open,
  onOpenChange,
  onEdit,
  onDelete
}: MediaDetailDrawerProps) {
  const [focalPoint, setFocalPoint] = useState(
    item?.focalPoint || { x: 50, y: 50 }
  )

  if (!item) return null

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-5 w-5" />
      case 'video':
        return <Video className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const handleFocalPointChange = (axis: 'x' | 'y', value: number) => {
    const newFocalPoint = { ...focalPoint, [axis]: Math.max(0, Math.min(100, value)) }
    setFocalPoint(newFocalPoint)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            {getFileIcon(item.type)}
            <span className="truncate">{item.filename}</span>
          </SheetTitle>
          <SheetDescription>
            View and edit media file details
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Preview */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Preview</h3>
            {item.type === 'image' ? (
              <div className="relative">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={item.url} 
                    alt={item.altText || item.filename}
                    className="w-full h-full object-cover"
                  />
                </div>
                {item.focalPoint && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div 
                      className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${item.focalPoint.x}%`,
                        top: `${item.focalPoint.y}%`
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                {getFileIcon(item.type)}
                <span className="ml-2 text-sm text-muted-foreground">
                  {item.type} file
                </span>
              </div>
            )}
          </div>

          {/* File Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">File Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <Badge variant="secondary" className={cn("text-xs", getTypeColor(item.type))}>
                  {item.type}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Size</span>
                <span className="text-sm font-medium">{formatFileSize(item.size)}</span>
              </div>
              
              {item.dimensions && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Dimensions</span>
                  <span className="text-sm font-medium">
                    {item.dimensions.width} × {item.dimensions.height}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">{formatDate(item.createdAt)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Alt Text */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Accessibility</h3>
            <div>
              <Label htmlFor="alt-text" className="text-sm">
                Alt Text
              </Label>
              <Textarea
                id="alt-text"
                value={item.altText || ''}
                placeholder="Describe this image for screen readers..."
                className="mt-1"
                rows={3}
                readOnly
              />
              <p className="text-xs text-muted-foreground mt-1">
                Required for accessibility. Edit this field to update the description.
              </p>
            </div>
          </div>

          {/* Focal Point Editor (Images only) */}
          {item.type === 'image' && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Focal Point</h3>
              <div className="space-y-3">
                <FocalPointEditor
                  imageUrl={item.url}
                  focalPoint={focalPoint}
                  onFocalPointChange={setFocalPoint}
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="focal-x" className="text-xs">
                      X Position (%)
                    </Label>
                    <Input
                      id="focal-x"
                      type="number"
                      min="0"
                      max="100"
                      value={focalPoint.x}
                      onChange={(e) => handleFocalPointChange('x', parseInt(e.target.value) || 50)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="focal-y" className="text-xs">
                      Y Position (%)
                    </Label>
                    <Input
                      id="focal-y"
                      type="number"
                      min="0"
                      max="100"
                      value={focalPoint.y}
                      onChange={(e) => handleFocalPointChange('y', parseInt(e.target.value) || 50)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Set the focal point for image cropping. Click or drag on the image above, or use the number inputs.
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* URL and Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">URL</h3>
            <div className="flex items-center space-x-2">
              <Input
                value={item.url}
                readOnly
                className="text-xs font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(item.url)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(item.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = item.url
                  link.download = item.filename
                  link.click()
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(item)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(item)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
