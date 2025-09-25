"use client"

import { Skeleton } from "@portfolio-building-service/ui"

export function AuthLoadingSkeleton() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex w-64 border-r bg-card">
        <div className="flex flex-col w-full p-4 space-y-4">
          {/* Logo skeleton */}
          <div className="flex items-center space-x-2 px-2">
            <Skeleton className="h-6 w-16" />
          </div>
          
          {/* Navigation items skeleton */}
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 px-2 py-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex flex-1 flex-col">
        {/* Topbar skeleton */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 md:hidden" />
              <Skeleton className="h-8 w-8 hidden md:flex" />
              <Skeleton className="h-6 w-16" />
            </div>
            
            <div className="hidden md:flex">
              <Skeleton className="h-4 w-32" />
            </div>
            
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </header>

        {/* Main content skeleton */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page header skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>

            {/* Cards grid skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-lg border bg-card p-6">
                  <div className="flex items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>

            {/* Content cards skeleton */}
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-lg border bg-card p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <div key={j} className="flex items-center space-x-4">
                          <Skeleton className="h-2 w-2 rounded-full" />
                          <div className="space-y-1 flex-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
