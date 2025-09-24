"use client"

import { useState, useEffect, useMemo } from "react"
import { CmsLayout } from "@/components/cms-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Image, File, Search, HardDrive } from "lucide-react"
import { MediaGrid, MediaItem } from "@/components/media/media-grid"
import { MediaFilters, MediaFilters as MediaFiltersType } from "@/components/media/media-filters"
import { UploadModal } from "@/components/media/upload-modal"
import { MediaDetailDrawer } from "@/components/media/media-detail-drawer"
import { MediaLoadingWrapper } from "@/components/loading-wrapper"
import { EmptyMediaLibrary } from "@/components/ui/empty-states"
import { useLoading } from "@/hooks/use-loading"
import { cmsToasts } from "@/lib/toast"

// Mock data for demonstration
const mockMediaItems: MediaItem[] = [
  {
    id: "1",
    kind: "IMAGE",
    filename: "hero-image.jpg",
    mime: "image/jpeg",
    size: 2048576, // 2MB
    width: 1920,
    height: 1080,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    alt: "Beautiful landscape with mountains and lake",
    cfImageId: "cf-image-1",
    r2Key: "media/hero-image.jpg",
    deliveryUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    focalX: 50,
    focalY: 30
  },
  {
    id: "2",
    kind: "IMAGE",
    filename: "portfolio-project-1.png",
    mime: "image/png",
    size: 1536000, // 1.5MB
    width: 1200,
    height: 800,
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-14T15:45:00Z",
    alt: "Screenshot of a modern web application dashboard",
    cfImageId: "cf-image-2",
    r2Key: "media/portfolio-project-1.png",
    deliveryUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
    focalX: 40,
    focalY: 60
  },
  {
    id: "3",
    kind: "FILE",
    filename: "demo-video.mp4",
    mime: "video/mp4",
    size: 15728640, // 15MB
    createdAt: "2024-01-13T09:20:00Z",
    updatedAt: "2024-01-13T09:20:00Z",
    alt: "Product demonstration video showing key features",
    r2Key: "media/demo-video.mp4",
    deliveryUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
  },
  {
    id: "4",
    kind: "FILE",
    filename: "resume.pdf",
    mime: "application/pdf",
    size: 512000, // 512KB
    createdAt: "2024-01-12T14:15:00Z",
    updatedAt: "2024-01-12T14:15:00Z",
    alt: "Professional resume document",
    r2Key: "media/resume.pdf",
    deliveryUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "5",
    kind: "IMAGE",
    filename: "team-photo.jpg",
    mime: "image/jpeg",
    size: 3072000, // 3MB
    width: 1600,
    height: 1200,
    createdAt: "2024-01-11T11:30:00Z",
    updatedAt: "2024-01-11T11:30:00Z",
    alt: "Team photo from company retreat",
    cfImageId: "cf-image-5",
    r2Key: "media/team-photo.jpg",
    deliveryUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=1200&fit=crop",
    focalX: 50,
    focalY: 50
  },
  {
    id: "6",
    kind: "FILE",
    filename: "presentation-slides.pdf",
    mime: "application/pdf",
    size: 2048000, // 2MB
    createdAt: "2024-01-10T16:00:00Z",
    updatedAt: "2024-01-10T16:00:00Z",
    alt: "Quarterly business review presentation slides",
    r2Key: "media/presentation-slides.pdf",
    deliveryUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
]

// Mock data fetching functions
const fetchMediaData = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Simulate random success/failure
  if (Math.random() > 0.7) {
    throw new Error("Failed to load media data")
  }
  
  // Simulate empty media library (set to true to see empty state)
  const isEmpty = false
  
  if (isEmpty) {
    return { mediaItems: [] }
  }
  
  return { mediaItems: mockMediaItems }
}

