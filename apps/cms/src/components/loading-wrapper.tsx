"use client"

import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { LoadingState } from "@/components/ui/empty-states"
import { ErrorState } from "@/components/ui/empty-states"

interface LoadingWrapperProps {
  isLoading: boolean
  error?: string | null
  skeleton?: React.ReactNode
  children: React.ReactNode
  onRetry?: () => void
  loadingMessage?: string
  errorTitle?: string
  errorDescription?: string
}

export function LoadingWrapper({
  isLoading,
  error,
  skeleton,
  children,
  onRetry,
  loadingMessage = "Loading...",
  errorTitle = "Something went wrong",
  errorDescription = "We encountered an error while loading your content. Please try again.",
}: LoadingWrapperProps) {
  if (error) {
    return (
      <ErrorState
        title={errorTitle}
        description={errorDescription}
        onRetry={onRetry}
      />
    )
  }

  if (isLoading) {
    if (skeleton) {
      return <>{skeleton}</>
    }
    
    return <LoadingState message={loadingMessage} />
  }

  return <>{children}</>
}

// Specific loading wrappers for different sections
export function DashboardLoadingWrapper({ 
  isLoading, 
  error, 
  children, 
  onRetry 
}: Omit<LoadingWrapperProps, 'skeleton' | 'loadingMessage'>) {
  return (
    <LoadingWrapper
      isLoading={isLoading}
      error={error}
      children={children}
      onRetry={onRetry}
      loadingMessage="Loading dashboard..."
      skeleton={
        <div className="space-y-6">
          <div className="space-y-1">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <div className="mt-4">
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    />
  )
}

export function EditorLoadingWrapper({ 
  isLoading, 
  error, 
  children, 
  onRetry 
}: Omit<LoadingWrapperProps, 'skeleton' | 'loadingMessage'>) {
  return (
    <LoadingWrapper
      isLoading={isLoading}
      error={error}
      children={children}
      onRetry={onRetry}
      loadingMessage="Loading editor..."
      skeleton={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      }
    />
  )
}

export function MediaLoadingWrapper({ 
  isLoading, 
  error, 
  children, 
  onRetry 
}: Omit<LoadingWrapperProps, 'skeleton' | 'loadingMessage'>) {
  return (
    <LoadingWrapper
      isLoading={isLoading}
      error={error}
      children={children}
      onRetry={onRetry}
      loadingMessage="Loading media library..."
      skeleton={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-lg border overflow-hidden">
                <Skeleton className="h-32 w-full" />
                <div className="p-3">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    />
  )
}

export function CollectionsLoadingWrapper({ 
  isLoading, 
  error, 
  children, 
  onRetry 
}: Omit<LoadingWrapperProps, 'skeleton' | 'loadingMessage'>) {
  return (
    <LoadingWrapper
      isLoading={isLoading}
      error={error}
      children={children}
      onRetry={onRetry}
      loadingMessage="Loading collections..."
      skeleton={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Skeleton className="h-8 w-8" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    />
  )
}
