"use client"

import { useState, useMemo } from "react"
import { CmsLayout } from "@/components/cms-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Image, File, Search, HardDrive } from "lucide-react"
import { MediaGrid, MediaItem } from "@/components/media/media-grid"
import { MediaFilters, MediaFilters as MediaFiltersType } from "@/components/media/media-filters"
import { UploadModal } from "@/components/media/upload-modal"
import { MediaDetailDrawer } from "@/components/media/media-detail-drawer"

// Mock data for demonstration
const mockMediaItems: MediaItem[] = [
  {
    id: "1",
    filename: "hero-image.jpg",
    type: "image",
    size: 2048576, // 2MB
    dimensions: { width: 1920, height: 1080 },
    createdAt: new Date("2024-01-15T10:30:00Z"),
    altText: "Beautiful landscape with mountains and lake",
    focalPoint: { x: 50, y: 30 },
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop"
  },
  {
    id: "2",
    filename: "portfolio-project-1.png",
    type: "image",
    size: 1536000, // 1.5MB
    dimensions: { width: 1200, height: 800 },
    createdAt: new Date("2024-01-14T15:45:00Z"),
    altText: "Screenshot of a modern web application dashboard",
    focalPoint: { x: 40, y: 60 },
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop"
  },
  {
    id: "3",
    filename: "demo-video.mp4",
    type: "video",
    size: 15728640, // 15MB
    createdAt: new Date("2024-01-13T09:20:00Z"),
    altText: "Product demonstration video showing key features",
    url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
  },
  {
    id: "4",
    filename: "resume.pdf",
    type: "document",
    size: 512000, // 512KB
    createdAt: new Date("2024-01-12T14:15:00Z"),
    altText: "Professional resume document",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "5",
    filename: "team-photo.jpg",
    type: "image",
    size: 3072000, // 3MB
    dimensions: { width: 1600, height: 1200 },
    createdAt: new Date("2024-01-11T11:30:00Z"),
    altText: "Team photo from company retreat",
    focalPoint: { x: 50, y: 50 },
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=1200&fit=crop"
  },
  {
    id: "6",
    filename: "presentation-slides.pdf",
    type: "document",
    size: 2048000, // 2MB
    createdAt: new Date("2024-01-10T16:00:00Z"),
    altText: "Quarterly business review presentation slides",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
]

export default function Media() {
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

  // Filter and search media items
  const filteredItems = useMemo(() => {
    return mockMediaItems.filter(item => {
      // Search filter
      if (filters.search && !item.filename.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      // Type filter
      if (filters.type && item.type !== filters.type) {
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
        const itemDate = item.createdAt
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
  }, [filters])

  // Calculate stats
  const stats = useMemo(() => {
    const images = mockMediaItems.filter(item => item.type === 'image')
    const videos = mockMediaItems.filter(item => item.type === 'video')
    const documents = mockMediaItems.filter(item => item.type === 'document')
    
    const totalSize = mockMediaItems.reduce((sum, item) => sum + item.size, 0)
    const imageSize = images.reduce((sum, item) => sum + item.size, 0)
    const videoSize = videos.reduce((sum, item) => sum + item.size, 0)
    const documentSize = documents.reduce((sum, item) => sum + item.size, 0)

    return {
      images: { count: images.length, size: imageSize },
      videos: { count: videos.length, size: videoSize },
      documents: { count: documents.length, size: documentSize },
      total: { count: mockMediaItems.length, size: totalSize }
    }
  }, [])

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
    // TODO: Implement edit functionality
    console.log('Edit item:', item)
  }

  const handleDelete = (item: MediaItem) => {
    // TODO: Implement delete functionality
    console.log('Delete item:', item)
  }

  const handleUpload = async (files: any[]) => {
    // TODO: Implement actual upload functionality
    console.log('Upload files:', files)
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

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
                items={filteredItems}
                onItemClick={handleItemClick}
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
          item={selectedItem}
          open={detailDrawerOpen}
          onOpenChange={setDetailDrawerOpen}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </CmsLayout>
  )
}