export function MediaWithStates() {
  const { isLoading, error, execute, reset } = useLoading(true)
  const [data, setData] = useState<any>(null)
  const [filters, setFilters] = useState<MediaFiltersType>({
    search: '',
    type: '',
    size: '',
    dateRange: ''
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)

  const loadMediaData = async () => {
    const result = await execute(fetchMediaData)
    if (result) {
      setData(result)
      cmsToasts.success("Media library loaded", "Your media files have been refreshed")
    }
  }

  useEffect(() => {
    loadMediaData()
  }, [])

  const handleRetry = () => {
    reset()
    loadMediaData()
  }

  const handleUpload = async (files: any[]) => {
    const toastId = cmsToasts.uploading()
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate random success/failure
      if (Math.random() > 0.8) {
        throw new Error("Upload failed")
      }
      
      cmsToasts.mediaUploaded(files[0]?.name || "files")
      setUploadModalOpen(false)
    } catch (error) {
      cmsToasts.mediaError(error instanceof Error ? error.message : "Upload failed")
    }
  }

  // Filter and search media items
  const filteredItems = useMemo(() => {
    if (!data?.mediaItems) return []
    
    return data.mediaItems.filter((item: MediaItem) => {
      // Search filter
      if (filters.search && !item.filename.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      // Type filter
      if (filters.type && item.kind !== filters.type) {
        return false
      }

      // Size filter
      if (filters.size) {
        const sizeInMB = item.size / (1024 * 1024)
        switch (filters.size) {
          case 'small':
            if (sizeInMB >= 1) return false
            break
          case 'medium':
            if (sizeInMB < 1 || sizeInMB > 10) return false
            break
          case 'large':
            if (sizeInMB <= 10) return false
            break
        }
      }

      // Date range filter
      if (filters.dateRange) {
        const now = new Date()
        const itemDate = new Date(item.createdAt)
        const daysDiff = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24))
        
        switch (filters.dateRange) {
          case 'today':
            if (daysDiff > 0) return false
            break
          case 'week':
            if (daysDiff > 7) return false
            break
          case 'month':
            if (daysDiff > 30) return false
            break
          case 'year':
            if (daysDiff > 365) return false
            break
        }
      }

      return true
    })
  }, [data, filters])

  // Calculate stats
  const stats = useMemo(() => {
    if (!data?.mediaItems) {
      return {
        images: { count: 0, size: 0 },
        videos: { count: 0, size: 0 },
        documents: { count: 0, size: 0 },
        total: { count: 0, size: 0 }
      }
    }
    
    const images = data.mediaItems.filter((item: MediaItem) => item.kind === 'IMAGE')
    const videos = data.mediaItems.filter((item: MediaItem) => item.mime.startsWith('video/'))
    const documents = data.mediaItems.filter((item: MediaItem) => item.mime.startsWith('application/'))
    
    const totalSize = data.mediaItems.reduce((sum: number, item: MediaItem) => sum + item.size, 0)
    const imageSize = images.reduce((sum: number, item: MediaItem) => sum + item.size, 0)
    const videoSize = videos.reduce((sum: number, item: MediaItem) => sum + item.size, 0)
    const documentSize = documents.reduce((sum: number, item: MediaItem) => sum + item.size, 0)

    return {
      images: { count: images.length, size: imageSize },
      videos: { count: videos.length, size: videoSize },
      documents: { count: documents.length, size: documentSize },
      total: { count: data.mediaItems.length, size: totalSize }
    }
  }, [data])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleItemClick = (item: MediaItem) => {
    setSelectedItem(item)
    setDetailDrawerOpen(true)
  }

  const handleEdit = (item: MediaItem) => {
    cmsToasts.info("Edit media", "This feature will be available soon")
  }

  const handleDelete = (item: MediaItem) => {
    cmsToasts.mediaDeleted(item.filename)
  }

  // Show empty state if no media files exist
  if (data && data.mediaItems.length === 0) {
    return (
      <CmsLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
              <p className="text-muted-foreground">
                Manage your images, videos, and other media files.
              </p>
            </div>
            <Button onClick={() => setUploadModalOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Media
            </Button>
          </div>

          <EmptyMediaLibrary />
        </div>
      </CmsLayout>
    )
  }

  return (
    <CmsLayout>
      <MediaLoadingWrapper
        isLoading={isLoading}
        error={error}
        onRetry={handleRetry}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
              <p className="text-muted-foreground">
                Manage your images, videos, and other media files.
              </p>
            </div>
            <Button onClick={() => setUploadModalOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Media
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Images</CardTitle>
                <Image className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.images.count}</div>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(stats.images.size)} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Videos</CardTitle>
                <File className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.videos.count}</div>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(stats.videos.size)} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                <File className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.documents.count}</div>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(stats.documents.size)} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatFileSize(stats.total.size)}</div>
                <p className="text-xs text-muted-foreground">
                  of 1 GB used
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Media Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Media Files</CardTitle>
              <CardDescription>
                Browse and manage your uploaded media files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <MediaFilters
                filters={filters}
                onFiltersChange={setFilters}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalItems={filteredItems.length}
              />

              {filteredItems.length > 0 ? (
                <MediaGrid
                  media={filteredItems}
                  onView={handleItemClick}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  viewMode={viewMode}
                />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Image className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No media files found</p>
                  <p className="text-sm">
                    {Object.values(filters).some(f => f) 
                      ? "Try adjusting your filters or search terms"
                      : "Upload your first file to get started"
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload Modal */}
          <UploadModal
            open={uploadModalOpen}
            onOpenChange={setUploadModalOpen}
            onUpload={handleUpload}
          />

          {/* Detail Drawer */}
          <MediaDetailDrawer
            media={selectedItem}
            isOpen={detailDrawerOpen}
            onClose={() => setDetailDrawerOpen(false)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </MediaLoadingWrapper>
    </CmsLayout>
  )
}
