'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@portfolio-building-service/ui'
import { Progress } from '@portfolio-building-service/ui'
import { Card, CardContent } from '@portfolio-building-service/ui'
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  File, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react'
import { useMediaUpload } from '@/hooks/use-media-upload'
import { cn } from '@/lib/utils'

interface MediaUploadProps {
  onUploadComplete?: (results: any[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number
  className?: string
}

export function MediaUpload({ 
  onUploadComplete, 
  accept = 'image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/zip',
  multiple = true,
  maxSize = 50 * 1024 * 1024, // 50MB
  className 
}: MediaUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { uploadMultipleFiles, isUploading, uploadProgress } = useMediaUpload({
    onSuccess: (result) => {
      console.log('Upload successful:', result)
    },
    onError: (error) => {
      console.error('Upload error:', error)
    },
  })

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => {
      if (file.size > maxSize) {
        return false
      }
      return true
    })

    if (validFiles.length !== fileArray.length) {
      // Some files were filtered out due to size
      console.warn('Some files were too large and were not selected')
    }

    setSelectedFiles(prev => multiple ? [...prev, ...validFiles] : validFiles)
  }, [maxSize, multiple])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }, [handleFileSelect])

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return

    const results = await uploadMultipleFiles(selectedFiles)
    if (results.length > 0) {
      onUploadComplete?.(results)
      setSelectedFiles([])
    }
  }, [selectedFiles, uploadMultipleFiles, onUploadComplete])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <Card 
        className={cn(
          'border-2 border-dashed transition-colors cursor-pointer',
          isDragOver ? 'border-brand-accent bg-brand-accent/5' : 'border-border hover:border-brand-accent/50',
          isUploading && 'opacity-50 pointer-events-none'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-brand-muted" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragOver ? 'Drop files here' : 'Upload files'}
            </h3>
            <p className="text-sm text-brand-muted mb-4">
              Drag and drop files here, or click to select files
            </p>
            <p className="text-xs text-brand-muted">
              Max file size: {formatFileSize(maxSize)}
            </p>
          </motion.div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Selected Files */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium">Selected Files ({selectedFiles.length})</h4>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file)}
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Progress */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
              <span className="text-sm font-medium">Uploading...</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Button */}
      {selectedFiles.length > 0 && !isUploading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button 
            onClick={handleUpload}
            className="w-full"
            disabled={selectedFiles.length === 0}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
          </Button>
        </motion.div>
      )}
    </div>
  )
}
