'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@portfolio-building-service/ui'
import { Input } from '@portfolio-building-service/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@portfolio-building-service/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@portfolio-building-service/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@portfolio-building-service/ui'
import { 
  Upload, 
  Search, 
  Grid3X3, 
  List, 
  Filter,
  RefreshCw
} from 'lucide-react'
import { MediaUpload } from './media-upload'
import { MediaGrid, MediaItem } from './media-grid'
import { toastHelpers } from '@/lib/toast'

interface MediaListResponse {
  success: boolean
  data: MediaItem[]
  pagination: {
    limit: number
    offset: number
    total: number
    hasMore: boolean
  }
}

export function MediaPageContent() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [kindFilter, setKindFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
    total: 0,
    hasMore: false,
  })

  const fetchMedia = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: reset ? '0' : pagination.offset.toString(),
      })

      if (searchQuery) {
        params.append('search', searchQuery)
      }

      if (kindFilter !== 'all') {
        params.append('kind', kindFilter)
      }

      const response = await fetch(`/api/v1/media?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch media')
      }

      const result: MediaListResponse = await response.json()
      
      if (result.success) {
        setMedia(prev => reset ? result.data : [...prev, ...result.data])
        setPagination(result.pagination)
      } else {
        throw new Error('Failed to fetch media')
      }
    } catch (error) {
      console.error('Error fetching media:', error)
      toastHelpers.error('Failed to load media', 'Please try again')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [searchQuery, kindFilter, pagination.limit, pagination.offset])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setPagination(prev => ({ ...prev, offset: 0 }))
  }, [])

  const handleKindFilter = useCallback((kind: string) => {
    setKindFilter(kind)
    setPagination(prev => ({ ...prev, offset: 0 }))
  }, [])

  const handleUploadComplete = useCallback((results: any[]) => {
    // Refresh the media list
    fetchMedia(true)
    toastHelpers.success('Upload complete', `${results.length} file(s) uploaded successfully`)
  }, [fetchMedia])

  const handleEdit = useCallback((media: MediaItem) => {
    // Refresh the media list to get updated data
    fetchMedia(true)
  }, [fetchMedia])

  const handleDelete = useCallback((media: MediaItem) => {
    // Remove from local state immediately for better UX
    setMedia(prev => prev.filter(item => item.id !== media.id))
    setPagination(prev => ({ ...prev, total: prev.total - 1 }))
  }, [])

  const handleLoadMore = useCallback(() => {
    if (pagination.hasMore && !isLoading) {
      setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))
    }
  }, [pagination.hasMore, isLoading])

  const handleRefresh = useCallback(() => {
    fetchMedia(true)
  }, [fetchMedia])

  // Fetch media on mount and when filters change
  useEffect(() => {
    fetchMedia(true)
  }, [searchQuery, kindFilter])

  // Load more when pagination changes
  useEffect(() => {
    if (pagination.offset > 0) {
      fetchMedia(false)
    }
  }, [pagination.offset])

  if (isLoading && media.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={kindFilter} onValueChange={handleKindFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="IMAGE">Images</SelectItem>
              <SelectItem value="FILE">Files</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
            <TabsList>
              <TabsTrigger value="grid">
                <Grid3X3 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MediaUpload onUploadComplete={handleUploadComplete} />
        </CardContent>
      </Card>

      {/* Media Grid/List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Media Library ({pagination.total} files)
          </h2>
        </div>

        {media.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">
                <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No media found</h3>
                <p className="text-sm">
                  {searchQuery || kindFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Upload your first file to get started'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <MediaGrid
              media={media}
              viewMode={viewMode}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Load More Button */}
            {pagination.hasMore && (
              <div className="flex justify-center pt-6">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
