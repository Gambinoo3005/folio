"use client"

import { useState } from "react"
import { Input } from "@portfolio-building-service/ui"
import { Button } from "@portfolio-building-service/ui"
import { Badge } from "@portfolio-building-service/ui"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@portfolio-building-service/ui"
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  X,
  Calendar,
  HardDrive
} from "lucide-react"

export interface MediaFilters {
  search: string
  type: string
  size: string
  dateRange: string
}

interface MediaFiltersProps {
  filters: MediaFilters
  onFiltersChange: (filters: MediaFilters) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  totalItems: number
}

export function MediaFilters({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  totalItems
}: MediaFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const updateFilter = (key: keyof MediaFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      type: '',
      size: '',
      dateRange: ''
    })
  }

  const hasActiveFilters = filters.search || filters.type || filters.size || filters.dateRange

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.type) count++
    if (filters.size) count++
    if (filters.dateRange) count++
    return count
  }

  return (
    <div className="space-y-4">
      {/* Search and View Controls */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media files..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Advanced Filters</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* File Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <HardDrive className="h-4 w-4 mr-1" />
                File Type
              </label>
              <Select value={filters.type} onValueChange={(value: string) => updateFilter('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* File Size Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">File Size</label>
              <Select value={filters.size} onValueChange={(value: string) => updateFilter('size', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any size</SelectItem>
                  <SelectItem value="small">Small (&lt; 1MB)</SelectItem>
                  <SelectItem value="medium">Medium (1-10MB)</SelectItem>
                  <SelectItem value="large">Large (&gt; 10MB)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Date Range
              </label>
              <Select value={filters.dateRange} onValueChange={(value: string) => updateFilter('dateRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                  <SelectItem value="year">This year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
          {hasActiveFilters && ' found'}
        </span>
        {hasActiveFilters && (
          <div className="flex items-center space-x-2">
            <span>Active filters:</span>
            {filters.search && (
              <Badge variant="secondary" className="text-xs">
                Search: "{filters.search}"
              </Badge>
            )}
            {filters.type && (
              <Badge variant="secondary" className="text-xs">
                Type: {filters.type}
              </Badge>
            )}
            {filters.size && (
              <Badge variant="secondary" className="text-xs">
                Size: {filters.size}
              </Badge>
            )}
            {filters.dateRange && (
              <Badge variant="secondary" className="text-xs">
                Date: {filters.dateRange}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
