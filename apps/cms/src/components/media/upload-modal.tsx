"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  X, 
  File, 
  Image, 
  Video, 
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FocalPointEditor } from "./focal-point-editor"

interface UploadFile {
  file: File
  id: string
  altText: string
  focalPoint: { x: number; y: number }
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (files: UploadFile[]) => Promise<void>
}

export function UploadModal({ open, onOpenChange, onUpload }: UploadModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      altText: '',
      focalPoint: { x: 50, y: 50 },
      status: 'pending',
      progress: 0
    }))
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
      'video/*': ['.mp4', '.webm', '.mov', '.avi'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true
  })

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }

  const updateFile = (id: string, updates: Partial<UploadFile>) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, ...updates } : file
    ))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    // Validate required fields
    const invalidFiles = files.filter(file => 
      file.status === 'pending' && !file.altText.trim()
    )

    if (invalidFiles.length > 0) {
      // Mark invalid files as error
      setFiles(prev => prev.map(file => 
        invalidFiles.some(invalid => invalid.id === file.id)
          ? { ...file, status: 'error', error: 'Alt text is required' }
          : file
      ))
      return
    }

    setIsUploading(true)

    try {
      // Simulate upload progress
      for (const file of files) {
        if (file.status === 'pending') {
          updateFile(file.id, { status: 'uploading', progress: 0 })
          
          // Simulate progress
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise(resolve => setTimeout(resolve, 100))
            updateFile(file.id, { progress })
          }
          
          updateFile(file.id, { status: 'success', progress: 100 })
        }
      }

      await onUpload(files)
      
      // Reset form
      setFiles([])
      onOpenChange(false)
    } catch (error) {
      // Mark all pending files as error
      setFiles(prev => prev.map(file => 
        file.status === 'uploading' || file.status === 'pending'
          ? { ...file, status: 'error', error: 'Upload failed' }
          : file
      ))
    } finally {
      setIsUploading(false)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />
    } else if (file.type.startsWith('video/')) {
      return <Video className="h-4 w-4" />
    } else {
      return <File className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      default:
        return null
    }
  }

  const pendingFiles = files.filter(f => f.status === 'pending')
  const canUpload = pendingFiles.length > 0 && !isUploading

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Upload Media Files</DialogTitle>
          <DialogDescription>
            Upload images, videos, and documents to your media library. Alt text is required for accessibility.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Drop Zone */}
          {files.length === 0 && (
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragActive 
                  ? "border-primary bg-primary/5" 
                  : "border-muted-foreground/25 hover:border-primary/50"
              )}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">
                {isDragActive ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse files
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">Images (PNG, JPG, GIF, WebP)</Badge>
                <Badge variant="outline">Videos (MP4, WebM, MOV)</Badge>
                <Badge variant="outline">Documents (PDF, DOC, DOCX)</Badge>
              </div>
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  Files to upload ({files.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiles([])}
                  disabled={isUploading}
                >
                  Clear all
                </Button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {files.map((fileData) => (
                  <div
                    key={fileData.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(fileData.file)}
                        <div>
                          <p className="text-sm font-medium">{fileData.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(fileData.file.size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(fileData.status)}
                        {fileData.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(fileData.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {fileData.status === 'uploading' && (
                      <div className="space-y-2">
                        <Progress value={fileData.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Uploading... {fileData.progress}%
                        </p>
                      </div>
                    )}

                    {fileData.status === 'error' && (
                      <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-2 rounded">
                        {fileData.error}
                      </div>
                    )}

                    {fileData.status === 'pending' && (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`alt-${fileData.id}`} className="text-sm font-medium">
                            Alt Text <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id={`alt-${fileData.id}`}
                            placeholder="Describe this image for screen readers..."
                            value={fileData.altText}
                            onChange={(e) => updateFile(fileData.id, { altText: e.target.value })}
                            className="mt-1"
                            rows={2}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Required for accessibility. Describe what's in the image.
                          </p>
                        </div>

                        {fileData.file.type.startsWith('image/') && (
                          <div>
                            <Label className="text-sm font-medium">
                              Focal Point (Optional)
                            </Label>
                            <div className="mt-1 space-y-3">
                              <FocalPointEditor
                                imageUrl={URL.createObjectURL(fileData.file)}
                                focalPoint={fileData.focalPoint}
                                onFocalPointChange={(focalPoint) => updateFile(fileData.id, { focalPoint })}
                                className="h-32"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label htmlFor={`focal-x-${fileData.id}`} className="text-xs">
                                    X Position (%)
                                  </Label>
                                  <Input
                                    id={`focal-x-${fileData.id}`}
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={fileData.focalPoint.x}
                                    onChange={(e) => updateFile(fileData.id, {
                                      focalPoint: {
                                        ...fileData.focalPoint,
                                        x: parseInt(e.target.value) || 50
                                      }
                                    })}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`focal-y-${fileData.id}`} className="text-xs">
                                    Y Position (%)
                                  </Label>
                                  <Input
                                    id={`focal-y-${fileData.id}`}
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={fileData.focalPoint.y}
                                    onChange={(e) => updateFile(fileData.id, {
                                      focalPoint: {
                                        ...fileData.focalPoint,
                                        y: parseInt(e.target.value) || 50
                                      }
                                    })}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Set the focal point for image cropping (0-100% from top-left).
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!canUpload}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {pendingFiles.length} file{pendingFiles.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
